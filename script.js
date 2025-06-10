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
    const result = evaluateExpression(currentInput);
    outputDisplay.textContent = result;
    addToHistory(currentInput, result);
    currentInput = result.toString();
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

// --- jednoduchý parser s podporou +, -, *, /, ^ a záporných čísel --- 

function evaluateExpression(expr) {
  expr = expr.replace(/\s+/g, ""); 
  if (expr === "") throw new Error("Empty expression");

  function roundResult(num) {
    return Math.round((num + Number.EPSILON) * 1e10) / 1e10;
  }

  function findMainOperator(expression, operators) {
    let bracketLevel = 0;
    for (let i = expression.length - 1; i >= 0; i--) {
      const ch = expression[i];
      if (ch === ")") bracketLevel++;
      else if (ch === "(") bracketLevel--;
      else if (bracketLevel === 0 && operators.includes(ch)) {
        if (ch === "-" && (i === 0 || "+-*/^(".includes(expression[i - 1]))) {
          continue;
        }
        return i;
      }
    }
    return -1;
  }

  if (expr.startsWith("(") && expr.endsWith(")")) {
    let level = 0;
    let balanced = true;
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] === "(") level++;
      else if (expr[i] === ")") level--;
      if (level === 0 && i < expr.length - 1) balanced = false;
    }
    if (balanced) {
      return evaluateExpression(expr.substring(1, expr.length -1));
    }
  }

  let index = findMainOperator(expr, "+-");
  if (index !== -1) {
    const left = expr.substring(0, index);
    const right = expr.substring(index + 1);
    const op = expr[index];
    if (op === "+") return roundResult(evaluateExpression(left) + evaluateExpression(right));
    else if (op === "-") return roundResult(evaluateExpression(left) - evaluateExpression(right));
  }

  index = findMainOperator(expr, "*/");
  if (index !== -1) {
    const left = expr.substring(0, index);
    const right = expr.substring(index + 1);
    const op = expr[index];
    if (op === "*") return roundResult(evaluateExpression(left) * evaluateExpression(right));
    else if (op === "/") return roundResult(evaluateExpression(left) / evaluateExpression(right));
  }

  index = findMainOperator(expr, "^");
  if (index !== -1) {
    const left = expr.substring(0, index);
    const right = expr.substring(index + 1);
    return roundResult(Math.pow(evaluateExpression(left), evaluateExpression(right)));
  }

  if (expr[0] === "-") {
    return roundResult(-evaluateExpression(expr.substring(1)));
  }

  if (!isNaN(expr)) {
    return roundResult(parseFloat(expr));
  }

  throw new Error("Invalid expression");
}
