// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
const scrollContainer = document.querySelector('.scroll-container');

scrollContainer.addEventListener('scroll', () => {
    if (scrollContainer.scrollTop > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll animations using IntersectionObserver
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-up elements
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-heading, .section-text, .hero-title, .hero-subtitle, ' +
        '.stat-block, .service-icon-large, .portfolio-item, ' +
        '.contact-form, .contact-links, .split-left, .split-right'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-up');
        const delayClass = `fade-up-delay-${(index % 3) + 1}`;
        el.classList.add(delayClass);
        observer.observe(el);
    });
}

initAnimations();

// Smooth scroll for anchor links (inside scroll container)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;

    btn.textContent = 'ENVOYE !';
    btn.style.background = 'var(--white)';
    btn.style.color = 'var(--black)';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
    }, 2500);
}

// Parallax-like effect on hero
const heroSection = document.querySelector('.hero');
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');

scrollContainer.addEventListener('scroll', () => {
    const scrolled = scrollContainer.scrollTop;
    const heroHeight = heroSection.offsetHeight;

    if (scrolled < heroHeight) {
        const progress = scrolled / heroHeight;
        const opacity = 1 - progress * 1.5;
        const translateY = scrolled * 0.3;

        if (heroTitle) {
            heroTitle.style.transform = `translateY(${translateY}px)`;
            heroTitle.style.opacity = Math.max(0, opacity);
        }
        if (heroSubtitle) {
            heroSubtitle.style.transform = `translateY(${translateY * 0.6}px)`;
            heroSubtitle.style.opacity = Math.max(0, opacity);
        }
    }
});
