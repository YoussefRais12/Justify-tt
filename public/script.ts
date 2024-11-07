let remainingWords = 80000; // Initial limit
let resetDate: string = ''; // Date when usage resets

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
    const response = await fetch("http://localhost:3000/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await response.json();

    if (response.ok) {
      // Hide the token but store it internally
      tokenInput.value = data.token;
      outputDiv.textContent = "Token generated successfully!";
      
      // Show the justify section, reset remaining words, and set reset date
      justifySection.style.display = "block";
      remainingWords = 80000;
      resetDate = new Date().toISOString().slice(0, 10); // Set the reset date to today
      updateUsageInfo();
    } else {
      outputDiv.textContent = "Error: " + data.error;
    }
  } catch (error) {
    outputDiv.textContent = "Error generating token.";
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

  // Check if the word count exceeds remaining words before making the request
  if (wordCount > remainingWords) {
    outputDiv.textContent = "Erreur 402: Payment Required - Vous avez dépassé votre limite de mots quotidienne.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/justify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
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
      // Display specific error message for exceeded word limit
      outputDiv.textContent = "Erreur 402: Payment Required - Vous avez dépassé votre limite de mots quotidienne.";
    } else {
      outputDiv.textContent = "Error: " + await response.text();
    }
  } catch (error) {
    outputDiv.textContent = "Error justifying text.";
    console.error(error);
  }
}