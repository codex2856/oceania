(function () {
  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.rv');

  if (calm || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  /* Buttons: the label rolls up on hover */
  document.querySelectorAll('.button').forEach(function (btn) {
    var label = btn.textContent.trim();
    btn.textContent = '';
    var roll = document.createElement('span');
    roll.className = 'roll';
    var a = document.createElement('span'); a.textContent = label;
    var b = document.createElement('span'); b.textContent = label; b.setAttribute('aria-hidden', 'true');
    roll.appendChild(a); roll.appendChild(b);
    btn.appendChild(roll);
  });

  /* Scroll reveal: elements rise and fade in, photos grow from 90% */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach(function (el) { io.observe(el); });
})();
