(function () {
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* Drag-to-scroll sliders (Our Journey, reviews) */
  document.querySelectorAll('[data-drag]').forEach(function (el) {
    var down = false, startX = 0, startLeft = 0, moved = false;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved = true; el.classList.add('dragging'); }
      el.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; el.classList.remove('dragging');
    });
  });

  /* Count-up numbers (Photography studio) */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (calm) { el.textContent = target + suffix; return; }
    var t0 = performance.now(), dur = 1400;
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  var appear = document.querySelectorAll('.ap, .feat');
  if (calm || !('IntersectionObserver' in window)) {
    appear.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  /* Buttons: the label rolls up on hover */
  document.querySelectorAll('.button').forEach(function (btn) {
    var label = btn.textContent.trim();
    if (!label) return;
    btn.textContent = '';
    var roll = document.createElement('span'); roll.className = 'roll';
    var a = document.createElement('span'); a.textContent = label;
    var b = document.createElement('span'); b.textContent = label; b.setAttribute('aria-hidden', 'true');
    roll.appendChild(a); roll.appendChild(b); btn.appendChild(roll);
  });

  /* Appear on scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      var c = entry.target.querySelector('[data-count]');
      if (c) countUp(c);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  appear.forEach(function (el) { io.observe(el); });

  /* Scroll-linked scale: cards and panels grow from 90% to 100% as they reach the middle of the screen */
  var scaled = Array.prototype.slice.call(document.querySelectorAll('.sc'));
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    scaled.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var d = Math.abs((r.top + r.height / 2) - vh / 2) / (vh * 0.75);
      var s = 0.9 + 0.1 * (1 - Math.min(1, d));
      el.style.transform = 'scale(' + s.toFixed(4) + ')';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
