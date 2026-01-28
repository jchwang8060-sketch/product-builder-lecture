
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numberElements = document.querySelectorAll('.number');

    generateBtn.addEventListener('click', () => {
        const numbers = generateLotteryNumbers();
        displayNumbers(numbers);
    });

    function generateLotteryNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers);
    }

    function displayNumbers(numbers) {
        numberElements.forEach((element, index) => {
            const number = numbers[index];
            element.textContent = number;
            element.style.backgroundColor = getNumberColor(number);
            element.style.color = 'white';
        });
    }

    function getNumberColor(number) {
        if (number <= 10) return '#f44336'; // Red
        if (number <= 20) return '#ff9800'; // Orange
        if (number <= 30) return '#ffeb3b'; // Yellow
        if (number <= 40) return '#4caf50'; // Green
        return '#2196f3'; // Blue
    }
});
