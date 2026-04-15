/* =====================
   Leve Ninar — script.js
   ===================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Cursor personalizado ──────────────────────────────────
    const cursor      = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');
    let mouseX = 0, mouseY = 0;
    let trailX  = 0, trailY  = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    // Trail com lag
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.12;
        trailY += (mouseY - trailY) * 0.12;
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top  = trailY + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Cursor cresce em links/buttons
    document.querySelectorAll('a, button, .pillar-card, .ods-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width  = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'var(--lavender-deep)';
            cursorTrail.style.width  = '56px';
            cursorTrail.style.height = '56px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width  = '10px';
            cursor.style.height = '10px';
            cursor.style.background = 'var(--rose-deep)';
            cursorTrail.style.width  = '36px';
            cursorTrail.style.height = '36px';
        });
    });

    // ── 2. Partículas flutuantes ─────────────────────────────────
    const particlesContainer = document.getElementById('particles');
    const PARTICLE_COLORS = [
        'rgba(199,194,232,0.6)',
        'rgba(212,168,176,0.5)',
        'rgba(212,191,138,0.4)',
        'rgba(143,173,160,0.5)',
        'rgba(155,148,209,0.4)',
    ];

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size   = Math.random() * 8 + 3;
        const left   = Math.random() * 100;
        const dur    = Math.random() * 18 + 10;
        const delay  = Math.random() * 8;
        const color  = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}vw;
            bottom: -${size}px;
            background: ${color};
            animation-duration: ${dur}s;
            animation-delay: ${delay}s;
        `;
        particlesContainer.appendChild(p);

        // Remove ao terminar
        setTimeout(() => p.remove(), (dur + delay) * 1000);
    }

    // Cria partículas continuamente
    setInterval(createParticle, 600);
    for (let i = 0; i < 10; i++) createParticle(); // spawn inicial

    // ── 3. Header scroll ────────────────────────────────────────
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ── 4. Reveal ao rolar (IntersectionObserver) ────────────────
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Stagger por grupo
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
                const delay = siblings.indexOf(entry.target) * 80;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // ── 5. Contador animado nos stats do Hero ────────────────────
    function animateCounter(el) {
        const target  = parseInt(el.dataset.target, 10);
        const dur     = 1800;
        const step    = 16;
        const steps   = dur / step;
        const inc     = target / steps;
        let current   = 0;

        const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-num').forEach(animateCounter);
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) statsObserver.observe(statsEl);

    // ── 6. Menu mobile ──────────────────────────────────────────
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav  = document.getElementById('mobileNav');

    menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ── 7. Smooth scroll para âncoras ───────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── 8. Toast de boas-vindas ──────────────────────────────────
    const toast = document.getElementById('welcomeToast');
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }, 1200);

    // ── 9. Parallax suave nas shapes do Hero ────────────────────
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const shapes = document.querySelectorAll('.hero-bg-shape');
        shapes.forEach((s, i) => {
            const speed = 0.04 + i * 0.02;
            s.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ── 10. Partícula ao clicar ──────────────────────────────────
    document.addEventListener('click', e => {
        for (let i = 0; i < 6; i++) {
            const spark = document.createElement('div');
            spark.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--lavender-deep);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                animation: spark 0.6s ease forwards;
            `;
            const angle  = (i / 6) * Math.PI * 2;
            const dist   = 30 + Math.random() * 20;
            const tx     = Math.cos(angle) * dist;
            const ty     = Math.sin(angle) * dist;
            spark.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], { duration: 500, easing: 'ease-out', fill: 'forwards' });
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 550);
        }
    });

    // ── 11. Hover magnético nos botões ───────────────────────────
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translateY(-2px) translate(${x * 0.08}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ── 12. Tilt nos cards ODS ───────────────────────────────────
    document.querySelectorAll('.ods-card, .pillar-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── 13. Active nav link ao scroll ───────────────────────────
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks  = document.querySelectorAll('nav ul li a');

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => activeObserver.observe(s));

    // Estilo de link ativo
    const style = document.createElement('style');
    style.textContent = `
        nav ul li a.active { color: var(--rose-deep); }
        nav ul li a.active::after { transform: scaleX(1); }
    `;
    document.head.appendChild(style);

});