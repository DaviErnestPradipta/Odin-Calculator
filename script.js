const resultContainer = document.querySelector('.resultContainer');
const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('click', handleButtonClick));

let currentInput = '';
let previousInput = '';
let operator = null;
let isResultDisplayed = false;

function updateDisplay() {
    let displayValue = currentInput || (previousInput && operator) || '0';
    if (displayValue.length > 12) {
        if (displayValue.includes('.') && displayValue.indexOf('.') < 12) 
            displayValue = displayValue.slice(0, 12);
        else displayValue = parseFloat(displayValue).toExponential(2);
    }
    resultContainer.textContent = displayValue;
}

function roundNumber(num, decimals = 2) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function resetCalculator(clearAll = true) {
    currentInput = '';
    if (clearAll) {
        previousInput = '';
        operator = null;
    }
    isResultDisplayed = false;
}

function calculateResult() {
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '×': result = num1 * num2; break;
        case '÷': result = num2 !== 0 ? num1 / num2 : 'NOPE'; break;
    }
    return result !== 'NOPE' ? roundNumber(result).toString() : 'NOPE';
}

function handleButtonClick(event) {
    const buttonValue = event.target.textContent;

    if (!isNaN(buttonValue) || buttonValue === '.') {
        if (isResultDisplayed) resetCalculator();
        if (buttonValue === '.' && currentInput.includes('.')) return;
        currentInput += buttonValue;
    }
    else if (['+', '-', '×', '÷'].includes(buttonValue)) {
        if (currentInput && previousInput && operator) {
            previousInput = calculateResult();
            currentInput = '';
        }
        else if (currentInput) {
            previousInput = currentInput;
            currentInput = '';
        }
        operator = buttonValue;
        isResultDisplayed = false;
    }
    else if (buttonValue === '=') {
        if (previousInput && currentInput && operator) {
            currentInput = calculateResult();
            previousInput = '';
            operator = null;
            isResultDisplayed = true;
        }
    }
    else if (buttonValue === 'CLR') {
        resetCalculator();
    }
    else if (buttonValue === 'DEL') {
        if (isResultDisplayed) resetCalculator(false);
        else currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

updateDisplay();