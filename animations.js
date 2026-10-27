// ============================================================
//  animations.js — Micro-interactions & Visual Effects
// ============================================================

// ── Floating ambient particles ──────────────────────────────

let particleInterval = null;

function createParticle(container) {
  const particle = document.createElement('div');
  
  if (container.id === 'screen-chat' || container.id === 'chat-drifting-particles') {
    particle.classList.add('chat-drifting-particle');
    const symbols = ['💕', '💗', '🌸', '💓', '✦', '✨', '💖', '🩷', '♥'];
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const x = Math.random() * 96 + 2;
    const duration = 7 + Math.random() * 6;
    const delay = Math.random() * 1.5;
    const size = 14 + Math.random() * 16;
    const blur = Math.random() > 0.6 ? (1 + Math.random() * 3) : 0;
    const color = Math.random() > 0.5 ? '#ff4088' : '#ff735c';

    particle.style.cssText = `
      left: ${x}%;
      bottom: -35px;
      font-size: ${size}px;
      color: ${color};
      filter: blur(${blur}px) drop-shadow(0 0 6px ${color});
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;
    const target = document.getElementById('chat-drifting-particles') || container;
    target.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + delay) * 1000 + 600);
    return;
  }

  particle.classList.add('ambient-particle');
  const symbols = ['💕', '🌸', '💗', '🌷', '💓', '🩷', '❤️', '🌺'];
  particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  const x = Math.random() * 100;
  const duration = 4 + Math.random() * 5;
  const delay = Math.random() * 2;
  const size = 12 + Math.random() * 14;

  particle.style.cssText = `
    left: ${x}%;
    bottom: -30px;
    font-size: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: 0;
  `;

  container.appendChild(particle);
  setTimeout(() => particle.remove(), (duration + delay) * 1000 + 500);
}

function startAmbientParticles(containerId) {
  stopAmbientParticles();
  const container = document.getElementById(containerId) || document.body;
  const intervalTime = (containerId === 'screen-chat') ? 450 : 800;
  particleInterval = setInterval(() => createParticle(container), intervalTime);
}

function stopAmbientParticles() {
  if (particleInterval) {
    clearInterval(particleInterval);
    particleInterval = null;
  }
}

// ── Heart burst on send ─────────────────────────────────────

function heartBurst(originEl) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const count = 7;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.textContent = ['💕', '💗', '💓', '🩷'][Math.floor(Math.random() * 4)];
    heart.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${14 + Math.random() * 12}px;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: none;
    `;
    document.body.appendChild(heart);

    const angle = (360 / count) * i + (Math.random() * 30 - 15);
    const distance = 50 + Math.random() * 60;
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance;

    requestAnimationFrame(() => {
      heart.style.transition = 'all 0.8s ease-out';
      heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 900);
  }
}

// ── Welcome screen heart burst ──────────────────────────────

function welcomeHeartBurst() {
  const count = 20;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.textContent = ['💕', '💗', '💓', '🩷', '❤️', '🌸'][Math.floor(Math.random() * 6)];
      const x = 10 + Math.random() * 80;
      const startY = 30 + Math.random() * 60;
      heart.style.cssText = `
        position: fixed;
        left: ${x}vw;
        top: ${startY}vh;
        font-size: ${16 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transition: all 1.2s ease-out;
      `;
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          heart.style.transform = `translateY(-${80 + Math.random() * 40}px) rotate(${Math.random() * 60 - 30}deg)`;
          heart.style.opacity = '0';
        });
      });

      setTimeout(() => heart.remove(), 1300);
    }, i * 80);
  }
}

// ── Sparkle rain (header button) ───────────────────────────

function sparkleRain() {
  const count = 40;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const spark = document.createElement('div');
      spark.textContent = ['💕', '🌸', '💗', '🌷'][Math.floor(Math.random() * 4)];
      const x = Math.random() * 100;
      spark.style.cssText = `
        position: fixed;
        left: ${x}vw;
        top: -30px;
        font-size: ${14 + Math.random() * 16}px;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transition: all ${1.5 + Math.random() * 1}s ease-in;
      `;
      document.body.appendChild(spark);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          spark.style.top = `${90 + Math.random() * 20}vh`;
          spark.style.opacity = '0';
          spark.style.transform = `rotate(${Math.random() * 360}deg)`;
        });
      });

      setTimeout(() => spark.remove(), 2600);
    }, i * 60);
  }
}

// ── Gradient mood shift ─────────────────────────────────────

function shiftGradientMood(mood) {
  const root = document.documentElement;
  if (mood === 'happy' || mood === 'compliment') {
    root.style.setProperty('--grad-shift', '15deg');
    root.style.setProperty('--grad-mid', '#ff8c69');
  } else if (mood === 'sad' || mood === 'lonely') {
    root.style.setProperty('--grad-shift', '-15deg');
    root.style.setProperty('--grad-mid', '#d63f8e');
  } else if (mood === 'love') {
    root.style.setProperty('--grad-shift', '0deg');
    root.style.setProperty('--grad-mid', '#e8549a');
  } else {
    root.style.setProperty('--grad-shift', '0deg');
    root.style.setProperty('--grad-mid', '#f472b6');
  }
}

// ── Message reveal animation ────────────────────────────────

function revealMessage(el, direction = 'left') {
  el.style.opacity = '0';
  el.style.transform = direction === 'right'
    ? 'translateX(30px)'
    : 'translateX(-30px)';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    });
  });
}

// ── Orb dot ring builder ────────────────────────────────────

function buildOrbDots(containerId, dotCount = 20) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('orb-dot');
    const angle = (360 / dotCount) * i;
    dot.style.setProperty('--angle', `${angle}deg`);
    dot.style.setProperty('--i', i);

    // Vary sizes for organic look
    const size = 4 + Math.random() * 5;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;

    container.appendChild(dot);
  }
}

// ── Screen transition helpers ───────────────────────────────

function fadeOut(el, duration = 500) {
  return new Promise(resolve => {
    el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.97)';
    setTimeout(resolve, duration);
  });
}

function fadeIn(el, duration = 500) {
  el.style.opacity = '0';
  el.style.transform = 'scale(1.03)';
  el.style.display = 'flex';

  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
        setTimeout(resolve, duration);
      });
    });
  });
}

// ── Shimmer on element ──────────────────────────────────────

function addShimmer(el) {
  el.classList.add('shimmer-active');
  setTimeout(() => el.classList.remove('shimmer-active'), 700);
}

// ── Input focus glow ────────────────────────────────────────

function attachInputGlow(inputEl) {
  inputEl.addEventListener('focus', () => {
    inputEl.closest('.input-bar')?.classList.add('input-glow');
  });
  inputEl.addEventListener('blur', () => {
    inputEl.closest('.input-bar')?.classList.remove('input-glow');
  });
}
