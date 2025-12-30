const display = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");
const sciButtons = document.querySelectorAll(".sci");
const themeToggle = document.getElementById("themeToggle");
const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const modeToggle = document.getElementById("modeToggle");
const scientificPad = document.getElementById("scientificPad");

let expression = "";
let sciMode = false;
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

/* ---------- Utilities ---------- */
function updateDisplay(val) {
    display.value = val;
}

function toRadians(deg) {
    return deg * Math.PI / 180;
}

/* ---------- Safe Evaluation ---------- */
function evaluateExpression(exp) {
    exp = exp
        .replace(/π/g, Math.PI)
        .replace(/√/g, "Math.sqrt")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log");

    return Function(`"use strict"; return (${exp})`)();
}

/* ---------- History ---------- */
function saveHistory(exp, res) {
    history.unshift(`${exp} = ${res}`);
    history = history.slice(0, 10);
    localStorage.setItem("calcHistory", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(h => {
        const li = document.createElement("li");
        li.textContent = h;
        li.onclick = () => {
            expression = h.split("=")[0].trim();
            updateDisplay(expression);
        };
        historyList.appendChild(li);
    });
}
renderHistory();

/* ---------- Input ---------- */
buttons.forEach(btn =>
    btn.addEventListener("click", () => handleInput(btn.innerText))
);

sciButtons.forEach(btn =>
    btn.addEventListener("click", () => handleInput(btn.innerText))
);

function handleInput(val) {
    if (val === "AC") {
        expression = "";
        updateDisplay("");
        return;
    }

    if (val === "DEL") {
        expression = expression.slice(0, -1);
        updateDisplay(expression);
        return;
    }

    if (val === "=") {
        try {
            const result = evaluateExpression(expression);
            saveHistory(expression, result);
            expression = result.toString();
            updateDisplay(expression);
        } catch {
            updateDisplay("Error");
            expression = "";
        }
        return;
    }

    if (["sin", "cos", "tan", "log", "ln"].includes(val)) {
        expression += val + "(";
    } else {
        expression += val;
    }

    updateDisplay(expression);
}

/* ---------- Mode Toggle ---------- */
modeToggle.addEventListener("click", () => {
    sciMode = !sciMode;
    scientificPad.classList.toggle("hidden");
    modeToggle.textContent = sciMode ? "NORM" : "SCI";
});

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

/* ---------- Keyboard Support ---------- */
document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (!isNaN(key)) {        // Number keys
        handleInput(key);
    } else if ("+-*/.%".includes(key)) { // Operators
        handleInput(key);
    } else if (key === "Enter") {       // Equals
        handleInput("=");
    } else if (key === "Backspace") {   // Delete
        handleInput("DEL");
    } else if (key === "Escape") {      // Clear
        handleInput("AC");
    }
});
