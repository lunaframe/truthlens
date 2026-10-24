import React, { useState } from 'react';

export default function ExplainabilityChart({ featureAttributions = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!featureAttributions || featureAttributions.length === 0) {
    return null;
  }

  // Max absolute weight for normalized percentage bars
  const maxWeight = Math.max(...featureAttributions.map(f => Math.abs(f.weight)), 1);

  return (
    <div style={{
      backgroundColor: 'var(--paper-card)',
      border: '1px solid var(--paper-border-strong)',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          padding: '28px 32px 20px 32px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          borderBottom: isExpanded ? 'var(--rule-strong)' : 'none',
        }}
      >
        <div>
          <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
            LINGUISTIC STATISTICAL ATTRIBUTION · SHAP/LIME DECOMPOSITION
          </span>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontWeight: 600,
            color: 'var(--ink-primary)',
            marginTop: '2px',
          }}>
            Feature Attribution Waterfall
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.86rem',
            color: 'var(--ink-tertiary)',
            marginTop: '4px',
          }}>
            Word-level coefficient weights showing exact directional impact on the editorial credibility determination.
          </p>
        </div>

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--ink-secondary)',
          textDecoration: 'underline',
        }}>
          [{isExpanded ? 'Collapse' : 'Expand Ledger'}]
        </span>
      </button>

      {/* Body */}
      {isExpanded && (
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Chart Axis Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--ink-muted)',
            borderBottom: 'var(--rule-hairline)',
            paddingBottom: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--accent-red)',
                display: 'inline-block',
              }} />
              <span>← PULLS TOWARD MANIPULATIVE DEFICIT</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>PUSHES TOWARD VERIFIED CREDIBILITY →</span>
              <span style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--ink-verified)',
                display: 'inline-block',
              }} />
            </div>
          </div>

          {/* Diverging Bar Chart Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {featureAttributions.map((feat, idx) => {
              const isNegative = feat.weight < 0;
              const barWidth = Math.min((Math.abs(feat.weight) / maxWeight) * 100, 100);
              const barColor = isNegative ? 'var(--accent-red)' : 'var(--ink-verified)';

              return (
                <div
                  key={`${feat.feature || feat.token || 'f'}-${idx}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 70px',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  {/* Token Word */}
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: 'var(--ink-primary)',
                    textAlign: 'right',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    "{feat.feature || feat.token}"
                  </div>

                  {/* Dual Diverging Center Axis Track */}
                  <div style={{
                    position: 'relative',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--paper-base)',
                    border: '1px solid var(--paper-border)',
                  }}>
                    {/* Zero Center Line */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      backgroundColor: 'var(--ink-primary)',
                      zIndex: 2,
                    }} />

                    {/* Left Bar (Negative / Manipulative) */}
                    {isNegative ? (
                      <div style={{
                        position: 'absolute',
                        right: '50%',
                        height: '100%',
                        width: `${barWidth / 2}%`,
                        backgroundColor: barColor,
                        transition: 'width 250ms ease-out',
                      }} />
                    ) : (
                      /* Right Bar (Positive / Credible) */
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        height: '100%',
                        width: `${barWidth / 2}%`,
                        backgroundColor: barColor,
                        transition: 'width 250ms ease-out',
                      }} />
                    )}
                  </div>

                  {/* Tabular Weight */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: isNegative ? 'var(--accent-red)' : 'var(--ink-verified)',
                    fontWeight: 600,
                  }}>
                    {feat.weight > 0 ? `+${feat.weight.toFixed(2)}` : feat.weight.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footnote Explanation */}
          <div style={{
            borderTop: 'var(--rule-hairline)',
            paddingTop: '14px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--ink-muted)',
            lineHeight: 1.5,
          }}>
            § NOTE: Values correspond to Shapley additive explanations (SHAP). Zero-center reflects baseline linguistic expectation for non-partisan factual reporting.
          </div>

        </div>
      )}
    </div>
  );
}
