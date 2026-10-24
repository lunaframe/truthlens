import React from 'react';

export default function CredibilityBreakdown({ subScores }) {
  const {
    emotionalIntensity = 20,
    sourceReliability = 85,
    factualDensity = 80,
    clickbaitScore = 15,
  } = subScores || {};

  const vectors = [
    {
      code: 'V-01',
      name: 'Emotional Outrage Intensity',
      value: emotionalIntensity,
      invertGood: true,
      description: 'Measures prevalence of panic triggers, hyperbolic adjectives, and moral-indictment phrasing.',
      rating: emotionalIntensity > 60 ? 'INFLAMMATORY' : emotionalIntensity > 35 ? 'ELEVATED' : 'SOBER & RESTRAINED',
      color: emotionalIntensity > 60 ? 'var(--accent-red)' : emotionalIntensity > 35 ? 'var(--ink-uncertain)' : 'var(--ink-verified)',
    },
    {
      code: 'V-02',
      name: 'Attribution Rigor & Sourcing',
      value: sourceReliability,
      invertGood: false,
      description: 'Verifies presence of named institutions, public registries, primary documents, and direct quotes.',
      rating: sourceReliability >= 70 ? 'PRIMARY CORROBORATION' : sourceReliability >= 45 ? 'PARTIAL / ANONYMOUS' : 'UNVERIFIED CLAIMS',
      color: sourceReliability >= 70 ? 'var(--ink-verified)' : sourceReliability >= 45 ? 'var(--ink-uncertain)' : 'var(--accent-red)',
    },
    {
      code: 'V-03',
      name: 'Empirical & Quantitative Density',
      value: factualDensity,
      invertGood: false,
      description: 'Calculates concentration of verifiable data points, verifiable calendar dates, and empirical metrics.',
      rating: factualDensity >= 65 ? 'DATA-DENSE' : factualDensity >= 40 ? 'MODERATE DEPTH' : 'ANECDOTAL / ABSTRACT',
      color: factualDensity >= 65 ? 'var(--ink-verified)' : factualDensity >= 40 ? 'var(--ink-uncertain)' : 'var(--accent-red)',
    },
    {
      code: 'V-04',
      name: 'Sensationalism & Clickbait Framing',
      value: clickbaitScore,
      invertGood: true,
      description: 'Scans headline and lead clauses for curiosity-gap hooks, cliffhangers, and viral manipulation syntax.',
      rating: clickbaitScore > 60 ? 'VIRAL MANIPULATION' : clickbaitScore > 35 ? 'LEANING SENSATIONAL' : 'OBJECTIVE HEADLINE',
      color: clickbaitScore > 60 ? 'var(--accent-red)' : clickbaitScore > 35 ? 'var(--ink-uncertain)' : 'var(--ink-verified)',
    },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--paper-card)',
      border: '1px solid var(--paper-border-strong)',
      boxShadow: 'var(--shadow-card)',
      padding: '32px',
    }}>
      {/* Ledger Header */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: 'var(--rule-strong)',
        paddingBottom: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
            FORENSIC LINGUISTIC LEDGER · 4-FACTOR DECOMPOSITION
          </span>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            fontWeight: 600,
            color: 'var(--ink-primary)',
            marginTop: '2px',
          }}>
            Detailed Sub-Vector Evaluation
          </h3>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
          NORMALIZED SCALE (0—100)
        </span>
      </div>

      {/* Ledger Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {vectors.map((vec, i) => (
          <div
            key={vec.code}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 220px 1fr 140px 180px',
              gap: '20px',
              alignItems: 'center',
              padding: '18px 0',
              borderBottom: i < vectors.length - 1 ? 'var(--rule-hairline)' : 'none',
            }}
          >
            {/* Code */}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: 'var(--ink-muted)',
              fontWeight: 600,
            }}>
              {vec.code}
            </span>

            {/* Name */}
            <div>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--ink-primary)',
                display: 'block',
              }}>
                {vec.name}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--ink-tertiary)',
              lineHeight: 1.45,
            }}>
              {vec.description}
            </p>

            {/* Progress Bar & Value */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                marginBottom: '6px',
              }}>
                <span style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>{vec.value}</span>
                <span style={{ color: 'var(--ink-muted)', fontSize: '0.7rem' }}>/100</span>
              </div>
              <div style={{
                height: '3px',
                width: '100%',
                backgroundColor: 'var(--paper-border)',
                position: 'relative',
              }}>
                <div style={{
                  height: '100%',
                  width: `${vec.value}%`,
                  backgroundColor: vec.color,
                  transition: 'width 300ms ease-out',
                }} />
              </div>
            </div>

            {/* Editorial Rating */}
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: vec.color,
                letterSpacing: '0.04em',
                padding: '3px 8px',
                backgroundColor: 'var(--paper-base)',
                border: `1px solid ${vec.color}`,
                display: 'inline-block',
              }}>
                {vec.rating}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
