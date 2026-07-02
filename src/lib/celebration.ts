import { haptic } from './haptics';

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = ['#E11D48', '#FF6A4D', '#F5F5F6'];

/** delight-moments skill — lightweight DOM confetti (no extra dependency). */
export function fireConfetti(options?: { particleCount?: number }) {
  if (reducedMotion() || typeof document === 'undefined') return;

  const count = options?.particleCount ?? 90;
  const root = document.createElement('div');
  root.setAttribute('aria-hidden', 'true');
  root.style.cssText =
    'pointer-events:none;position:fixed;inset:0;z-index:9999;overflow:hidden';
  document.body.appendChild(root);

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const size = 4 + Math.random() * 6;
    const left = 20 + Math.random() * 60;
    const delay = Math.random() * 0.25;
    const duration = 0.7 + Math.random() * 0.5;
    p.style.cssText = `
      position:absolute;
      left:${left}%;
      top:55%;
      width:${size}px;
      height:${size * 0.6}px;
      background:${COLORS[i % COLORS.length]};
      border-radius:1px;
      opacity:0.95;
      transform:translateY(0) rotate(0deg);
      animation:ha-confetti ${duration}s cubic-bezier(.22,1,.36,1) ${delay}s forwards;
    `;
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 280}px`);
    p.style.setProperty('--dy', `${-120 - Math.random() * 220}px`);
    p.style.setProperty('--rot', `${Math.random() * 720}deg`);
    root.appendChild(p);
  }

  if (!document.getElementById('ha-confetti-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ha-confetti-keyframes';
    style.textContent = `
      @keyframes ha-confetti {
        to {
          transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  window.setTimeout(() => root.remove(), 1600);
}

export function celebrateWeekUnlock() {
  haptic.success();
  fireConfetti();
}

export function celebrateWorkoutComplete() {
  haptic.success();
  fireConfetti({ particleCount: 60 });
}

export function celebratePR() {
  haptic.success();
  fireConfetti({ particleCount: 110 });
}
