// ===== Acessibilidade básica de navegação via teclado =====
const sections = ["#inicio", "#galeria", "#timeline", "#carta"].map(s => document.querySelector(s));
let currentIndex = 0;
function goTo(i) {
    currentIndex = Math.max(0, Math.min(sections.length - 1, i));
    sections[currentIndex].scrollIntoView({ behavior: 'smooth' });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(currentIndex + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(currentIndex - 1);
    if (e.key === 'ArrowUp') goTo(currentIndex - 1);
    if (e.key === 'ArrowDown') goTo(currentIndex + 1);
});

// ===== Botões principais =====
document.getElementById('btnContinuar')?.addEventListener('click', () => {
    goTo(1);
    confettiBurst();
});

const player = document.getElementById('player');
const btnMusica = document.getElementById('btnMusica');
btnMusica?.addEventListener('click', () => {
    if (player.paused) { player.play().catch(() => { }); btnMusica.setAttribute('aria-pressed', 'true'); btnMusica.textContent = 'Pausar música'; }
    else { player.pause(); btnMusica.setAttribute('aria-pressed', 'false'); btnMusica.textContent = 'Tocar música'; }
});

// ===== Efeito de digitação no "Eu te amo" =====
const typeEl = document.getElementById('type');
const msg = 'Eu te amo';
let di = 0;

function type() {
    typeEl.textContent = msg.slice(0, di);
    di++;
    if (di <= msg.length) {
        setTimeout(type, 120);
    } else {
        pulseLove();
        setTimeout(() => { di = 0; typeEl.textContent = ""; type(); }, 3000);
    }
}
setTimeout(type, 500);

// ===== Pulso suave na palavra "amo" =====
function pulseLove() {
    typeEl.style.filter = 'drop-shadow(0 0 18px rgba(255,77,126,.6))';
}

// ===== Corações flutuando =====
const hearts = document.getElementById('hearts');
function spawnHearts() {
    for (let i = 0; i < 12; i++) {
        const s = document.createElement('span');
        s.textContent = '❤';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.animationDuration = (7 + Math.random() * 6) + 's';
        s.style.setProperty('--tx', (Math.random() * 80 - 40) + 'px');
        hearts.appendChild(s);
        setTimeout(() => s.remove(), 13000);
    }
}
spawnHearts();
setInterval(spawnHearts, 4000);

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
    });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== CARROSSEL =====
(function initCarousel() {
    const root = document.getElementById('carousel');
    if (!root) return; // evita erro se a seção não existir

    const track = root.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = root.querySelector('.prev');
    const nextBtn = root.querySelector('.next');

    if (!track || !slides.length || !prevBtn || !nextBtn) {
        console.warn('[carousel] Elementos não encontrados:', { track: !!track, slides: slides.length, prevBtn: !!prevBtn, nextBtn: !!nextBtn });
        return;
    }

    const visible = 3;
    let index = 0;
    let maxIndex = Math.max(0, slides.length - visible);
    let timer = null;

    function updateCarousel() {
        // Usa largura real do slide (percentual já resolvido pelo layout)
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    function next() {
        index = (index < maxIndex) ? index + 1 : 0;
        updateCarousel();
    }

    function prev() {
        index = (index > 0) ? index - 1 : maxIndex;
        updateCarousel();
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    function startAuto() { stopAuto(); timer = setInterval(next, 1700); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

    // pausa autoplay ao passar o mouse
    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);

    // atualiza limites ao redimensionar
    window.addEventListener('resize', () => {
        maxIndex = Math.max(0, slides.length - visible);
        updateCarousel();
    });

    updateCarousel();
    startAuto();
})();

// ===== Lightbox simples =====
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

const figs = Array.from(document.querySelectorAll('#carousel .card'));
let idx = 0;

function openLb(i) {
    if (!lb || !lbImg) return;
    idx = i;
    const img = figs[idx].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.classList.add('open');
}

if (lb && lbImg) {
    figs.forEach((f, i) => f.addEventListener('click', () => openLb(i)));
    lbClose?.addEventListener('click', () => lb.classList.remove('open'));
    lb?.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('open'); });
    function step(d) { idx = (idx + d + figs.length) % figs.length; openLb(idx); }
    lbPrev?.addEventListener('click', () => step(-1));
    lbNext?.addEventListener('click', () => step(+1));
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') lb.classList.remove('open');
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
    });
}

// ===== Mini confete =====
function confettiBurst() {
    const N = 26; const frag = document.createDocumentFragment();
    for (let i = 0; i < N; i++) {
        const d = document.createElement('div');
        d.style.position = 'fixed'; d.style.inset = '0 auto auto 0'; d.style.left = (50 + Math.random() * 10 - 5) + 'vw'; d.style.top = '18vh';
        d.style.width = '8px'; d.style.height = '14px'; d.style.borderRadius = '2px'; d.style.background = i % 2 ? 'var(--accent)' : 'var(--accent-2)';
        d.style.transform = `rotate(${Math.random() * 360}deg)`;
        d.style.transition = 'transform 900ms cubic-bezier(.21,1.02,.73,1), opacity 900ms';
        d.style.opacity = '1';
        requestAnimationFrame(() => {
            d.style.transform += ` translate(${(Math.random() * 120 - 60)}px, ${180 + Math.random() * 240}px) rotate(${Math.random() * 360}deg)`;
            d.style.opacity = '0';
        });
        setTimeout(() => d.remove(), 950);
        frag.appendChild(d);
    }
    document.body.appendChild(frag);
}

// ===== UX: mantém índice da seção com scroll =====
window.addEventListener('scroll', () => {
    const y = window.scrollY + window.innerHeight * 0.4;
    for (let i = 0; i < sections.length; i++) {
        if (y >= sections[i].offsetTop) currentIndex = i;
    }
}, { passive: true });
