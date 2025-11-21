// NoCRM Configuration
const NOCRM_CONFIG = {
    API_KEY: 'bb49018483784d3e81ea8ef72622c6cf7ac6c0b8f835cda8',
    BASE_URL: 'https://mxfil.nocrm.io/api/v2'
};

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const formMessage = document.getElementById('formMessage');

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--primary)';
        header.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            if (entry.target.classList.contains('project-card')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on page load
    const animatedElements = document.querySelectorAll('.project-card, .about-content, .contact-content, .skill');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Skills animation
const skills = document.querySelectorAll('.skill');

skills.forEach(skill => {
    skill.addEventListener('mouseenter', () => {
        skill.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    skill.addEventListener('mouseleave', () => {
        skill.style.transform = 'translateY(0) scale(1)';
    });
});

// NoCRM Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
        formMessage.style.display = 'none';
        
        try {
            const formData = {
                firstname: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                company: document.getElementById('company').value.trim() || undefined,
                phone: document.getElementById('phone').value.trim() || undefined,
                description: document.getElementById('message').value.trim(),
                source: 'Mxfil-G Website'
            };

            // Validate required fields
            if (!formData.firstname || !formData.email || !formData.description) {
                throw new Error('Please fill in all required fields');
            }

            console.log('Submitting to NoCRM:', formData);
            
            // Submit to NoCRM API
            const response = await fetch(`${NOCRM_CONFIG.BASE_URL}/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': NOCRM_CONFIG.API_KEY
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();
            
            if (response.ok) {
                showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                console.error('NoCRM API Error:', responseData);
                throw new Error(responseData.message || 'Failed to submit form');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Fallback options
            if (error.message.includes('Failed to submit form') || error.message.includes('Network')) {
                showMessage('Sorry, there was an error with the form. Please email me directly at thatonebirdguy52@gmail.com', 'error');
            } else {
                showMessage(`Error: ${error.message}`, 'error');
            }
        } finally {
            // Reset button state
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Add input validation
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        if (this.checkValidity()) {
            this.style.borderColor = '#ddd';
        } else {
            this.style.borderColor = '#e74c3c';
        }
    });
    
    input.addEventListener('blur', function() {
        if (this.value && this.checkValidity()) {
            this.style.borderColor = '#2ecc71';
        }
    });
});

// Add click outside to close mobile menu
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.transform = 'scale(1)';
    });
    
    img.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
    img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        const header = document.querySelector('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--primary)';
            header.style.backdropFilter = 'none';
        }
    }, 10);
});

console.log('Mxfil-G Website loaded successfully! 🚀');
