import React, { useState, useEffect } from 'react';

export default function ScanningLoader() {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    { code: 'PASS 1/4', label: 'Segmenting clauses and establishing semantic baseline...', progress: 25 },
    { code: 'PASS 2/4', label: 'Screening for emotive superlatives and moral-outrage framing...', progress: 55 },
    { code: 'PASS 3/4', label: 'Verifying attribution density and institutional citations...', progress: 80 },
    { code: 'PASS 4/4', label: 'Compiling SHAP linguistic feature attributions & ledger...', progress: 98 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div style={{
      backgroundColor: 'var(--paper-card)',
      border: '1px solid var(--paper-border-strong)',
      padding: '36px 32px',
      margin: '24px 0 40px 0',
      boxShadow: 'var(--shadow-card)',
    }}>
      
      {/* Editorial Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 'var(--rule-hairline)',
        paddingBottom: '14px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-red)',
            display: 'inline-block',
          }}></span>
          <span className="small-caps" style={{ color: 'var(--ink-primary)', fontWeight: 600 }}>
            EDITORIAL FACT-CHECK AUDIT IN PROGRESS
          </span>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
          {stages[stageIndex].code} · {stages[stageIndex].progress}% COMPLETE
        </span>
      </div>

      {/* Active Stage Label */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontStyle: 'italic',
          color: 'var(--ink-primary)',
          marginBottom: '8px',
        }}>
          "{stages[stageIndex].label}"
        </p>
      </div>

      {/* Hairline Progress Bar - Flat Ink, Zero Glow */}
      <div style={{
        width: '100%',
        height: '2px',
        backgroundColor: 'var(--paper-border)',
        marginBottom: '28px',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${stages[stageIndex].progress}%`,
          backgroundColor: 'var(--ink-primary)',
          transition: 'width 300ms ease-out',
        }} />
      </div>

      {/* Verification Stages Checklist */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.74rem',
      }}>
        {stages.map((st, i) => {
          const isDone = i < stageIndex;
          const isCurrent = i === stageIndex;
          return (
            <div
              key={st.code}
              style={{
                borderLeft: `2px solid ${isDone ? 'var(--ink-verified)' : isCurrent ? 'var(--accent-red)' : 'var(--paper-border)'}`,
                paddingLeft: '10px',
                color: isDone ? 'var(--ink-secondary)' : isCurrent ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              <div style={{ fontWeight: 600, color: isDone ? 'var(--ink-verified)' : isCurrent ? 'var(--accent-red)' : 'inherit' }}>
                {isDone ? '✓ VERIFIED' : isCurrent ? '▶ EXECUTING' : 'PENDING'}
              </div>
              <div style={{ fontSize: '0.72rem', marginTop: '2px', lineHeight: 1.35 }}>
                {st.label.split('...')[0]}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
