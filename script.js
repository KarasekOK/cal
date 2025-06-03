const inputDisplay = document.getElementById("calculator-input");
const outputDisplay = document.getElementById("calculator-output");
const buttons = document.querySelectorAll(".calculator-buttons button");
const historyDisplay = document.getElementById("history-display");
const clearAllBtn = document.getElementById("clear-all-btn");
const clearBtn = document.getElementById("clear-btn");
const equalBtn = document.getElementById("equal-sign");
const clearHistoryBtn = document.getElementById("clear-history-btn");

let currentInput = "";

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.value;

    if (value === "=") {
      calculateResult();
    }
    else if (button.id === "clear-btn") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
    else if (button.id === "clear-all-btn") {
      currentInput = "";
      outputDisplay.textContent = "0";
      updateDisplay();
    }
    else {
      currentInput += value;
      updateDisplay();
    }
  });
});

function calculateResult() {
  try {
    // Nahrazení ^ za ** pro umocňování v JS
    const expression = currentInput.replace(/\^/g, "**");

    const result = eval(expression);
    outputDisplay.textContent = result;

    addToHistory(currentInput, result);
    currentInput = result.toString(); // pro další výpočty
  } catch (error) {
    outputDisplay.textContent = "Error";
  }
}

function updateDisplay() {
  inputDisplay.textContent = currentInput || "0";
}

function addToHistory(expression, result) {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  historyItem.textContent = `${expression} = ${result}`;
  historyDisplay.prepend(historyItem);
}

clearHistoryBtn.addEventListener("click", () => {
  historyDisplay.innerHTML = "";
});
