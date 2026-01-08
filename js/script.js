// ========================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ========================================
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

// ========================================
// FAQ ACCORDION
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Fecha outros itens abertos
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle do item atual
        item.classList.toggle('active');
    });
});

// ========================================
// ANIMAÇÃO DE ENTRADA (INTERSECTION OBSERVER)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elementos para animar
const animatedElements = document.querySelectorAll(
    '.pillar-card, .bonus-card, .pain-icon, .offer-box, .faq-item'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ========================================
// CONTADOR DE VAGAS INTELIGENTE COM CONTAGEM REGRESSIVA
// ========================================
function initVacanciesCounter() {
    const vacanciesNumberEl = document.getElementById('vacanciesNumber');
    const progressFillEl = document.getElementById('progressFill');
    const lastUpdateEl = document.getElementById('lastUpdate');
    
    if (!vacanciesNumberEl || !progressFillEl || !lastUpdateEl) return;
    
    const TOTAL_VACANCIES = 1000;
    const INITIAL_VACANCIES = 437;
    const MIN_VACANCIES = 50; // Mínimo antes de resetar
    const COUNTDOWN_INTERVAL = 5 * 60 * 1000; // 5 minutos em milissegundos
    const POSSIBLE_REDUCTIONS = [3, 5, 7]; // Reduz 3, 5 ou 7 vagas aleatoriamente
    
    // Função para obter timestamp atual
    function getCurrentTimestamp() {
        return Date.now();
    }
    
    // Função para formatar tempo decorrido
    function formatTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'agora mesmo';
        if (seconds < 120) return '1 minuto atrás';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos atrás`;
        if (seconds < 7200) return '1 hora atrás';
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} horas atrás`;
        return 'hoje';
    }
    
    // Inicializar dados do localStorage
    let storedData = localStorage.getItem('vacanciesData');
    let vacanciesData;
    
    if (storedData) {
        vacanciesData = JSON.parse(storedData);
        
        // Calcular quantas reduções devem ter acontecido desde a última visita
        const timeSinceLastUpdate = getCurrentTimestamp() - vacanciesData.lastUpdate;
        const intervalsPassed = Math.floor(timeSinceLastUpdate / COUNTDOWN_INTERVAL);
        
        if (intervalsPassed > 0) {
            // Reduzir vagas pelos intervalos que passaram
            for (let i = 0; i < intervalsPassed; i++) {
                const reduction = POSSIBLE_REDUCTIONS[Math.floor(Math.random() * POSSIBLE_REDUCTIONS.length)];
                vacanciesData.current -= reduction;
            }
            
            vacanciesData.lastUpdate = getCurrentTimestamp();
            
            // Se ficou muito baixo, resetar com um número aleatório
            if (vacanciesData.current < MIN_VACANCIES) {
                vacanciesData.current = Math.floor(Math.random() * (INITIAL_VACANCIES - 300)) + 300; // Entre 300 e 437
            }
        }
    } else {
        // Primeira visita - inicializar
        vacanciesData = {
            current: INITIAL_VACANCIES,
            lastUpdate: getCurrentTimestamp()
        };
    }
    
    // Salvar no localStorage
    localStorage.setItem('vacanciesData', JSON.stringify(vacanciesData));
    
    // Função para atualizar a UI
    function updateUI() {
        const current = vacanciesData.current;
        const percentage = (current / TOTAL_VACANCIES) * 100;
        
        // Atualizar número de vagas com animação
        vacanciesNumberEl.textContent = current;
        
        // Atualizar barra de progresso
        progressFillEl.style.width = `${percentage}%`;
        
        // Atualizar timestamp
        lastUpdateEl.textContent = formatTimeAgo(vacanciesData.lastUpdate);
        
        // Adicionar classe de urgência se estiver acabando
        const urgencyBox = document.querySelector('.urgency-box');
        if (current < 100) {
            urgencyBox.classList.add('critical-urgency');
        } else {
            urgencyBox.classList.remove('critical-urgency');
        }
    }
    
    // Atualizar UI inicial
    updateUI();
    
    // Configurar contagem regressiva automática (a cada 5 minutos)
    setInterval(() => {
        const reduction = POSSIBLE_REDUCTIONS[Math.floor(Math.random() * POSSIBLE_REDUCTIONS.length)];
        vacanciesData.current -= reduction;
        vacanciesData.lastUpdate = getCurrentTimestamp();
        
        // Resetar se ficar muito baixo
        if (vacanciesData.current < MIN_VACANCIES) {
            vacanciesData.current = Math.floor(Math.random() * (INITIAL_VACANCIES - 300)) + 300;
        }
        
        localStorage.setItem('vacanciesData', JSON.stringify(vacanciesData));
        updateUI();
        
        console.log(`🔥 Vagas reduzidas em ${reduction}! Restam agora: ${vacanciesData.current}`);
    }, COUNTDOWN_INTERVAL);
    
    // Atualizar o "tempo atrás" a cada minuto
    setInterval(() => {
        lastUpdateEl.textContent = formatTimeAgo(vacanciesData.lastUpdate);
    }, 60000); // A cada 1 minuto
}

// Inicializar contador ao carregar a página
initVacanciesCounter();

// ========================================
// SCROLL INDICATOR
// ========================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const painSection = document.querySelector('.pain-section');
        if (painSection) {
            painSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Esconde após scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ========================================
// EFEITO DE PARTÍCULAS NO HERO
// ========================================
function createParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
        `;
        heroParticles.appendChild(particle);
    }
}

// Adiciona keyframe de twinkle dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

createParticles();

// ========================================
// TRACKING DE CTAs (PREPARADO PARA ANALYTICS)
// ========================================
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = button.textContent.trim();
        console.log('CTA Clicked:', buttonText);
        
        // Aqui você pode adicionar tracking do Google Analytics, Facebook Pixel, etc.
        // Exemplo: gtag('event', 'click', { 'event_category': 'CTA', 'event_label': buttonText });
        
        // Por enquanto, redireciona para seção de oferta ou página de checkout
        if (!button.getAttribute('href').startsWith('#')) {
            // Se for link externo, deixa seguir normalmente
            return;
        }
    });
});

// ========================================
// LAZY LOADING DE IMAGENS
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback para navegadores antigos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// PARALLAX SUAVE NO SCROLL
// ========================================
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-particles, .bonus-bg-overlay');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ========================================
// ADICIONA CLASSE QUANDO ELEMENTO ESTÁ VISÍVEL
// ========================================
const inViewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.section-title, .pillar-card, .bonus-card').forEach(el => {
    inViewObserver.observe(el);
});

// ========================================
// PREVINE ZOOM EM IOS AO FOCAR INPUT
// ========================================
const viewportMeta = document.querySelector('meta[name="viewport"]');
if (viewportMeta && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
}

// ========================================
// CONSOLE LOG PARA DEBUG
// ========================================
console.log('%c🐾 O Guardião Espiritual dos Animais', 'color: #D4AF37; font-size: 20px; font-weight: bold;');
console.log('%cLanding Page carregada com sucesso!', 'color: #8B7FA8; font-size: 14px;');

// ========================================
// PERFORMANCE: ADICIONA LOADING ESTADO
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('✅ Página totalmente carregada');
});

// ========================================
// EASTER EGG: MENSAGEM ESPECIAL
// ========================================
setTimeout(() => {
    console.log(
        '%c💜 Proteja quem sempre te protegeu',
        'background: linear-gradient(135deg, #8B7FA8, #E8B4D4); color: white; padding: 10px 20px; font-size: 16px; border-radius: 10px;'
    );
}, 2000);
