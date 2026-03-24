// Theme Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const updateTheme = (theme) => {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerText = theme === 'light' ? '🌙' : '☀️';
};

themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    updateTheme(current === 'light' ? 'dark' : 'light');
});

const saved = localStorage.getItem('theme') || 'light';
updateTheme(saved);

// Multi-Step Form Logic
const form = document.getElementById('ultimate-form');
const steps = document.querySelectorAll('.form-step');
const nextBtns = document.querySelectorAll('.next-step');
const prevBtns = document.querySelectorAll('.prev-step');
const progressBar = document.getElementById('form-progress-bar');
const choices = document.querySelectorAll('.choice-box');

let currentStep = 1;

const updateForm = () => {
    steps.forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    progressBar.style.width = `${(currentStep / steps.length) * 100}%`;
};

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep < steps.length) {
            currentStep++;
            updateForm();
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateForm();
        }
    });
});

choices.forEach(choice => {
    choice.addEventListener('click', () => {
        choices.forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    
    submitBtn.innerText = 'Analyzing Infrastructure... ⚙️';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerText = 'Proposal Generated! Sent to Email ✅';
        submitBtn.style.background = '#10B981';
        
        setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.style.background = 'var(--primary)';
            submitBtn.disabled = false;
            currentStep = 1;
            updateForm();
            form.reset();
        }, 3000);
    }, 2000);
});

// Reveal Logic
const reveal = () => {
    const reveals = document.querySelectorAll('.portfolio-card, .hero-text, .hero-image-wrap');
    reveals.forEach(el => {
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < window.innerHeight - 100) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Initial hidden states for reveals
document.querySelectorAll('.portfolio-card, .hero-text, .hero-image-wrap').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
});

window.addEventListener('scroll', reveal);
reveal();

// Parallax for Hero Image
const heroImg = document.querySelector('.hero-image-wrap img');
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 50;
    const y = (e.clientY - window.innerHeight / 2) / 50;
    if (heroImg) heroImg.style.transform = `translate(${x}px, ${y}px) rotateX(${y}deg) rotateY(${x}deg)`;
});
