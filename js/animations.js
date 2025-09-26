// ==========================================================================
// Advanced Animations and Interactions
// ==========================================================================

class ScrollAnimations {
    constructor() {
        this.animationElements = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.registerElements();
        this.addCustomAnimations();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: [0, 0.1, 0.5, 1]
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);
    }
    
    registerElements() {
        // Register different types of animated elements
        const fadeElements = document.querySelectorAll('.fade-in, .section-title, .section-subtitle');
        const slideElements = document.querySelectorAll('.slide-up, .project-item, .skill-item');
        const scaleElements = document.querySelectorAll('.scale-in, .about-stats .stat');
        const rotateElements = document.querySelectorAll('.rotate-in');
        
        fadeElements.forEach(el => this.registerElement(el, 'fade'));
        slideElements.forEach(el => this.registerElement(el, 'slide'));
        scaleElements.forEach(el => this.registerElement(el, 'scale'));
        rotateElements.forEach(el => this.registerElement(el, 'rotate'));
    }
    
    registerElement(element, animationType) {
        this.animationElements.push({ element, animationType });
        this.observer.observe(element);
        
        // Set initial state
        element.style.opacity = '0';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        switch (animationType) {
            case 'slide':
                element.style.transform = 'translateY(50px)';
                break;
            case 'scale':
                element.style.transform = 'scale(0.8)';
                break;
            case 'rotate':
                element.style.transform = 'rotate(10deg) scale(0.8)';
                break;
        }
    }
    
    triggerAnimation(element) {
        const animationItem = this.animationElements.find(item => item.element === element);
        if (!animationItem) return;
        
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        
        // Add completion class
        setTimeout(() => {
            element.classList.add('animation-complete');
        }, 600);
    }
    
    addCustomAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes shimmer {
                0% { background-position: -200px 0; }
                100% { background-position: calc(200px + 100%) 0; }
            }
            
            .float-animation {
                animation: float 3s ease-in-out infinite;
            }
            
            .pulse-animation {
                animation: pulse 2s ease-in-out infinite;
            }
            
            .shimmer-effect {
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                background-size: 200px 100%;
                animation: shimmer 2s infinite;
            }
            
            .glow-effect {
                box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
                transition: box-shadow 0.3s ease;
            }
            
            .glow-effect:hover {
                box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================================================
// Parallax Scrolling Effects
// ==========================================================================

class ParallaxController {
    constructor() {
        this.parallaxElements = [];
        this.isScrolling = false;
        this.init();
    }
    
    init() {
        this.findParallaxElements();
        this.bindScrollEvent();
    }
    
    findParallaxElements() {
        const elements = document.querySelectorAll('[data-parallax]');
        
        elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const direction = element.dataset.parallaxDirection || 'vertical';
            
            this.parallaxElements.push({
                element,
                speed,
                direction,
                offset: element.getBoundingClientRect().top + window.pageYOffset
            });
        });
    }
    
    bindScrollEvent() {
        window.addEventListener('scroll', this.throttle(() => {
            this.updateParallax();
        }, 16));
    }
    
    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(item => {
            const { element, speed, direction, offset } = item;
            const yPos = -(scrollTop - offset) * speed;
            
            if (direction === 'horizontal') {
                element.style.transform = `translateX(${yPos}px)`;
            } else {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// ==========================================================================
// Interactive Project Cards
// ==========================================================================

class InteractiveCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-item');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            this.addHoverEffect(card);
            this.addClickEffect(card);
        });
    }
    
    addHoverEffect(card) {
        card.addEventListener('mouseenter', (e) => {
            this.animateCard(card, 'enter');
        });
        
        card.addEventListener('mouseleave', (e) => {
            this.animateCard(card, 'leave');
        });
        
        card.addEventListener('mousemove', (e) => {
            this.tiltCard(card, e);
        });
    }
    
    addClickEffect(card) {
        card.addEventListener('click', (e) => {
            this.createRippleEffect(card, e);
        });
    }
    
    animateCard(card, state) {
        const overlay = card.querySelector('.project-overlay');
        const image = card.querySelector('.project-image img');
        
        if (state === 'enter') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            if (image) image.style.transform = 'scale(1.1)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            if (image) image.style.transform = 'scale(1)';
        }
    }
    
    tiltCard(card, event) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateX = (event.clientY - centerY) / 20;
        const rotateY = (centerX - event.clientX) / 20;
        
        card.style.transform = `
            translateY(-10px) 
            scale(1.02) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    }
    
    createRippleEffect(card, event) {
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ==========================================================================
// Skills Progress Animation
// ==========================================================================

class SkillsProgress {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.init();
    }
    
    init() {
        this.addProgressBars();
        this.observeSkillsSection();
    }
    
    addProgressBars() {
        this.skillItems.forEach(item => {
            const progress = item.dataset.progress || Math.floor(Math.random() * 30) + 70;
            
            const progressBar = document.createElement('div');
            progressBar.className = 'skill-progress';
            progressBar.innerHTML = `
                <div class="skill-progress-bar">
                    <div class="skill-progress-fill" data-progress="${progress}"></div>
                </div>
                <span class="skill-progress-text">${progress}%</span>
            `;
            
            item.appendChild(progressBar);
        });
        
        // Add CSS for progress bars
        this.addProgressStyles();
    }
    
    addProgressStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .skill-progress {
                margin-top: 10px;
                width: 100%;
            }
            
            .skill-progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(102, 126, 234, 0.2);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .skill-progress-fill {
                height: 100%;
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                border-radius: 3px;
                width: 0;
                transition: width 1.5s cubic-bezier(0.4, 0.0, 0.2, 1);
            }
            
            .skill-progress-text {
                font-size: 12px;
                color: var(--text-light);
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
    
    observeSkillsSection() {
        const skillsSection = document.getElementById('skills');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgress();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }
    
    animateProgress() {
        const progressFills = document.querySelectorAll('.skill-progress-fill');
        
        progressFills.forEach((fill, index) => {
            setTimeout(() => {
                const progress = fill.dataset.progress;
                fill.style.width = `${progress}%`;
            }, index * 100);
        });
    }
}

// ==========================================================================
// Smooth Page Transitions
// ==========================================================================

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.createTransitionOverlay();
        this.bindNavigationClicks();
    }
    
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(overlay);
    }
    
    bindNavigationClicks() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isTransitioning) return;
                
                e.preventDefault();
                const target = link.getAttribute('href');
                this.transition(target);
            });
        });
    }
    
    transition(target) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const overlay = document.getElementById('page-transition');
        
        // Fade in overlay
        overlay.style.pointerEvents = 'all';
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            // Scroll to target
            const targetElement = document.querySelector(target);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'instant'
                });
            }
            
            // Fade out overlay
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                overlay.style.pointerEvents = 'none';
                this.isTransitioning = false;
            }, 500);
        }, 250);
    }
}

// ==========================================================================
// Initialize All Animations
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation systems
    new ScrollAnimations();
    new ParallaxController();
    new InteractiveCards();
    new SkillsProgress();
    new PageTransitions();
    
    // Add floating animation to specific elements
    const floatingElements = document.querySelectorAll('.profile-photo, .hero-image');
    floatingElements.forEach(element => {
        element.classList.add('float-animation');
    });
    
    // Add pulse animation to buttons
    const pulseElements = document.querySelectorAll('.btn-primary');
    pulseElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('pulse-animation');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('pulse-animation');
        });
    });
    
    // Add glow effect to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.classList.add('glow-effect');
    });
    
    console.log('Advanced animations initialized successfully!');
});

// Add ripple animation styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Export classes for external use
if (typeof window !== 'undefined') {
    window.ScrollAnimations = ScrollAnimations;
    window.ParallaxController = ParallaxController;
    window.InteractiveCards = InteractiveCards;
    window.SkillsProgress = SkillsProgress;
    window.PageTransitions = PageTransitions;
}