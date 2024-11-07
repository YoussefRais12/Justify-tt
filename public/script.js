var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var remainingWords = 80000; // Initial limit
var resetDate = ''; // Date when usage resets
function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
function updateUsageInfo() {
    var remainingWordsElement = document.getElementById('remainingWords');
    var resetDateElement = document.getElementById('resetDate');
    remainingWordsElement.textContent = remainingWords.toLocaleString();
    resetDateElement.textContent = formatDate(resetDate);
}
function generateToken() {
    return __awaiter(this, void 0, void 0, function () {
        var emailInput, outputDiv, justifySection, tokenInput, email, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emailInput = document.getElementById("email");
                    outputDiv = document.getElementById("tokenOutput");
                    justifySection = document.getElementById("justifySection");
                    tokenInput = document.getElementById("token");
                    email = emailInput.value;
                    if (!email) {
                        alert("Please enter a valid email.");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/token", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: email })
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        // Hide the token but store it internally
                        tokenInput.value = data.token;
                        outputDiv.textContent = "Token generated successfully!";
                        // Show the justify section, reset remaining words, and set reset date
                        justifySection.style.display = "block";
                        remainingWords = 80000;
                        resetDate = new Date().toISOString().slice(0, 10); // Set the reset date to today
                        updateUsageInfo();
                    }
                    else {
                        outputDiv.textContent = "Error: " + data.error;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    outputDiv.textContent = "Error generating token.";
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function justifyText() {
    return __awaiter(this, void 0, void 0, function () {
        var tokenInput, textInput, outputDiv, token, textToJustify, wordCount, response, data, _a, _b, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tokenInput = document.getElementById("token");
                    textInput = document.getElementById("textToJustify");
                    outputDiv = document.getElementById("justifyOutput");
                    token = tokenInput.value.trim();
                    textToJustify = textInput.value;
                    wordCount = textToJustify.split(/\s+/).length;
                    if (!token || !textToJustify) {
                        alert("Please enter both token and text to justify.");
                        return [2 /*return*/];
                    }
                    // Check if the word count exceeds remaining words before making the request
                    if (wordCount > remainingWords) {
                        outputDiv.textContent = "Erreur 402: Payment Required - Vous avez dépassé votre limite de mots quotidienne.";
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, fetch("http://localhost:3000/api/justify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token
                            },
                            body: JSON.stringify({ text: textToJustify })
                        })];
                case 2:
                    response = _c.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    data = _c.sent();
                    outputDiv.textContent = data;
                    // Update remaining words count
                    remainingWords -= wordCount;
                    updateUsageInfo();
                    return [3 /*break*/, 7];
                case 4:
                    if (!(response.status === 402)) return [3 /*break*/, 5];
                    // Display specific error message for exceeded word limit
                    outputDiv.textContent = "Erreur 402: Payment Required - Vous avez dépassé votre limite de mots quotidienne.";
                    return [3 /*break*/, 7];
                case 5:
                    _a = outputDiv;
                    _b = "Error: ";
                    return [4 /*yield*/, response.text()];
                case 6:
                    _a.textContent = _b + (_c.sent());
                    _c.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_2 = _c.sent();
                    outputDiv.textContent = "Error justifying text.";
                    console.error(error_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
