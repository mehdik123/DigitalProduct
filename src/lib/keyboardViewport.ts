/** Tracks visual viewport shrink so sticky footers stay above the iOS keyboard. */
export function initKeyboardViewport() {
  const vv = window.visualViewport;
  if (!vv) return () => {};

  const update = () => {
    const kb = Math.max(0, window.innerHeight - vv.height);
    document.documentElement.style.setProperty('--kb', `${kb}px`);
  };

  vv.addEventListener('resize', update);
  vv.addEventListener('scroll', update);
  update();

  return () => {
    vv.removeEventListener('resize', update);
    vv.removeEventListener('scroll', update);
  };
}
