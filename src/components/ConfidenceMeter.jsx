import React, { useEffect, useState } from 'react';

export default function ConfidenceMeter({ score = 85, verdictType = 'real', size = 180 }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate count-up smoothly
  useEffect(() => {
    const duration = 900;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [score]);

  const strokeWidth = 5;
  const radius = (size - 36) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * displayScore) / 100;

  // Editorial color mapping (flat solid ink colors)
  let accentColor = '#1F6B42'; // Dark green ink
  let statusText = 'HIGH CORROBORATION';

  if (verdictType === 'fake') {
    accentColor = '#E4572E'; // Editorial red
    statusText = 'SEVERE DEFICIT';
  } else if (verdictType === 'uncertain') {
    accentColor = '#B87314'; // Amber ink
    statusText = 'INCONCLUSIVE';
  }

  // Generate 20 precision tick marks around circle
  const tickCount = 20;
  const center = size / 2;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${size}px`,
      margin: '0 auto',
      position: 'relative',
    }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {/* Fine Calibration Ticks */}
        {Array.from({ length: tickCount }).map((_, i) => {
          const angle = (i * 360) / tickCount;
          const rad = (angle * Math.PI) / 180;
          const innerR = radius + 9;
          const outerR = radius + (i % 5 === 0 ? 15 : 12);
          const x1 = center + innerR * Math.cos(rad);
          const y1 = center + innerR * Math.sin(rad);
          const x2 = center + outerR * Math.cos(rad);
          const y2 = center + outerR * Math.sin(rad);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 5 === 0 ? 'var(--ink-secondary)' : 'var(--paper-border-strong)'}
              strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
            />
          );
        })}

        {/* Base Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--paper-border)"
          strokeWidth={strokeWidth}
        />

        {/* Precision Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="square"
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: 'stroke-dashoffset 200ms ease-out',
          }}
        />
      </svg>

      {/* Center Readout */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '2px',
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--ink-primary)',
          }}>
            {displayScore}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--ink-tertiary)',
          }}>
            /100
          </span>
        </div>

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.64rem',
          letterSpacing: '0.08em',
          color: accentColor,
          fontWeight: 700,
          marginTop: '6px',
          textTransform: 'uppercase',
        }}>
          {statusText}
        </span>
      </div>
    </div>
  );
}
