// Swipe a bottom sheet down to close it. Touch: drag down from anywhere while the sheet is scrolled to the top.
// Mouse: drag the grabber or the heading.
export function enableSwipeClose(sheet, onClose, { handle = '.grabber, .head' } = {}) {
  let startY = 0;
  let dy = 0;
  let active = false;

  const move = y => {
    dy = Math.max(0, y - startY);
    sheet.style.transition = 'none';
    sheet.style.transform = dy > 0 ? `translateY(${dy}px)` : '';
  };
  const end = () => {
    if (!active) return;
    active = false;
    sheet.style.transition = 'transform .18s ease';
    if (dy > 80) {
      sheet.style.transform = 'translateY(110%)';
      setTimeout(() => { sheet.style.transition = ''; sheet.style.transform = ''; onClose(); }, 160);
    } else {
      sheet.style.transform = '';
      setTimeout(() => { sheet.style.transition = ''; }, 200);
    }
    dy = 0;
  };

  sheet.addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || e.target.closest?.('input, select, textarea')) { active = false; return; }
    active = sheet.scrollTop <= 0;
    startY = e.touches[0].clientY;
    dy = 0;
  }, { passive: true });
  sheet.addEventListener('touchmove', e => {
    if (!active) return;
    const y = e.touches[0].clientY;
    if (y - startY <= 0 && dy === 0) return;   // scrolling up: let the sheet scroll
    if (e.cancelable) e.preventDefault();
    move(y);
  }, { passive: false });
  sheet.addEventListener('touchend', end);
  sheet.addEventListener('touchcancel', end);

  sheet.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || !e.target.closest?.(handle)) return;
    active = true;
    startY = e.clientY;
    const onMove = ev => move(ev.clientY);
    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); end(); };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });
}
