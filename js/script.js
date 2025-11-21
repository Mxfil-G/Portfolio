// NoCRM Email Configuration
const NOCRM_CONFIG = {
    EMAIL: 'mxfil@add.nocrm.io',
    SUBJECT: 'New Lead from Mxfil-G Website'
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

// NoCRM Form Handler - Using FormSubmit service
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
        formMessage.style.display = 'none';
        
        try {
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                company: document.getElementById('company').value.trim() || 'Not provided',
                phone: document.getElementById('phone').value.trim() || 'Not provided',
                message: document.getElementById('message').value.trim()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.message) {
                throw new Error('Please fill in all required fields');
            }

            // Create hidden form for FormSubmit
            const hiddenForm = document.createElement('form');
            hiddenForm.method = 'POST';
            hiddenForm.action = 'https://formsubmit.co/mxfil@add.nocrm.io';
            hiddenForm.style.display = 'none';
            
            // Add hidden fields
            const addHiddenField = (name, value) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                hiddenForm.appendChild(input);
            };
            
            addHiddenField('_subject', 'New Lead from Mxfil-G Website');
            addHiddenField('_template', 'table');
            addHiddenField('_captcha', 'false');
            addHiddenField('_next', window.location.href + '?success=true');
            addHiddenField('name', formData.name);
            addHiddenField('email', formData.email);
            addHiddenField('company', formData.company);
            addHiddenField('phone', formData.phone);
            addHiddenField('message', formData.message);
            addHiddenField('source', 'Mxfil-G Website');
            
            document.body.appendChild(hiddenForm);
            hiddenForm.submit();
            
            // Show immediate success message
            showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Remove the hidden form after submission
            setTimeout(() => {
                document.body.removeChild(hiddenForm);
            }, 1000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage(`Error: ${error.message}`, 'error');
        } finally {
            // Reset button state after a delay
            setTimeout(() => {
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

// Check for success parameter in URL
function checkForSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Clean URL
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Show message function
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

// Check for success message on page load
document.addEventListener('DOMContentLoaded', checkForSuccessMessage);

// Add console greeting
console.log(`
🌟 Mxfil-G Website Loaded Successfully! 🌟

Hey there! Welcome to the console. 
This website was built with love and attention to detail.

Features:
✅ Responsive Design
✅ NoCRM Integration (mxfil@add.nocrm.io)
✅ Smooth Animations
✅ Contact Form
✅ Mobile-Friendly

Feel free to explore the code! 🚀
`);

// Add error tracking
window.addEventListener('error', function(e) {
    console.error('Website Error:', e.error);
});

// Add page visibility tracking
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Add beforeunload event for form data preservation
window.addEventListener('beforeunload', function(e) {
    const form = document.getElementById('contactForm');
    if (form) {
        const formData = new FormData(form);
        let hasData = false;
        
        for (let value of formData.values()) {
            if (value.trim() !== '') {
                hasData = true;
                break;
            }
        }
        
        if (hasData) {
            // Optional: Save form data to localStorage
            const formState = {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                company: document.getElementById('company')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                message: document.getElementById('message')?.value || ''
            };
            
            localStorage.setItem('contactFormState', JSON.stringify(formState));
        }
    }
});

// Restore form data on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedForm = localStorage.getItem('contactFormState');
    if (savedForm) {
        const formState = JSON.parse(savedForm);
        
        if (document.getElementById('name')) document.getElementById('name').value = formState.name;
        if (document.getElementById('email')) document.getElementById('email').value = formState.email;
        if (document.getElementById('company')) document.getElementById('company').value = formState.company;
        if (document.getElementById('phone')) document.getElementById('phone').value = formState.phone;
        if (document.getElementById('message')) document.getElementById('message').value = formState.message;
        
        // Clear saved form data
        localStorage.removeItem('contactFormState');
    }
});
