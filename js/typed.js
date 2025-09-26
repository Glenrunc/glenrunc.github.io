// ==========================================================================
// Typed Text Animation
// ==========================================================================

class TypedText {
    constructor(element, options = {}) {
        this.element = element;
        this.strings = options.strings || ['Developer', 'Designer', 'Creator'];
        this.typeSpeed = options.typeSpeed || 100;
        this.backSpeed = options.backSpeed || 50;
        this.backDelay = options.backDelay || 2000;
        this.startDelay = options.startDelay || 1000;
        this.loop = options.loop !== false;
        this.showCursor = options.showCursor !== false;
        this.cursorChar = options.cursorChar || '|';
        
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (this.showCursor) {
            this.element.style.position = 'relative';
            this.element.insertAdjacentHTML('afterend', 
                `<span class="typed-cursor" style="animation: blink 1s infinite;">${this.cursorChar}</span>`
            );
        }
        
        // Add cursor blinking animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            .typed-cursor {
                color: var(--primary-color);
                font-weight: 300;
                margin-left: 2px;
                text-shadow: 0 0 5px var(--primary-color);
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            this.type();
        }, this.startDelay);
    }
    
    type() {
        const currentString = this.strings[this.currentStringIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.element.textContent = currentString.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentStringIndex++;
                
                if (this.currentStringIndex === this.strings.length) {
                    if (this.loop) {
                        this.currentStringIndex = 0;
                    } else {
                        return; // Stop animation
                    }
                }
                
                setTimeout(() => this.type(), this.typeSpeed);
                return;
            }
        } else {
            // Typing characters
            this.element.textContent = currentString.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentString.length) {
                this.isPaused = true;
                setTimeout(() => {
                    this.isPaused = false;
                    this.isDeleting = true;
                    this.type();
                }, this.backDelay);
                return;
            }
        }
        
        const speed = this.isDeleting ? this.backSpeed : this.typeSpeed;
        setTimeout(() => this.type(), speed);
    }
    
    destroy() {
        const cursor = document.querySelector('.typed-cursor');
        if (cursor) {
            cursor.remove();
        }
    }
}

// Initialize typed text animation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const typedElement = document.querySelector('.typed-text');
    
    if (typedElement) {
        new TypedText(typedElement, {
            strings: [
                'Full Stack Developer',
                'System Architect', 
                'Code Craftsman',
                'Digital Innovator',
                'Problem Solver'
            ],
            typeSpeed: 120,
            backSpeed: 60,
            backDelay: 2500,
            startDelay: 1500,
            loop: true
        });
    }
});

// ==========================================================================
// Advanced Text Animations
// ==========================================================================

class TextReveal {
    constructor(element, options = {}) {
        this.element = element;
        this.delay = options.delay || 0;
        this.duration = options.duration || 1000;
        this.easing = options.easing || 'ease-out';
        
        this.init();
    }
    
    init() {
        const text = this.element.textContent;
        this.element.innerHTML = '';
        
        // Split text into spans for each character
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all ${this.duration}ms ${this.easing}`;
            span.style.transitionDelay = `${this.delay + (index * 50)}ms`;
            
            this.element.appendChild(span);
        });
        
        // Trigger animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.element);
    }
    
    animate() {
        const spans = this.element.querySelectorAll('span');
        spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        });
    }
}

// Initialize text reveal animations
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal-text');
    
    revealElements.forEach((element, index) => {
        new TextReveal(element, {
            delay: index * 200
        });
    });
});

// ==========================================================================
// Counter Animation
// ==========================================================================

class CountUp {
    constructor(element, options = {}) {
        this.element = element;
        this.target = parseInt(element.getAttribute('data-target')) || 
                     parseInt(element.textContent.replace(/[^\d]/g, ''));
        this.duration = options.duration || 2000;
        this.easing = options.easing || 'easeOutQuart';
        this.prefix = options.prefix || '';
        this.suffix = options.suffix || '';
        this.separator = options.separator || '';
        
        this.startValue = 0;
        this.startTime = null;
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.start();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.element);
    }
    
    start() {
        this.startTime = performance.now();
        this.animate();
    }
    
    animate() {
        const now = performance.now();
        const elapsed = now - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        const easedProgress = this.applyEasing(progress);
        const currentValue = Math.floor(this.startValue + (this.target - this.startValue) * easedProgress);
        
        this.element.textContent = this.formatNumber(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(() => this.animate());
        }
    }
    
    applyEasing(t) {
        switch (this.easing) {
            case 'easeOutQuart':
                return 1 - Math.pow(1 - t, 4);
            case 'easeOutCubic':
                return 1 - Math.pow(1 - t, 3);
            case 'easeOutQuad':
                return 1 - (1 - t) * (1 - t);
            default:
                return t; // linear
        }
    }
    
    formatNumber(num) {
        let formatted = num.toString();
        
        if (this.separator === ',') {
            formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        return this.prefix + formatted + this.suffix;
    }
}

// Initialize counter animations
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat h4');
    
    counters.forEach(counter => {
        // Extract number and suffix from text content
        const text = counter.textContent;
        const match = text.match(/(\d+)(\+?)/);
        
        if (match) {
            const number = parseInt(match[1]);
            const suffix = match[2] || '';
            
            counter.setAttribute('data-target', number);
            counter.textContent = '0' + suffix;
            
            new CountUp(counter, {
                duration: 2000,
                suffix: suffix,
                easing: 'easeOutQuart'
            });
        }
    });
});

// ==========================================================================
// Particle Animation Background
// ==========================================================================

class ParticleBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.particleCount = options.particleCount || 50;
        this.particleColor = options.particleColor || 'rgba(102, 126, 234, 0.3)';
        this.particleSize = options.particleSize || 2;
        this.connectionDistance = options.connectionDistance || 150;
        this.animationSpeed = options.animationSpeed || 0.5;
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.animationSpeed,
                vy: (Math.random() - 0.5) * this.animationSpeed,
                size: Math.random() * this.particleSize + 1
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        this.container.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX - this.container.offsetLeft;
            this.mouse.y = e.clientY - this.container.offsetTop;
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update particles
        this.particles.forEach(particle => {
            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx = -particle.vx;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy = -particle.vy;
            }
            
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x += dx * force * 0.01;
                    particle.y += dy * force * 0.01;
                }
            }
        });
        
        // Draw particles and connections
        this.drawParticles();
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.particleColor;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 255, 65, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                    this.ctx.shadowColor = 'rgba(0, 255, 65, 0.5)';
                    this.ctx.shadowBlur = 2;
                }
            }
        }
    }
}

// Initialize particle background for hero section
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && window.innerWidth > 768) {
        new ParticleBackground(heroSection, {
            particleCount: 40,
            particleColor: 'rgba(0, 255, 65, 0.6)',
            connectionDistance: 100,
            animationSpeed: 0.2
        });
        
        // Add matrix scanline effect
        const scanline = document.createElement('div');
        scanline.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            box-shadow: 0 0 10px var(--primary-color);
            animation: scanline 3s linear infinite;
            z-index: 2;
            opacity: 0.7;
        `;
        
        heroSection.appendChild(scanline);
        
        // Add scanline animation
        const scanlineStyle = document.createElement('style');
        scanlineStyle.textContent = `
            @keyframes scanline {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
        `;
        document.head.appendChild(scanlineStyle);
    }
});

// Export classes for potential external use
if (typeof window !== 'undefined') {
    window.TypedText = TypedText;
    window.TextReveal = TextReveal;
    window.CountUp = CountUp;
    window.ParticleBackground = ParticleBackground;
}