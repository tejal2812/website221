// Custom cursor & mouse coordinate tracking
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; 
  my = e.clientY;
  cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
});

function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
  requestAnimationFrame(animFollower);
}
animFollower();

document.querySelectorAll('a, button, .service-item, .project-row, .grid-item, .floating-card').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hover'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
});

// Clock
function updateClock() {
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const am = h < 12 ? 'AM' : 'PM';
  h = h % 12 || 12;
  document.getElementById('clock').textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${am}`;
}
updateClock(); 
setInterval(updateClock, 60000);

// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});




// View toggle
function setView(v) {
  const list = document.getElementById('listView');
  const grid = document.getElementById('gridView');
  const cols = document.getElementById('colsHeader');
  const lb = document.getElementById('listBtn');
  const gb = document.getElementById('gridBtn');
  if (v === 'grid') {
    list.classList.add('hidden');
    cols.style.display = 'none';
    grid.classList.add('active');
    lb.classList.remove('active');
    gb.classList.add('active');
    grid.querySelectorAll('.grid-item').forEach((el,i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
  } else {
    grid.classList.remove('active');
    cols.style.display = 'grid';
    list.classList.remove('hidden');
    lb.classList.add('active');
    gb.classList.remove('active');
  }
}

// Hover image for project rows
const hoverImg = document.getElementById('hover-img');
function showImg(el, e) {
  const src = el.dataset.img;
  if (src) { 
    hoverImg.src = src; 
    hoverImg.style.opacity = '1'; 
    hoverImg.classList.add('visible');
  }
  moveImg(e);
}
function moveImg(e) {
  hoverImg.style.left = (e.clientX + 30) + 'px';
  hoverImg.style.top = e.clientY + 'px';
}
function hideImg() { 
  hoverImg.style.opacity = '0'; 
  hoverImg.classList.remove('visible');
}

// ---- Framer-Style Animation Engine ----

// 1. Word-split hero title reveal
(function splitHeroTitle() {
  const h1 = document.getElementById('heroTitle');
  if (!h1) return;
  const em = h1.querySelector('em');
  const span = h1.querySelector('span');

  // Split text nodes into word spans
  function wrapWords(node) {
    const text = node.textContent.trim();
    if (!text) return;
    const words = text.split(' ');
    const frag = document.createDocumentFragment();
    words.forEach((w, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'word-wrap';
      const inner = document.createElement('span');
      inner.className = 'word';
      inner.textContent = w + (i < words.length - 1 ? '\u00a0' : '');
      inner.style.transitionDelay = `${0.05 + i * 0.07}s`;
      wrap.appendChild(inner);
      frag.appendChild(wrap);
    });
    node.parentNode.replaceChild(frag, node);
  }

  // Process direct text nodes of h1
  [...h1.childNodes].forEach(n => {
    if (n.nodeType === 3) wrapWords(n);
  });
  // Process the <em> text
  if (em && em.firstChild && em.firstChild.nodeType === 3) {
    const emText = em.textContent.trim();
    em.textContent = '';
    const wrap = document.createElement('span');
    wrap.className = 'word-wrap';
    const inner = document.createElement('span');
    inner.className = 'word';
    inner.textContent = emText;
    inner.style.transitionDelay = '0.15s';
    wrap.appendChild(inner);
    em.appendChild(wrap);
  }

  // Trigger after short delay (page load)
  setTimeout(() => {
    h1.closest('.hero').classList.add('hero-animated');
  }, 300);
})();

// 2. IntersectionObserver for [data-f] and [data-f-group] and legacy .reveal
const springObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add('is-visible', 'visible'); // support both systems
      springObs.unobserve(el);

      // If this is a stats row, fire counter animation
      if (el.id === 'statsRow' || el.classList.contains('stats-row')) {
        el.querySelectorAll('[data-counter]').forEach(counterEl => {
          animateCounter(counterEl, parseInt(counterEl.dataset.counter));
        });
      }
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-f], [data-f-group], .reveal, .stat-block, .img-reveal, .section-label').forEach(el => {
  springObs.observe(el);
});

// Stagger project rows
document.querySelectorAll('.project-row').forEach((el, i) => {
  el.setAttribute('data-f', '');
  el.style.transitionDelay = `${i * 0.07}s`;
  springObs.observe(el);
});

// Service items stagger
document.querySelectorAll('.service-item').forEach((el, i) => {
  el.setAttribute('data-f-child', '');
  el.style.transitionDelay = `${i * 0.08}s`;
});

// Process cards stagger
document.querySelectorAll('.process-card').forEach((el, i) => {
  el.setAttribute('data-f', '');
  el.style.transitionDelay = `${i * 0.09}s`;
  springObs.observe(el);
});

// Grid items
document.querySelectorAll('.grid-item').forEach((el, i) => {
  el.setAttribute('data-f', '');
  el.style.transitionDelay = `${i * 0.07}s`;
  springObs.observe(el);
});

// 3. Magnetic button effect
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.15s ease';
  });
});

// 4. 3D tilt on grid items
document.querySelectorAll('.grid-item, .process-card').forEach(card => {
  card.classList.add('tilt-card');
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// 5. Animated stat counters
function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Testimonial slider
let slidePos = 0;
function slideRight() {
  const track = document.getElementById('testimonialsTrack');
  const cardW = track.querySelector('.testimonial-card').offsetWidth + 24;
  const max = (track.children.length - 1) * cardW;
  slidePos = Math.min(slidePos + cardW, max);
  track.style.transform = `translateX(-${slidePos}px)`;
  track.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
}
function slideLeft() {
  const track = document.getElementById('testimonialsTrack');
  const cardW = track.querySelector('.testimonial-card').offsetWidth + 24;
  slidePos = Math.max(slidePos - cardW, 0);
  track.style.transform = `translateX(-${slidePos}px)`;
  track.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
}

// Smooth parallax on scroll for section titles
document.querySelectorAll('.about-title, .cta-title').forEach(el => {
  window.addEventListener('scroll', () => {
    const rect = el.getBoundingClientRect();
    const progress = 1 - (rect.top / window.innerHeight);
    if (progress > 0 && progress < 2) {
      el.style.transform = `translateY(${(progress - 0.5) * -20}px)`;
    }
  });
});


// ---- Code-Rain Background (Dev Agency style) ----
// Faint scrolling tech/code text streams — very subtle, dark, professional
(function initCodeRain() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  // Words/tokens that scroll down — looks like real code fragments
  const TOKENS = [
    'const', 'async', 'await', 'fetch', 'return', 'export', 'import',
    'function', 'class', 'new', 'true', 'false', 'null', 'undefined',
    '{}', '[]', '=>', '&&', '||', '??', '...', '#!/', 'npm', 'git',
    'push', 'pull', 'commit', 'merge', 'deploy', 'build', 'run',
    'SEO', 'UI', 'UX', 'API', 'CMS', 'CDN', 'DNS', 'SSL', 'HTTP',
    'React', 'Node', 'Next', 'CSS', 'HTML', 'JS', 'TS', 'SQL',
    '0x1f', '#fff', 'px', 'rem', 'vh', 'vw', '%', 'flex', 'grid',
  ];

  const FONT_SIZE = 13;
  const COL_W = 64; // px between columns
  let cols = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initCols();
  }

  function initCols() {
    cols = [];
    const numCols = Math.floor(W / COL_W);
    for (let i = 0; i < numCols; i++) {
      cols.push({
        x: i * COL_W + Math.random() * 20,
        y: Math.random() * -H,            // start above viewport (staggered)
        speed: Math.random() * 0.4 + 0.15, // px per frame — very slow
        alpha: Math.random() * 0.055 + 0.015, // very faint
        token: TOKENS[Math.floor(Math.random() * TOKENS.length)],
        timer: 0,
        changeEvery: Math.floor(Math.random() * 200 + 120), // frames between token changes
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    // Dark background
    ctx.fillStyle = '#050706';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `400 ${FONT_SIZE}px 'JetBrains Mono', 'Fira Code', 'Courier New', monospace`;
    ctx.textBaseline = 'top';

    for (const col of cols) {
      col.timer++;
      col.y += col.speed;

      // Reset column when it scrolls past the bottom
      if (col.y > H + 40) {
        col.y = Math.random() * -200;
        col.speed = Math.random() * 0.4 + 0.15;
        col.alpha = Math.random() * 0.055 + 0.015;
        col.token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
        col.changeEvery = Math.floor(Math.random() * 200 + 120);
        col.timer = 0;
      }

      // Occasionally swap token mid-stream
      if (col.timer % col.changeEvery === 0) {
        col.token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
      }

      // Colour: muted sage-green, no bright neon
      const a = Math.round(col.alpha * 255).toString(16).padStart(2, '0');
      ctx.fillStyle = `#7aad8e${a}`;
      ctx.fillText(col.token, col.x, col.y);
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
