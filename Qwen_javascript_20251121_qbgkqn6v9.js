// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');

        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Attach event listeners to checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.addEventListener('change', calculateTotals));

    // Initial calculation
    calculateTotals();
});

function calculateTotals() {
    let weekly = 0, daily = 0, fourHour = 0, oneHour = 0, entry = 0;

    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const val = parseFloat(checkbox.dataset.value);
        switch (checkbox.dataset.timeframe) {
            case 'weekly': weekly += val; break;
            case 'daily': daily += val; break;
            case '4hour': fourHour += val; break;
            case '1hour': oneHour += val; break;
            case 'entry': entry += val; break;
        }
    });

    const grandTotal = weekly + daily + fourHour + oneHour + entry;

    // Update UI
    document.getElementById('total-weekly').textContent = weekly + '%';
    document.getElementById('total-daily').textContent = daily + '%';
    document.getElementById('total-4hour').textContent = fourHour + '%';
    document.getElementById('total-1hour').textContent = oneHour + '%';
    document.getElementById('entry-signal').textContent = entry + '%';
    document.getElementById('grand-total').textContent = grandTotal + '%';

    updateGrade(grandTotal);
}

function updateGrade(score) {
    const el = document.getElementById('grade-display');
    el.className = 'grade-display';

    if (score >= 90) {
        el.textContent = 'Grade: A+';
        el.classList.add('grade-a');
    } else if (score >= 80) {
        el.textContent = 'Grade: B+';
        el.classList.add('grade-b');
    } else if (score >= 70) {
        el.textContent = 'Grade: C+';
        el.classList.add('grade-c');
    } else {
        el.textContent = 'Grade: D+';
        el.classList.add('grade-d');
    }
}