
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numberElements = document.querySelectorAll('.number');
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme') || 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    generateBtn.addEventListener('click', () => {
        const numbers = generateLotteryNumbers();
        displayNumbers(numbers);
    });

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

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
            const bgColor = getNumberColor(number);
            element.style.backgroundColor = bgColor;
            element.style.color = getNumberTextColor(number);
        });
    }

    function getNumberColor(number) {
        if (number <= 10) return '#f44336'; // Red
        if (number <= 20) return '#ff9800'; // Orange
        if (number <= 30) return '#ffeb3b'; // Yellow
        if (number <= 40) return '#4caf50'; // Green
        return '#2196f3'; // Blue
    }

    function getNumberTextColor(number) {
        return number <= 30 ? '#1e1f22' : '#ffffff';
    }
});
