import { useMemo } from 'react';

export default function Sakura() {
  const petals = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 8,
      size: 8 + Math.random() * 14,
      opacity: 0.3 + Math.random() * 0.5,
      drift: -60 + Math.random() * 120,
      rotate: Math.random() * 360,
      rotateEnd: 360 + Math.random() * 720,
    })), []);

  return (
    <div className="sakura-container" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--size': `${p.size}px`,
            '--petal-opacity': p.opacity,
            '--rotate-start': `${p.rotate}deg`,
            '--rotate-end': `${p.rotateEnd}deg`,
          }}
        />
      ))}
    </div>
  );
}
