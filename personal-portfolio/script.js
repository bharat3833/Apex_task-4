// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.level-bar');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'var(--glass-bg)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Contact Form Handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Skill Bars Animation
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
    });
};

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when in view
            if (entry.target.classList.contains('skills-grid')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .stat-item, .contact-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Observe skills section for skill bar animation
    const skillsSection = document.querySelector('.skills-grid');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});

// Typing Effect for Hero Title
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Project Cards Hover Effect Enhancement
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add floating animation to social links
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach((link, index) => {
    link.style.animation = `float ${3 + index * 0.5}s infinite ease-in-out`;
    link.style.animationDelay = `${index * 0.2}s`;
});

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.textContent = footerText.textContent.replace('2024', year);
    }
});

// Add particle effect to background
const createParticles = () => {
    const particlesContainer = document.querySelector('.floating-shapes');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${10 + Math.random() * 20}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
};

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Form input focus effects
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Add CSS for focused state
const focusCSS = `
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = focusCSS;
document.head.appendChild(styleSheet);

// Smooth reveal animation for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealSections);
document.addEventListener('DOMContentLoaded', revealSections);

// Add CSS for reveal animation
const revealCSS = `
    section {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;

const revealStyleSheet = document.createElement('style');
revealStyleSheet.textContent = revealCSS;
document.head.appendChild(revealStyleSheet);

// Initialize reveal on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('revealed');
        });
    }, 100);
});

// Cursor glow effect (optional enhancement)
const createCursorGlow = () => {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.5), transparent)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'transform 0.1s ease';
    cursor.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
};

// Initialize cursor glow (commented out by default, uncomment if desired)
// document.addEventListener('DOMContentLoaded', createCursorGlow);

console.log('Portfolio website loaded successfully! 🚀');
