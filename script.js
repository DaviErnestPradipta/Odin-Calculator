const resultContainer = document.querySelector('.resultContainer');
const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('click', handleButtonClick));

let currentInput = '';
let previousInput = '';
let operator = null;

function updateDisplay() {
    let displayValue = currentInput || (previousInput && operator) || '0';
    if (displayValue.length > 12) {
        if (displayValue.includes('.') && displayValue.indexOf('.') < 12) 
            displayValue = displayValue.slice(0, 12);
        else displayValue = parseFloat(displayValue).toExponential(2);
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
        }
        else if (currentInput) {
            previousInput = currentInput;
            currentInput = '';
        }
        operator = buttonValue;
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
    else if (buttonValue === 'DEL') currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

updateDisplay();