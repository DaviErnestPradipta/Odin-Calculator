const resultContainer = document.querySelector('.resultContainer');
const buttons = document.querySelectorAll('button');

let currentInput = '';
let previousInput = '';
let operator = null;

function updateDisplay() {
    if (currentInput) resultContainer.textContent = currentInput;
    else if (previousInput && operator) resultContainer.textContent = operator;
    else resultContainer.textContent = '0';
}

function handleButtonClick(event) {
    const buttonValue = event.target.textContent;

    if (!isNaN(buttonValue) || buttonValue === '.') {
        if (buttonValue === '.' && currentInput.includes('.')) return;
        currentInput += buttonValue;
    }
    else if (['+', '-', '×', '÷'].includes(buttonValue)) {
        if (currentInput) {
            previousInput = currentInput;
            currentInput = '';
        }
        operator = buttonValue;
    }
    else if (buttonValue === '=') {
        if (previousInput && currentInput && operator) {
            const num1 = parseFloat(previousInput);
            const num2 = parseFloat(currentInput);
            switch (operator) {
                case '+': currentInput = (num1 + num2).toString(); break;
                case '-': currentInput = (num1 - num2).toString(); break;
                case '×': currentInput = (num1 * num2).toString(); break;
                case '÷': currentInput = num2 !== 0 ? (num1 / num2).toString() : 'NOPE'; break;
            }
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

buttons.forEach(button => button.addEventListener('click', handleButtonClick));

updateDisplay();