const resultContainer = document.querySelector('.resultContainer');
const buttons = document.querySelectorAll('button');

let currentInput = '';
let previousInput = '';
let operator = null;

function updateDisplay() {
    let displayValue = currentInput || (previousInput && operator) || '0';

    // Truncate the display value to fit within 12 characters
    if (displayValue.length > 12) {
        if (displayValue.includes('.') && displayValue.indexOf('.') < 12) {
            // If there's a decimal point within the first 12 characters, truncate after it
            displayValue = displayValue.slice(0, 12);
        } else {
            // Otherwise, use scientific notation for large numbers
            displayValue = parseFloat(displayValue).toExponential(2);
        }
    }

    resultContainer.textContent = displayValue;
}

function roundNumber(num, decimals = 10) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function handleButtonClick(event) {
    const buttonValue = event.target.textContent;

    if (!isNaN(buttonValue) || buttonValue === '.') {
        if (buttonValue === '.' && currentInput.includes('.')) return;
        currentInput += buttonValue;
    }
    else if (['+', '-', '×', '÷'].includes(buttonValue)) {
        if (currentInput && previousInput && operator) {
            // Perform intermediate calculation
            const num1 = parseFloat(previousInput);
            const num2 = parseFloat(currentInput);
            let result;
            switch (operator) {
                case '+': result = num1 + num2; break;
                case '-': result = num1 - num2; break;
                case '×': result = num1 * num2; break;
                case '÷': result = num2 !== 0 ? num1 / num2 : 'NOPE'; break;
            }
            previousInput = result !== 'NOPE' ? roundNumber(result).toString() : 'NOPE';
            currentInput = '';
        } else if (currentInput) {
            // If no intermediate calculation, move currentInput to previousInput
            previousInput = currentInput;
            currentInput = '';
        }
        operator = buttonValue; // Update the operator
    }
    else if (buttonValue === '=') {
        if (previousInput && currentInput && operator) {
            const num1 = parseFloat(previousInput);
            const num2 = parseFloat(currentInput);
            let result;
            switch (operator) {
                case '+': result = num1 + num2; break;
                case '-': result = num1 - num2; break;
                case '×': result = num1 * num2; break;
                case '÷': result = num2 !== 0 ? num1 / num2 : 'NOPE'; break;
            }
            currentInput = result !== 'NOPE' ? roundNumber(result).toString() : 'NOPE';
            previousInput = '';
            operator = null;
        }
    }
    else if (buttonValue === 'CLR') {
        currentInput = '';
        previousInput = '';
        operator = null;
    }
    else if (buttonValue === 'DEL') {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

buttons.forEach(button => button.addEventListener('click', handleButtonClick));

updateDisplay();