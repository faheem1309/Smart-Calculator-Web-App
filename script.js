const display = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");
const themeToggle = document.getElementById("themeToggle");
const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let expression = "";
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

/* ---------- Core ---------- */

function updateDisplay(value) {
    display.value = value;
}

function isValidExpression(exp) {
    return /^[0-9+\-*/.%() ]+$/.test(exp);
}

function safeEvaluate(exp) {
    if (!isValidExpression(exp)) throw Error("Invalid");
    return Function(`"use strict"; return (${exp})`)();
}

/* ---------- History ---------- */

function saveHistory(exp, result) {
    history.unshift(`${exp} = ${result}`);
    history = history.slice(0, 10);
    localStorage.setItem("calcHistory", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.onclick = () => {
            expression = item.split("=")[0].trim();
            updateDisplay(expression);
        };
        historyList.appendChild(li);
    });
}

renderHistory();

/* ---------- Input Handling ---------- */

buttons.forEach(btn => {
    btn.addEventListener("click", () => handleInput(btn.innerText));
});

document.addEventListener("keydown", e => {
    if ("0123456789+-*/.%".includes(e.key)) handleInput(e.key);
    if (e.key === "Enter") handleInput("=");
    if (e.key === "Backspace") handleInput("DEL");
    if (e.key === "Escape") handleInput("AC");
});

function handleInput(value) {
    if (value === "AC") {
        expression = "";
        updateDisplay("");
        return;
    }

    if (value === "DEL") {
        expression = expression.slice(0, -1);
        updateDisplay(expression);
        return;
    }

    if (value === "=") {
        try {
            const result = safeEvaluate(expression);
            saveHistory(expression, result);
            expression = result.toString();
            updateDisplay(expression);
        } catch {
            updateDisplay("Error");
            expression = "";
        }
        return;
    }

    expression += value;
    updateDisplay(expression);
}

/* ---------- Theme ---------- */

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent =
        document.body.classList.contains("light") ? "🌞" : "🌙";
});

/* ---------- History Toggle ---------- */

historyToggle.addEventListener("click", () => {
    historyPanel.style.display =
        historyPanel.style.display === "block" ? "none" : "block";
});

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    localStorage.removeItem("calcHistory");
    renderHistory();
});
