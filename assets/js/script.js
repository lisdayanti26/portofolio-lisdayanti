/* ══════════════════════════════════════
   LISDA YANTI – PORTFOLIO JAVASCRIPT
   Cyber Grid Canvas · Terminal Typer · Download Handler
   ══════════════════════════════════════ */

// ── CANVAS BACKGROUND: Animated Cyber Grid ──
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, dots = [], animId;
  const CYAN = '#00d4ff';
  const DOT_COUNT = 60;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createDots() {
    dots = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function drawGrid() {
    ctx.clearRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(15, 52, 96, 0.18)';
    ctx.lineWidth = 0.5;
    const step = 80;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Move dots
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    // Connect nearby dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.25;
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.45)';
      ctx.fill();
    });

    animId = requestAnimationFrame(drawGrid);
  }

  window.addEventListener('resize', () => {
    resize();
    createDots();
  });

  resize();
  createDots();
  drawGrid();
})();


// ── TERMINAL TYPEWRITER ──
(function initTerminal() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  const lines = [
    { type: 'prompt', cmd: 'whoami', delay: 400 },
    { type: 'output', text: 'lisda_yanti@network_engineer', color: 'green', delay: 50 },
    { type: 'prompt', cmd: 'cat profile.txt', delay: 800 },
    { type: 'output', text: 'Role    : Network Engineer & IT Instructor', delay: 40 },
    { type: 'output', text: 'GPA     : 3.69/4.00 — Universitas Pamulang', delay: 40 },
    { type: 'output', text: 'Award   : 1st Place – IT Net Sys Admin, Lebak', delay: 40 },
    { type: 'output', text: 'Status  : Available for opportunities', color: 'green', delay: 40 },
    { type: 'prompt', cmd: 'ls skills/', delay: 800 },
    { type: 'output', text: 'mikrotik/  routing/  linux/  flutter/', color: 'cyan', delay: 40 },
    { type: 'output', text: 'php/       java/     html/   css/', color: 'cyan', delay: 40 },
    { type: 'prompt', cmd: './contact.sh', delay: 700 },
    { type: 'output', text: '> elislisdayanti656@gmail.com', delay: 40 },
    { type: 'output', text: '> 085881653078', delay: 40 },
    { type: 'cursor' },
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let currentEl = null;

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function typeText(el, text) {
    for (const ch of text) {
      el.textContent += ch;
      await sleep(28 + Math.random() * 20);
    }
  }

  async function runTerminal() {
    await sleep(800);
    for (const line of lines) {
      if (line.type === 'cursor') {
        const el = document.createElement('span');
        el.className = 't-cursor';
        terminal.appendChild(el);
        break;
      }

      if (line.type === 'prompt') {
        await sleep(line.delay || 200);
        const row = document.createElement('span');
        row.className = 't-line';
        const promptSpan = document.createElement('span');
        promptSpan.className = 't-prompt';
        promptSpan.textContent = '$ ';
        const cmdSpan = document.createElement('span');
        cmdSpan.className = 't-cmd';
        row.appendChild(promptSpan);
        row.appendChild(cmdSpan);
        terminal.appendChild(row);
        await typeText(cmdSpan, line.cmd);
        await sleep(180);
      } else if (line.type === 'output') {
        await sleep(line.delay || 30);
        const row = document.createElement('span');
        row.className = 't-line t-out';
        if (line.color === 'green') row.classList.add('t-green');
        if (line.color === 'cyan') row.classList.add('t-cyan');
        terminal.appendChild(row);
        await typeText(row, line.text);
        await sleep(20);
      }

      terminal.scrollTop = terminal.scrollHeight;
    }
  }

  runTerminal();
})();


// ── SCROLL-TRIGGERED FADE IN ──
(function initFadeIn() {
  const targets = document.querySelectorAll(
    '.edu-card, .timeline-item, .skill-category, .ach-card, .lead-card, .about-stats, .about-info, .contact-item'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


// ── NAVBAR SCROLL EFFECT ──
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(9, 13, 26, 0.97)';
    } else {
      nav.style.background = 'rgba(9, 13, 26, 0.85)';
    }
  });
})();


// ── DOWNLOAD HANDLER ──
// File paths should point to your actual hosted files.
// Update FILE_URLS with the correct paths before deploying.
const FILE_URLS = {
  cv: 'lisda_yanti_cv.docx',
  pptx: 'lisda_yanti_portfolio.pptx',
};

function downloadFile(type) {
  const url = FILE_URLS[type];
  if (!url) return;

  // Show visual feedback on button
  const btnId = type === 'cv' ? 'dlCV' : 'dlPPTX';
  const btn = document.getElementById(btnId);

  // Check if we're on the hero card or contact section
  const allBtns = document.querySelectorAll('.dl-big-btn, .dl-btn');
  allBtns.forEach(b => {
    const strong = b.querySelector('strong');
    if (!strong) return;
    const isCV = strong.textContent.toLowerCase().includes('cv') || strong.textContent.toLowerCase().includes('resume');
    const isPPTX = strong.textContent.toLowerCase().includes('slide') || strong.textContent.toLowerCase().includes('portfolio');
    if ((type === 'cv' && isCV) || (type === 'pptx' && isPPTX)) {
      const originalText = strong.textContent;
      strong.textContent = '✓ Downloading...';
      strong.style.color = '#00d4ff';
      setTimeout(() => {
        strong.textContent = originalText;
        strong.style.color = '';
      }, 2500);
    }
  });

  // Create download link
  const a = document.createElement('a');
  a.href = url;
  a.download = url.split('/').pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


// ── ACTIVE NAV HIGHLIGHT ──
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? '#00d4ff' : '';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ── SKILL TAG HOVER RIPPLE ──
(function initSkillTags() {
  document.querySelectorAll('.sk-tags span').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.transform = 'scale(0.9)';
      setTimeout(() => (tag.style.transform = ''), 120);
    });
  });
})();