
let displayValue = '0';
let firstOperand = null;
let operator = null;
// Flag pra saber se o próximo número a ser digitado já é o segundo da conta
let waitingForSecondOperand = false;

const display = document.getElementById('display');


function updateDisplay() {
    // Adiciona uma verificação para evitar que números muito longos quebrem o layout
    if (displayValue.length > 9) {
        display.textContent = parseFloat(displayValue).toPrecision(7);
    } else {
        display.textContent = displayValue;
    }
}

updateDisplay();

// Adiciona event listeners aos botões
const buttons = document.querySelector('.buttons');
buttons.addEventListener('click', (event) => {
    const { target } = event; // Pega o elemento clicado
    
    
    if (!target.matches('button')) {
        return;
    }
    
    const buttonText = target.textContent;

    if (target.classList.contains('clear')) {
        clearCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('igual')) {
        handleEquals();
        updateDisplay();
        return;
    }

    if (['+', '-', 'x', '÷'].includes(buttonText)) {
        handleOperator(buttonText);
        updateDisplay();
        return;
    }

    inputDigit(buttonText);
    updateDisplay();
});

// --- Funções da Lógica da Calculadora ---

function inputDigit(digit) {
    // Se um erro foi exibido, limpa antes de inserir novo dígito
    if(displayValue === 'Erro') {
        clearCalculator();
    }

    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    // Proteção contra NaN caso o usuário clique em um operador sem um número
    if (isNaN(inputValue)) {
        return;
    }

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = operate(firstOperand, inputValue, operator);
        
        // Se a operação resultar em erro (divisão por zero)
        if (result === 'Erro') {
            displayValue = 'Erro';
            return;
        }

        displayValue = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

function handleEquals() {
    if (firstOperand === null || operator === null || waitingForSecondOperand) {
        return;
    }

    const inputValue = parseFloat(displayValue);
    const result = operate(firstOperand, inputValue, operator);

    if (result === 'Erro') {
        displayValue = 'Erro';
    } else {
        displayValue = String(result);
    }
    
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

function clearCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Função para realizar a operação matemática com formatação de resultado
function operate(num1, num2, op) {
    let result;
    switch (op) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case 'x':
            result = num1 * num2;
            break;
        case '÷':
            if (num2 === 0) {
                return 'Erro'; // Retorna string de erro para ser tratada
            }
            result = num1 / num2;
            break;
        default:
            return num2;
    }
    // Arredonda para no máximo 8 casas decimais para evitar problemas de ponto flutuante
    return Math.round(result * 1e8) / 1e8;
}