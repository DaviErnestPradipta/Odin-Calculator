const resultContainer = document.querySelector('.resultContainer');
const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('click', handleButtonClick));

let currentInput = '';
let previousInput = '';
let operator = null;
let isResultDisplayed = false;

function updateDisplay() {
    let displayValue = currentInput || (previousInput && operator) || '0';
    displayValue = formatDisplayValue(displayValue);
    resultContainer.textContent = displayValue;
}

function formatDisplayValue(value) {
    if (value.length > 12) {
        if (value.includes('.') && value.indexOf('.') < 12) return value.slice(0, 12);
        return parseFloat(value).toExponential(2);
    }
    return value;
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
    const result = performOperation(num1, num2, operator);
    return result !== 'NOPE' ? roundNumber(result).toString() : 'NOPE';
}

function performOperation(num1, num2, operator) {
    switch (operator) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '×': return num1 * num2;
        case '÷': return num2 !== 0 ? num1 / num2 : 'NOPE';
        default: return null;
    }
}

function handleButtonClick(event) {
    const buttonValue = event.target.textContent;

    if (isNumericOrDot(buttonValue)) handleNumericInput(buttonValue);
    else if (isOperator(buttonValue)) handleOperatorInput(buttonValue);
    else if (buttonValue === '=') handleEqualsInput();
    else if (buttonValue === 'CLR') resetCalculator();
    else if (buttonValue === 'DEL') handleDeleteInput();

    updateDisplay();
}

function isNumericOrDot(value) {
    return !isNaN(value) || value === '.';
}

function isOperator(value) {
    return ['+', '-', '×', '÷'].includes(value);
}

function handleNumericInput(value) {
    if (isResultDisplayed) resetCalculator();
    if (value === '.' && currentInput.includes('.')) return;
    currentInput += value;
}

function handleOperatorInput(value) {
    if (currentInput && previousInput && operator) {
        previousInput = calculateResult();
        currentInput = '';
    }
    else if (currentInput) {
        previousInput = currentInput;
        currentInput = '';
    }
    operator = value;
    isResultDisplayed = false;
}

function handleEqualsInput() {
    if (previousInput && currentInput && operator) {
        currentInput = calculateResult();
        previousInput = '';
        operator = null;
        isResultDisplayed = true;
    }
}

function handleDeleteInput() {
    if (isResultDisplayed) resetCalculator(false);
    else currentInput = currentInput.slice(0, -1);
}

updateDisplay();