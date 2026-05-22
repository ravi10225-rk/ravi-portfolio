document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State and Elements
    const body = document.body;
    const mainHeader = document.getElementById('mainHeader');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const cursorGlow = document.getElementById('cursorGlow');
    
    // 2. Typing Animation in Hero
    const words = ["Frontend Developer", "Web Designer", "UI Slicing Expert"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.getElementById('typingText');
    
    function typeEffect() {
        if (!typingSpan) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
            typingSpan.textContent = currentWord.substring(0, charIndex);
        } else {
            charIndex++;
            typingSpan.textContent = currentWord.substring(0, charIndex);
        }
        
        let typeSpeed = isDeleting ? 40 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1800; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    typeEffect();

    // 3. Theme Toggle Setup (Persisted in localStorage)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    } else {
        body.classList.add('light-theme');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // 4. Custom Cursor Glow Track
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        }
    });

    // 5. Card Hover Glow Track Effect (Bento & Glass Cards)
    const glowCards = document.querySelectorAll('.card-glass');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 6. Header Scrolled State
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
        
        // Scroll To Top Button Visibility
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll To Top Event
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 7. Mobile Menu Logic
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // 8. Active Nav Links On Scroll (Intersection Observer)
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => activeObserver.observe(section));

    // 9. Skills Progress Bar Fill Animation (Intersection Observer)
    const skillsSection = document.getElementById('skills');
    const progressFills = document.querySelectorAll('.progress-bar-fill');
    
    // Cache original width from style tag, reset width to 0 first
    progressFills.forEach(fill => {
        const targetWidth = fill.style.width;
        fill.dataset.width = targetWidth;
        fill.style.width = '0%';
    });
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressFills.forEach(fill => {
                    fill.style.width = fill.dataset.width;
                });
                skillsObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, { threshold: 0.15 });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 10. Scroll Reveal Animation for general elements
    const revealElements = document.querySelectorAll('.animate-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing if we only want animate once
                // revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => revealObserver.observe(el));


    // 12. Modal Operations
    const modalTriggers = document.querySelectorAll('.project-details-trigger');
    const modals = document.querySelectorAll('.project-modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    // Open Modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering card click
            const modalId = trigger.dataset.modal;
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                body.style.overflow = 'hidden'; // Stop page scrolling
            }
        });
    });
    
    // Close Modal helper
    const closeModal = (modal) => {
        modal.classList.remove('active');
        body.style.overflow = ''; // Restore page scrolling
    };
    
    // Close button click
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.project-modal');
            closeModal(modal);
        });
    });
    
    // Overlay click
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.project-modal');
            closeModal(modal);
        });
    });
    
    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
});
