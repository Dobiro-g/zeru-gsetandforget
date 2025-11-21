document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const resetBtn = document.getElementById('resetBtn');
    const body = document.body;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Track if user has interacted (to distinguish fresh load vs. 0 after interaction)
    let hasInteracted = false;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Reset Function
    function resetChecklist() {
        const card = document.querySelector('.card');
        card.style.opacity = '0.6';
        card.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            checkboxes.forEach(cb => cb.checked = false);
            hasInteracted = false; // Reset interaction flag
            calculateTotals(); // Will show "—" on true reset
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 150);
    }

    // Attach events
    resetBtn.addEventListener('click', resetChecklist);
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            hasInteracted = true;
            calculateTotals();
        });
    });

    // Initial state: blank grade
    const gradeEl = document.getElementById('grade-display');
    gradeEl.textContent = '—';
    gradeEl.className = 'grade-display';
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
    // Reset classes
    el.className = 'grade-display';
    
    // Check if user has interacted (any checkbox ever checked)
    const anyChecked = document.querySelectorAll('input[type="checkbox"]:checked').length > 0;
    const hasInteracted = anyChecked || score > 0;

    if (score >= 90) {
        el.textContent = 'Grade: A+';
        el.classList.add('grade-a');
    } else if (score >= 80) {
        el.textContent = 'Grade: B+';
        el.classList.add('grade-b');
    } else if (score >= 70) {
        el.textContent = 'Grade: C+';
        el.classList.add('grade-c');
    } else if (score >= 60) {
        el.textContent = 'Grade: D+';
        el.classList.add('grade-d');
    } else if (hasInteracted) {
        el.textContent = 'Grade: F';
        el.classList.add('grade-f');
    } else {
        // Fresh state — no interaction
        el.textContent = '—';
        el.style.color = ''; // Reset
        el.style.textShadow = '';
        el.style.fontWeight = '';
    }
}// ===== SCROLL-REACTIVE BUTTONS =====
document.addEventListener('DOMContentLoaded', () => {
    const fixedActions = document.querySelector('.fixed-actions');
    let lastScrollY = window.scrollY;
    let ticking = false;
    const scrollThreshold = 20; // Hide after scrolling 20px
    let hideTimeout = null;

    const updateButtonVisibility = () => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        const hasScrolledEnough = Math.abs(currentScrollY - lastScrollY) > 5;
        
        if (isScrollingDown && hasScrolledEnough && currentScrollY > scrollThreshold) {
            // Scrolling down - hide buttons
            fixedActions.classList.add('hidden');
            clearTimeout(hideTimeout);
        } else if (!isScrollingDown && hasScrolledEnough) {
            // Scrolling up - show buttons immediately
            fixedActions.classList.remove('hidden');
            clearTimeout(hideTimeout);
        } else if (!isScrollingDown && currentScrollY <= scrollThreshold) {
            // At top - show buttons
            fixedActions.classList.remove('hidden');
            clearTimeout(hideTimeout);
        }
        
        // Auto-show after 2 seconds of no scrolling
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (currentScrollY <= scrollThreshold || !isScrollingDown) {
                fixedActions.classList.remove('hidden');
            }
        }, 2000);
        
        lastScrollY = currentScrollY;
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateButtonVisibility);
            ticking = true;
        }
    };

    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Reset on resize
    window.addEventListener('resize', () => {
        lastScrollY = window.scrollY;
        fixedActions.classList.remove('hidden');
    });

    // Initial state
    if (window.scrollY > scrollThreshold) {
        fixedActions.classList.add('hidden');
    }
});