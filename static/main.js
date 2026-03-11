// Initialize everything after DOM is ready
document.addEventListener('DOMContentLoaded', function() {

    // ===== Particle System =====
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.max(1, Math.random() * 3);
            this.speedY = -(Math.random() * 0.5 + 0.2);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.5 ? '#C46A2D' : '#B87333';
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity -= 0.001;
            if (this.y < -10 || this.opacity <= 0) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Initialize particles
    const particleCount = prefersReducedMotion ? 0 : 50;
    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animateParticles);
    }

    if (!prefersReducedMotion) {
        animateParticles();
    }

    // ===== Scroll Reveal =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== Navbar Background =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(17, 17, 17, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(196, 106, 45, 0.1)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.borderBottom = 'none';
        }
        lastScroll = currentScroll;
    });

    // ===== Mobile Menu =====
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== Testimonial Slider =====
    const slider = document.getElementById('testimonial-slider');
    const slideButtons = document.querySelectorAll('[data-slide]');
    let currentSlide = 0;
    const totalSlides = 3;

    function goToSlide(index) {
        currentSlide = index;
        const slideWidth = window.innerWidth < 768 ? 100 : (window.innerWidth < 1024 ? 50 : 33.333);
        if (slider) {
            slider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        }
        slideButtons.forEach((btn, i) => {
            btn.classList.toggle('bg-[var(--accent)]', i === currentSlide);
            btn.classList.toggle('bg-[var(--border)]', i !== currentSlide);
        });
    }

    slideButtons.forEach((btn, i) => {
        btn.addEventListener('click', () => goToSlide(i));
    });

    // Auto-slide
    if (!prefersReducedMotion) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);
    }

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const start = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(target * easeOut);
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }

                if (!prefersReducedMotion) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ===== Form Submission =====
    const form = document.getElementById('reservation-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Reservation Confirmed!';
                btn.style.background = 'linear-gradient(135deg, #2D7D46 0%, #1D5D32 100%)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }

    // ===== Set min date for reservation =====
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
