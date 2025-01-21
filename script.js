const containerElement = document.querySelector('.container');
const leftSideElement = document.querySelector('.left-side');
const optionToggle = document.getElementById('option-toggle');
const toggleDiv = document.getElementById('toggle');
const generateButton = document.querySelector('button');
const formContainer = document.getElementById('form-container');
const numberContainer = document.getElementById('number-container');
const inputFields = document.querySelectorAll('.number-field input');
const questionsContainer = document.getElementById('questions');
const resultContainerElement = document.getElementById('result-container');
const headerText = document.querySelector('h4');
const generateAgainButton = resultContainerElement.querySelector('button');
const resultTextSpan = document.querySelector('#result-text p span');
let resultCount = 1;

generateAgainButton.addEventListener('click', () => {
    resultCount++;
    resultTextSpan.textContent = `${resultCount}${['st', 'nd', 'rd'][((resultCount + 90) % 100 - 10) % 10 - 1] || 'th'}`;
    handleGenerateButtonClick();
});

const toggleFunction = () => {
    toggleDiv.classList.toggle('active');
    toggleDiv.classList.toggle('default', !toggleDiv.classList.contains('active'));
};

const addQuestionItem = ({ title, description }) => {
    const questionItem = document.createElement('div');
    questionItem.className = 'item';
    questionItem.innerHTML = `
        <img src="./assets/icons/questions-icon.svg" alt="">
        <div class="text-container">
            <p class="pm">${title}</p>
            <p class="ps">${description}</p>
        </div>
    `;
    questionsContainer.appendChild(questionItem);
};

const handleInputFocus = input => {
    input.addEventListener('focus', () => input.closest('.number-field').classList.add('focused'));
    input.addEventListener('blur', () => input.closest('.number-field').classList.remove('focused'));
};

const handleGenerateButtonClick = () => {
    const [numbers, min, max] = [...inputFields].map(input => parseInt(input.value));
    if (numbers > max - min + 1 && toggleDiv.classList.contains('active')) {
        alert('It is not possible to generate unique numbers with the specified interval.');
        return;
    }

    const results = [];
    const usedNumbers = new Set();
    while (results.length < numbers) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (toggleDiv.classList.contains('active') ? !usedNumbers.has(randomNumber) : true) {
            usedNumbers.add(randomNumber);
            results.push(randomNumber);
        }
    }

    numberContainer.innerHTML = results.map((result, index) => `
        <div class="animation-number" style="${index > 0 ? 'display: none;' : ''}">
            <div class="retangle"></div>
            <p class="result">${result}</p>
        </div>
    `).join('');

    generateAgainButton.classList.remove('visible');

    const showNextNumber = index => {
        if (index >= numberContainer.children.length) {
            generateAgainButton.classList.add('visible');
            headerText.classList.add('font-size-14');
            return;
        }
        const currentNumber = numberContainer.children[index];
        currentNumber.style.display = 'flex';
        currentNumber.addEventListener('animationend', () => setTimeout(() => showNextNumber(index + 1), 1500));
    };

    showNextNumber(0);
    resultContainerElement.style.display = 'flex';
    formContainer.classList.add('hidden');
};

const validateInput = input => {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value === '' && input !== document.activeElement) input.value = input.getAttribute('value');
};

const moveQuestionsElement = () => {
    const screenWidth = window.innerWidth;
    const breakpoint = 60 * 16;
    const targetParent = screenWidth < breakpoint ? containerElement : leftSideElement;
    targetParent.appendChild(questionsContainer);
};

const questions = [
    {
        title: 'How does the number generator work?',
        description: 'The generator uses a random number generation algorithm to create numbers within the interval specified by the user.',
    },
    {
        title: 'Can I choose the number interval?',
        description: 'Yes, you can choose the number interval by setting the minimum and maximum values in the input fields.',
    },
];

inputFields.forEach(input => {
    handleInputFocus(input);
    input.addEventListener('input', () => validateInput(input));
    input.addEventListener('blur', () => validateInput(input));
});

generateButton.addEventListener('click', handleGenerateButtonClick);
optionToggle.addEventListener('click', toggleFunction);

document.addEventListener('DOMContentLoaded', () => {
    questions.forEach(addQuestionItem);
    moveQuestionsElement();
    new ResizeObserver(moveQuestionsElement).observe(document.body);
});