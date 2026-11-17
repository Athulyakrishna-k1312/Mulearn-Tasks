
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const equalButton = document.querySelector(".equal");
const clearButton = document.querySelector(".clear");
const deleteButton = document.querySelector(".delete");

let currentNumber = "0";
let previousNumber = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.textContent = currentNumber;
    previousDisplay.textContent = operator
        ? `${previousNumber} ${operator}`
        : "";
}

function addNumber(number) {
    if (currentNumber === "Error") {
        currentNumber = "0";
    }

    if (number === "." && currentNumber.includes(".") && !shouldResetDisplay) {
        return;
    }

    if (shouldResetDisplay) {
        currentNumber = number === "." ? "0." : number;
        shouldResetDisplay = false;
    } else {
        if (currentNumber === "0" && number !== ".") {
            currentNumber = number;
        } else {
            currentNumber += number;
        }
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentNumber === "Error") return;

    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }

    previousNumber = currentNumber;
    operator = selectedOperator;
    shouldResetDisplay = true;

    updateDisplay();
}

function calculate() {
    if (operator === null || shouldResetDisplay) return;

    const first = parseFloat(previousNumber);
    const second = parseFloat(currentNumber);

    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":
            if (second === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operator = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = first / second;
            break;
    }

    currentNumber = String(Number(result.toFixed(10)));
    previousNumber = "";
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function clearCalculator() {
    currentNumber = "0";
    previousNumber = "";
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteNumber() {
    if (currentNumber === "Error" || shouldResetDisplay) return;

    currentNumber = currentNumber.slice(0, -1);

    if (currentNumber === "" || currentNumber === "-") {
        currentNumber = "0";
    }

    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        addNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

equalButton.addEventListener("click", calculate);
clearButton.addEventListener("click", clearCalculator);
deleteButton.addEventListener("click", deleteNumber);

document.addEventListener("keydown", event => {
    if (/^[0-9.]$/.test(event.key)) {
        addNumber(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteNumber();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();
