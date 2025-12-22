const display = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");
const themeToggle = document.getElementById("themeToggle");

let expression = "";

/* Button clicks */
buttons.forEach(btn => {
    btn.addEventListener("click", () => handleInput(btn.innerText));
});

/* Keyboard support */
document.addEventListener("keydown", (e) => {
    const key = e.key;

    if ("0123456789+-*/.%".includes(key)) {
        handleInput(key);
    } 
    else if (key === "Enter") {
        handleInput("=");
    } 
    else if (key === "Backspace") {
        handleInput("DEL");
    } 
    else if (key === "Escape") {
        handleInput("AC");
    }
});

/* Core logic */
function handleInput(value) {
    if (value === "AC") {
        expression = "";
        display.value = "";
    }

    else if (value === "DEL") {
        expression = expression.slice(0, -1);
        display.value = expression;
    }

    else if (value === "=") {
        try {
            expression = eval(expression).toString();
            display.value = expression;
        } catch {
            display.value = "Error";
            expression = "";
        }
    }

    else {
        expression += value;
        display.value = expression;
    }
}

/* Theme toggle */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent =
        document.body.classList.contains("light") ? "🌞" : "🌙";
});
