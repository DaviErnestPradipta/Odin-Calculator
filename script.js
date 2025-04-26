// Start of Initialization

const operatorMap = {
    '*': '×',
    '/': '÷',
    '+': '+',
    '-': '-',
    '×': '*',
    '÷': '/',
};

const specialKeys = {
    '=': 'equals',
    Enter: 'equals',
    CLR: 'clear',
    c: 'clear',
    DEL: 'delete',
    Backspace: 'delete',
    Delete: 'delete',
};

const resultContainer = document.querySelector('.resultContainer');
const buttons = document.querySelectorAll('button');
const maximumResultLength = 11;
buttons.forEach(button => button.addEventListener('click', handleButtonClick));
document.addEventListener('keydown', handleKeyPress);

let currentInput = '';
let previousInput = '';
let operator = null;
let isResultDisplayed = false;

updateDisplay();

// End of Initialization
// Display and Reset Functions

function updateDisplay() {
    let displayValue = currentInput || (previousInput && operator) || '0';
    displayValue = formatDisplayValue(displayValue);
    resultContainer.textContent = displayValue;
}

function formatDisplayValue(value) {
    if (value.length > maximumResultLength) {
        if (value.includes('.') && value.indexOf('.') < 11)
            return value.slice(0, maximumResultLength);
        return parseFloat(value).toExponential(2);
    }
    return value;
}

function resetCalculator(clearAll = true) {
    currentInput = '';
    previousInput = clearAll ? null : previousInput;
    operator = clearAll ? null : operator;
    isResultDisplayed = false;
}

// End of Display and Reset Functions
// Input Handling Functions

function processInput(value) {
    if (value === ' ') return;
    
    const inputType = getInputType(value);
    const handlers = {
        numeric: handleNumericInput,
        operator: handleOperatorInput,
        equals: handleEqualsInput,
        clear: () => resetCalculator(),
        delete: handleDeleteInput,
    };

    if (handlers[inputType]) handlers[inputType](value);
    updateDisplay();
}

function getInputType(value) {
    if (!isNaN(value) || value === '.') return 'numeric';
    if (Object.values(operatorMap).includes(value)) return 'operator';
    return specialKeys[value] || 'unknown';
}

function handleButtonClick(event) {
    const buttonValue = event.target.textContent;
    processInput(buttonValue);
}

function handleKeyPress(event) {
    const value = operatorMap[event.key] || event.key;
    processInput(value);
    highlightButton(value);
}

// End of Input Handling Functions
// Start of Specific Input Handlers

function handleNumericInput(value) {
    if (isResultDisplayed) resetCalculator();
    if (value === '.' && currentInput.includes('.')) return;
    currentInput += value;
}

function handleOperatorInput(value) {
    if (previousInput && currentInput && operator) {
        previousInput = calculateResult();
    }
    else if (currentInput) {
        previousInput = currentInput;
    }

    currentInput = '';
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

// End of Specific Input Handlers
// Start of Calculation Functions

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

// End of Calculation Functions
// Highlighting Function

function highlightButton(value) {
    let normalizedValue = value;

    if (specialKeys[value]) {
        normalizedValue = Object.keys(specialKeys).find(key => specialKeys[key] === specialKeys[value]);
    }

    const button = Array.from(buttons).find(btn => btn.textContent.trim() === normalizedValue);

    if (button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 100);
    }
}

// End of Highlighting Function