import { companyData } from './data.js';

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

// Dynamic Rendering Logic
const renderServices = () => {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    grid.innerHTML = companyData.services.map((service, index) => `
        <div class="portfolio-card ${index % 3 === 0 ? 'col-4' : 'col-2'}" style="opacity: 0; transform: translateY(30px);">
            <div style="font-size: 2.5rem; margin-bottom: 16px;">${service.icon}</div>
            <span class="sector-tag">${service.category}</span>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
};

const renderProjects = () => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = companyData.projects.map(project => `
        <div class="portfolio-card col-3" style="opacity: 0; transform: translateY(30px);">
            <span class="sector-tag">${project.tag}</span>
            <h3>${project.client}</h3>
            <p><strong>${project.location}</strong>: ${project.description}</p>
        </div>
    `).join('');
};

const renderIndustries = () => {
    const grid = document.getElementById('industries-grid');
    if (!grid) return;
    grid.innerHTML = companyData.industries.map(industry => `
        <div class="industry-badge" style="opacity: 0; transform: translateY(20px);">
            <span>💠</span> ${industry}
        </div>
    `).join('');
};

const renderTeam = () => {
    const container = document.getElementById('team-grid');
    if (!container) return;

    // Organogram Structure Helper
    const getTier = (level) => companyData.team.filter(m => m.tier === level);

    const level1 = getTier(1);
    const level2 = getTier(2);
    const level3 = getTier(3);

    container.innerHTML = `
        <div class="organogram">
            <!-- Director Node -->
            <div class="organo-level level-1">
                ${level1.filter(m => m.role.includes('Director')).map(m => createNode(m)).join('')}
            </div>

            <div class="organo-branch">
                <!-- Partners/Advisors -->
                <div class="organo-level level-2">
                    ${level1.filter(m => !m.role.includes('Director')).map(m => createNode(m)).join('')}
                </div>
            </div>

            <div class="organo-connector"></div>

            <div class="organo-branch-main">
                <!-- Management -->
                <div class="organo-level level-3">
                    ${level2.map(m => createNode(m)).join('')}
                </div>
                
                <!-- Technical -->
                <div class="organo-level level-4">
                    ${level3.map(m => createNode(m)).join('')}
                </div>
            </div>
        </div>
    `;
};

const createNode = (member) => `
    <div class="organo-node" style="opacity: 0; transform: translateY(20px);">
        <div class="node-card">
            <div class="node-image">
                <img src="${member.image}" alt="${member.name}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random'">
            </div>
            <div class="node-content">
                <h4>${member.name}</h4>
                <p>${member.role}</p>
            </div>
        </div>
    </div>
`;

const renderPartners = () => {
    const grid = document.getElementById('partners-grid');
    if (!grid) return;
    grid.innerHTML = companyData.partners.map(partner => `
        <div class="partner-card" style="opacity: 0; transform: translateY(20px); filter: grayscale(1); transition: all 0.5s ease;">
            <strong style="font-size: 1.5rem;">${partner.name}</strong>
            <p style="font-size: 0.8rem; color: var(--primary);">${partner.role}</p>
        </div>
    `).join('');
};

// Initialize Dynamic Sections
renderServices();
renderProjects();
renderTeam();
renderIndustries();
renderPartners();

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
    const elements = document.querySelectorAll('.portfolio-card, .organo-node, .industry-badge, .partner-card, .hero-text, .hero-image-wrap');
    elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 50) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', reveal);
// Initial check after a short delay to ensure rendering is complete
setTimeout(reveal, 100);

// Parallax for Hero Image
const heroImg = document.querySelector('.hero-image-wrap img');
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 50;
    const y = (e.clientY - window.innerHeight / 2) / 50;
    if (heroImg) heroImg.style.transform = `translate(${x}px, ${y}px) rotateX(${y}deg) rotateY(${x}deg)`;
});
