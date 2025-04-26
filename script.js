const resultContainer = document.querySelector('.resultContainer');
const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('click', handleButtonClick));
document.addEventListener('keydown', handleKeyPress);

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

function resetCalculator(clearAll = true) {
    currentInput = '';
    if (clearAll) {
        previousInput = '';
        operator = null;
    }
    isResultDisplayed = false;
}

function calculateResult() {
    try {
        const num1 = new Decimal(previousInput || 0);
        const num2 = new Decimal(currentInput || 0);
        const result = performOperation(num1, num2, operator);
        
        if (result !== 'NOPE') {
            const roundedResult = result.toNumber();
            if (Math.abs(roundedResult - Math.round(roundedResult)) < 1e-10)
                return Math.round(roundedResult).toString();
            return result.toString();
        }

        return 'NOPE';
    }
    catch {
        return 'NOPE';
    }
}

function performOperation(num1, num2, operator) {
    switch (operator) {
        case '+': return num1.plus(num2);
        case '-': return num1.minus(num2);
        case '×': return num1.times(num2);
        case '÷': return !num2.isZero() ? num1.div(num2) : 'NOPE';
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

function isOperatorKey(key) {
    return ['+', '-', '*', '/'].includes(key);
}

function convertOperatorKey(key) {
    switch (key) {
        case '*': return '×';
        case '/': return '÷';
        default: return key;
    }
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

function handleKeyPress(event) {
    const key = event.key;

    if (isNumericOrDot(key)) handleNumericInput(key);
    else if (isOperatorKey(key)) handleOperatorInput(convertOperatorKey(key));
    else if (key === '=' || key === 'Enter') handleEqualsInput();
    else if (key === 'Backspace') handleDeleteInput();
    else if (key.toLowerCase() === 'c') resetCalculator();

    highlightButton(key);
    updateDisplay();
}

function highlightButton(key) {
    const button = Array.from(buttons).find(btn => {
        const text = btn.textContent;
        return text === key || (key === 'Enter' && text === '=') || (key === 'Backspace' && text === 'DEL') || (key.toLowerCase() === 'c' && text === 'CLR');
    });

    if (button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 100);
    }
}

updateDisplay();