(function restoreScrollPosition() {
  try {
    const key = 'portfolio-scroll-pos';
    const raw = sessionStorage.getItem(key);
    if (!raw) return;
    const pos = JSON.parse(raw);
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') return;
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.__scrollRestorePending = true;
    window.__savedScrollPos = pos;
    document.documentElement.classList.add('scroll-restore-pending');
    if (document.body) {
      document.body.classList.add('scroll-restore-pending');
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('scroll-restore-pending');
      });
    }
    window.scrollTo(pos.x, pos.y);
  } catch (err) {
    // ignore restore failures
  }
})();
