// ============================================
// PORTFOLIO JAVASCRIPT - INTERACTIVE FEATURES
// ============================================

// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const THEME_KEY = 'portfolio-theme';

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// ============================================
// ANIMATED CANVAS BACKGROUND
// ============================================

const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse position for cursor tracking
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Scroll progress for star scaling
let starScaleMultiplier = 1;

// Enhanced Star system for realistic twinkling effect
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseRadius = Math.random() * 1.5 + 0.5;
        this.radius = this.baseRadius;
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
        this.glowIntensity = Math.random() * 0.5 + 0.5;
        this.vx = 0;
        this.vy = 0;
        
        // Color variations for stars
        const colorTypes = [
            { r: 255, g: 255, b: 255 },     // White
            { r: 200, g: 220, b: 255 },     // Blue-white
            { r: 255, g: 230, b: 200 },     // Yellow-white
            { r: 220, g: 200, b: 255 },     // Purple-white
        ];
        this.color = colorTypes[Math.floor(Math.random() * colorTypes.length)];
    }

    update() {
        // Move the star
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Twinkling effect
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        
        if (this.opacity >= 1) {
            this.opacity = 1;
            this.twinkleDirection = -1;
        } else if (this.opacity <= 0.2) {
            this.opacity = 0.2;
            this.twinkleDirection = 1;
        }
        
        // Occasionally change twinkle speed for variation
        if (Math.random() < 0.001) {
            this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        }
    }

    moveTowardsMouse(mouseX, mouseY, force = 0.015) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            this.vx += (dx / distance) * force;
            this.vy += (dy / distance) * force;
        }

        // Damping
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Max velocity
        const maxVelocity = 0.8;
        const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (velocity > maxVelocity) {
            this.vx = (this.vx / velocity) * maxVelocity;
            this.vy = (this.vy / velocity) * maxVelocity;
        }
    }

    draw() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            // Update radius based on scroll
            this.radius = this.baseRadius * starScaleMultiplier;
            
            // Draw glow effect
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
            gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * this.glowIntensity})`);
            gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw bright core
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add extra sparkle for some stars
            if (this.opacity > 0.8 && this.glowIntensity > 0.7) {
                ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.6})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x - this.radius * 3, this.y);
                ctx.lineTo(this.x + this.radius * 3, this.y);
                ctx.moveTo(this.x, this.y - this.radius * 3);
                ctx.lineTo(this.x, this.y + this.radius * 3);
                ctx.stroke();
            }
        }
    }
}

// Particle system for light mode
class Particle {
    constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.alpha = 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    moveTowardsMouse(mouseX, mouseY, force = 0.02) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            this.vx += (dx / distance) * force;
            this.vy += (dy / distance) * force;
        }

        // Damping
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Max velocity
        const maxVelocity = 2;
        const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (velocity > maxVelocity) {
            this.vx = (this.vx / velocity) * maxVelocity;
            this.vy = (this.vy / velocity) * maxVelocity;
        }
    }
}

// Create stars and particles
const stars = [];
const particles = [];
const starCount = 200;
const particleCount = 80;

// Connection cycle variables
let connectionPhase = 0; // 0 = connecting, 1 = connected, 2 = disconnecting
let connectionOpacity = 0;
let phaseTimer = 0;
const connectDuration = 2000; // 2 seconds to connect
const stayDuration = 3000;    // 3 seconds stay connected
const disconnectDuration = 2000; // 2 seconds to disconnect

function initBackground() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        // Create stars for dark mode
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
    } else {
        // Create particles for light mode
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            const colors = [
                'rgba(255, 200, 87, 0.4)',
                'rgba(255, 152, 0, 0.35)',
                'rgba(255, 87, 34, 0.3)',
                'rgba(255, 193, 7, 0.35)',
                'rgba(255, 235, 59, 0.25)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const radius = Math.random() * 2 + 1;
            const vx = (Math.random() - 0.5) * 1;
            const vy = (Math.random() - 0.5) * 1;
            
            particles.push(
                new Particle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    vx,
                    vy,
                    radius,
                    color
                )
            );
        }
    }
}

// Initial background creation
initBackground();

// Listen for theme change to update background
themeToggle.addEventListener('click', () => {
    setTimeout(initBackground, 100);
});

// Resize handler to reposition stars
window.addEventListener('resize', () => {
    resizeCanvas();
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        stars.forEach(star => {
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
        });
    }
});

// Draw background gradient
function drawBackground() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        // Dark mode: Night sky with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#050d27');       // Very dark at top
        gradient.addColorStop(0.3, '#0f1a3a');     // Dark blue
        gradient.addColorStop(0.6, '#1a2555');     // Medium blue
        gradient.addColorStop(1, '#2d3a5a');       // Lighter blue at bottom
        ctx.fillStyle = gradient;
        
        // Add radial glow effects for atmosphere
        const radialGradient = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, canvas.height, canvas.width);
        radialGradient.addColorStop(0, 'rgba(100, 150, 255, 0.05)');
        radialGradient.addColorStop(1, 'rgba(50, 100, 200, 0.1)');
        
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add atmospheric glow
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Light mode: Sunrise sky
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#fef3c7');      // Light yellow at top
        gradient.addColorStop(0.25, '#fed7aa');   // Peach
        gradient.addColorStop(0.45, '#fb923c');   // Orange
        gradient.addColorStop(0.65, '#f97316');   // Deep orange
        gradient.addColorStop(1, '#fbbf24');      // Golden at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Draw cursor effect
function drawCursorEffect() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
    
    if (isDark) {
        // Dark mode: Subtle blue glow
        gradient.addColorStop(0, 'rgba(100, 150, 255, 0.15)');
        gradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
    } else {
        // Light mode: Warm glow
        gradient.addColorStop(0, 'rgba(255, 200, 87, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 152, 0, 0)');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(mouseX - 150, mouseY - 150, 300, 300);
}

// Update connection cycle
function updateConnectionCycle(deltaTime) {
    phaseTimer += deltaTime;
    
    if (connectionPhase === 0) {
        // Connecting phase
        connectionOpacity += deltaTime / connectDuration;
        if (connectionOpacity >= 1) {
            connectionOpacity = 1;
            connectionPhase = 1;
            phaseTimer = 0;
        }
    } else if (connectionPhase === 1) {
        // Stay connected phase
        if (phaseTimer >= stayDuration) {
            connectionPhase = 2;
            phaseTimer = 0;
        }
    } else if (connectionPhase === 2) {
        // Disconnecting phase
        connectionOpacity -= deltaTime / disconnectDuration;
        if (connectionOpacity <= 0) {
            connectionOpacity = 0;
            connectionPhase = 0;
            phaseTimer = 0;
        }
    }
}

// Draw connecting lines between nearby particles
function drawConnections() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        // Draw connections between nearby stars in dark mode with cycle
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const distanceOpacity = 1 - (distance / 120);
                    const finalOpacity = distanceOpacity * 0.15 * connectionOpacity;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity})`;
                    ctx.lineWidth = 0.4;
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }
    } else {
        // Only draw connections in light mode
        const lineColor = 'rgba(255, 152, 0, 0.15)';
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
}

// Animation loop
let lastTime = Date.now();

function animate() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    drawBackground();
    drawCursorEffect();

    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        // Update connection cycle
        updateConnectionCycle(deltaTime);
        
        // Update and draw stars
        stars.forEach(star => {
            star.moveTowardsMouse(mouseX, mouseY, 0.012);
            star.update();
            star.draw();
        });
        drawConnections();
    } else {
        // Update and draw particles
        particles.forEach(particle => {
            particle.moveTowardsMouse(mouseX, mouseY, 0.015);
            particle.update();
            particle.draw();
        });
        drawConnections();
    }

    requestAnimationFrame(animate);
}

animate();

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// CERTIFICATE MODAL
// ============================================

const modal = document.getElementById('certificateModal');
const modalImage = document.getElementById('modalImage');
const caption = document.getElementById('caption');
const closeBtn = document.querySelector('.close');

const certificateItems = document.querySelectorAll('.certificate-item');

certificateItems.forEach(item => {
    item.addEventListener('click', function() {
        const certificateId = this.getAttribute('data-certificate');
        const label = this.querySelector('.certificate-label').textContent;
        
        // You can replace this with actual image URLs later
        const imageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%236366f1' width='800' height='600'/%3E%3Ctext x='400' y='300' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${label}%3C/text%3E%3C/svg%3E`;
        
        modal.style.display = 'block';
        modalImage.src = imageUrl;
        caption.textContent = label;
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards, project cards, and certificate items
document.querySelectorAll('.skill-card, .project-card, .certificate-item').forEach(el => {
    observer.observe(el);
});

// Observe programming summary for slide-in animation
const programmingSummary = document.querySelector('.programming-summary');
if (programmingSummary) {
    // Remove initial observer-based animation
    // We'll use scroll-based animation instead
}

// ============================================
// ACTIVE NAV LINK
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
            link.style.fontWeight = '700';
        } else {
            link.style.color = '';
            link.style.fontWeight = '500';
        }
    });
    
    // Smooth slide-in effect for programming summary
    const programmingSummary = document.querySelector('.programming-summary');
    if (programmingSummary) {
        const rect = programmingSummary.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const centerOfScreen = windowHeight / 2;
        
        // Calculate when element center approaches screen center
        const elementCenter = elementTop + (elementHeight / 2);
        const distanceFromCenter = centerOfScreen - elementCenter;
        
        // Start showing when element is within viewport range
        // Full opacity and position when centered
        if (elementTop < windowHeight && elementTop > -elementHeight) {
            // Calculate progress based on distance from center (within 150px range for faster animation)
            const maxDistance = 150;
            let progress = Math.min(Math.max((maxDistance + distanceFromCenter) / maxDistance, 0), 1);
            
            // Slide in from left (-100px to 0px)
            const translateX = -100 + (progress * 100);
            const opacity = progress;
            
            programmingSummary.style.transform = `translateX(${translateX}px)`;
            programmingSummary.style.opacity = opacity;
        }
    }
    
    // Smooth slide-in effect for stat boxes
    const statBoxes = document.querySelectorAll('.stat-box');
    const aboutSection = document.getElementById('about');
    
    if (statBoxes.length > 0 && aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const aboutSectionHeight = aboutSection.offsetHeight;
        const scrolledIntoAbout = windowHeight - aboutRect.top;
        const scrollProgress = scrolledIntoAbout / aboutSectionHeight;
        
        // Trigger when 80% of About Me section is scrolled
        if (scrollProgress >= 0.8) {
            const triggerProgress = Math.min((scrollProgress - 0.8) / 0.2, 1); // 0.8 to 1.0 maps to 0 to 1
            
            statBoxes.forEach((statBox, index) => {
                // Stagger each box - divide progress into thirds
                const boxStartProgress = index * 0.33; // 0, 0.33, 0.66
                const boxEndProgress = boxStartProgress + 0.33;
                
                let boxProgress = 0;
                if (triggerProgress >= boxStartProgress) {
                    boxProgress = Math.min((triggerProgress - boxStartProgress) / 0.33, 1);
                }
                
                const translateX = 100 - (boxProgress * 100);
                const opacity = boxProgress;
                
                statBox.style.transform = `translateX(${translateX}px)`;
                statBox.style.opacity = opacity;
                statBox.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
            });
        }
    }
});

// ============================================
// CTA BUTTON SCROLL
// ============================================

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
}

// ============================================
// FORM HANDLING
// ============================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation and feedback
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// ============================================
// PARALLAX EFFECT ON SCROLL
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Smooth scale and fade effect for hero title
    if (heroTitle) {
        const scrollProgress = Math.min(scrolled / 500, 1); // 500px scroll distance
        const scale = 1 - (scrollProgress * 0.3); // Scale down to 70%
        const opacity = 1 - (scrollProgress * 0.7); // Fade to 30%
        
        heroTitle.style.transform = `scale(${scale}) translateZ(0)`;
        heroTitle.style.opacity = opacity;
    }
    
    // Also apply to subtitle
    if (heroSubtitle) {
        const scrollProgress = Math.min(scrolled / 500, 1);
        const scale = 1 - (scrollProgress * 0.2); // Scale down to 80%
        const opacity = 1 - (scrollProgress * 0.8); // Fade faster
        
        heroSubtitle.style.transform = `scale(${scale}) translateZ(0)`;
        heroSubtitle.style.opacity = opacity;
    }
    
    // Increase star size based on scroll (dark mode)
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        const scrollProgress = Math.min(scrolled / 1000, 1); // Over 1000px scroll
        starScaleMultiplier = 1 + (scrollProgress * 1.5); // Increase up to 2.5x
    }
});

// ============================================
// INITIALIZE THEME ON PAGE LOAD
// ============================================

initTheme();

// ============================================
// CHAT BOX FUNCTIONALITY - DISABLED (Using inline script in HTML instead)
// ============================================

// Chat functionality is now handled by inline script in index.html
// to avoid conflicts and initialization issues

// ============================================
// CONSOLE LOG
// ============================================

console.log('%c🎨 Welcome to My Professional Portfolio', 'font-size: 24px; color: #6366f1; font-weight: bold;');
console.log('%cDesigned with ❤️ using HTML5, CSS3 & JavaScript', 'font-size: 14px; color: #ec4899; font-weight: bold;');

