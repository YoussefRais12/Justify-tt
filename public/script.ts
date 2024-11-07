// Use an environment variable for the API base URL or default to localhost
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

let remainingWords = 80000; // Initial word limit
let resetDate: string = ''; // Date when word limit resets

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function updateUsageInfo() {
  const remainingWordsElement = document.getElementById('remainingWords') as HTMLSpanElement;
  const resetDateElement = document.getElementById('resetDate') as HTMLSpanElement;

  remainingWordsElement.textContent = remainingWords.toLocaleString();
  resetDateElement.textContent = formatDate(resetDate);
}

async function generateToken() {
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const outputDiv = document.getElementById("tokenOutput") as HTMLDivElement;
  const justifySection = document.getElementById("justifySection") as HTMLElement;
  const tokenInput = document.getElementById("token") as HTMLInputElement;
  
  const email = emailInput.value;

  if (!email) {
    alert("Please enter a valid email.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await response.json();

    if (response.ok) {
      tokenInput.value = data.token; // Store token internally
      outputDiv.textContent = "Token generated successfully!";
      
      justifySection.style.display = "block";
      remainingWords = 80000; // Reset word limit
      resetDate = new Date().toISOString().slice(0, 10); // Set reset date to today
      updateUsageInfo();
    } else {
      outputDiv.textContent = "Error: " + data.error;
    }
  } catch (error) {
    outputDiv.textContent = "Error generating token. Please try again.";
    console.error(error);
  }
}

async function justifyText() {
  const tokenInput = document.getElementById("token") as HTMLInputElement;
  const textInput = document.getElementById("textToJustify") as HTMLTextAreaElement;
  const outputDiv = document.getElementById("justifyOutput") as HTMLDivElement;

  const token = tokenInput.value.trim();
  const textToJustify = textInput.value;
  const wordCount = textToJustify.split(/\s+/).length;

  if (!token || !textToJustify) {
    alert("Please enter both token and text to justify.");
    return;
  }

  if (wordCount > remainingWords) {
    outputDiv.textContent = "Erreur 402: Payment Required - Vous avez dépassé votre limite de mots quotidienne.";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/justify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ text: textToJustify })
    });

    if (response.ok) {
      const data = await response.text();
      outputDiv.textContent = data;

      // Update remaining words count
      remainingWords -= wordCount;
      updateUsageInfo();
    } else if (response.status === 402) {
      outputDiv.textContent = "Erreur 402: Payment Required - Vous avez dépassé votre limite de mots quotidienne.";
    } else {
      outputDiv.textContent = `Error: ${await response.text()}`;
    }
  } catch (error) {
    outputDiv.textContent = "Error justifying text. Please try again.";
    console.error(error);
  }
}
