import React, { useState } from 'react';
import { analyzeArticle, SAMPLE_PRESETS } from '../services/nlpEngine';

export default function CompareSourcesModal({ isOpen, onClose, initialArticleText = '' }) {
  const [sourceAText, setSourceAText] = useState(initialArticleText || SAMPLE_PRESETS[1].text);
  const [sourceBText, setSourceBText] = useState(SAMPLE_PRESETS[0].text);
  const [compared, setCompared] = useState(false);
  const [resultA, setResultA] = useState(null);
  const [resultB, setResultB] = useState(null);

  if (!isOpen) return null;

  const handleRunComparison = () => {
    try {
      const resA = analyzeArticle(sourceAText);
      const resB = analyzeArticle(sourceBText);
      setResultA(resA);
      setResultB(resB);
      setCompared(true);
    } catch (err) {
      alert(err.message || 'Please provide sufficient text for both sources.');
    }
  };

  return (
    <div className="editorial-modal-overlay" onClick={onClose}>
      <div
        className="editorial-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1080px' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: 'var(--rule-strong)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
              EDITORIAL COMPARATIVE DOSSIER · DUAL WIRE SCRUTINY
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              marginTop: '2px',
            }}>
              Side-by-Side Sourcing & Outrage Comparison
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-tertiary)', marginTop: '2px' }}>
              Compare two reporting perspectives on the same subject to expose sensationalism, emotional bias, and attribution gaps.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            [Close Dossier]
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Inputs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {/* Source A */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'var(--paper-base)',
              border: '1px solid var(--paper-border-strong)',
              padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="small-caps" style={{ color: 'var(--ink-primary)', fontWeight: 700 }}>
                  DOSSIER A (REFERENCE / WIRE)
                </span>
                <button
                  onClick={() => setSourceAText(SAMPLE_PRESETS[1].text)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ink-secondary)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Load Reuters Dispatch
                </button>
              </div>
              <textarea
                value={sourceAText}
                onChange={(e) => setSourceAText(e.target.value)}
                placeholder="Paste text of first reporting source..."
                rows={6}
                style={{
                  width: '100%',
                  background: 'var(--paper-card)',
                  border: '1px solid var(--paper-border)',
                  padding: '12px',
                  color: 'var(--ink-primary)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>

            {/* Source B */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: 'var(--paper-base)',
              border: '1px solid var(--paper-border-strong)',
              padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="small-caps" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
                  DOSSIER B (SPECIMEN TO TEST)
                </span>
                <button
                  onClick={() => setSourceBText(SAMPLE_PRESETS[0].text)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--ink-secondary)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Load Viral Post
                </button>
              </div>
              <textarea
                value={sourceBText}
                onChange={(e) => setSourceBText(e.target.value)}
                placeholder="Paste text of second reporting source..."
                rows={6}
                style={{
                  width: '100%',
                  background: 'var(--paper-card)',
                  border: '1px solid var(--paper-border)',
                  padding: '12px',
                  color: 'var(--ink-primary)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Compare Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleRunComparison}
              className="btn-ink"
              style={{ padding: '12px 28px' }}
            >
              <span>Compute comparative differential</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Comparative Results Matrix */}
          {compared && resultA && resultB && (
            <div style={{
              marginTop: '12px',
              borderTop: 'var(--rule-strong)',
              paddingTop: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}>
                {/* Result A */}
                <div style={{
                  backgroundColor: 'var(--paper-card)',
                  border: '1px solid var(--paper-border-strong)',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="small-caps">DOSSIER A ASSESSMENT</span>
                    <span className={`rubber-stamp ${resultA.verdictType === 'real' ? 'stamp-real' : 'stamp-fake'}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                      {resultA.verdict}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: 'var(--ink-primary)',
                    marginBottom: '8px',
                  }}>
                    {resultA.credibilityScore} <span style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>/100</span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>• Emotional Outrage: <strong>{resultA.subScores.emotionalIntensity}%</strong></div>
                    <div>• Attribution Rigor: <strong>{resultA.subScores.sourceReliability}%</strong></div>
                    <div>• Factual Density: <strong>{resultA.subScores.factualDensity}%</strong></div>
                  </div>
                </div>

                {/* Result B */}
                <div style={{
                  backgroundColor: 'var(--paper-card)',
                  border: '1px solid var(--paper-border-strong)',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="small-caps">DOSSIER B ASSESSMENT</span>
                    <span className={`rubber-stamp ${resultB.verdictType === 'real' ? 'stamp-real' : 'stamp-fake'}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                      {resultB.verdict}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: 'var(--ink-primary)',
                    marginBottom: '8px',
                  }}>
                    {resultB.credibilityScore} <span style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>/100</span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>• Emotional Outrage: <strong>{resultB.subScores.emotionalIntensity}%</strong></div>
                    <div>• Attribution Rigor: <strong>{resultB.subScores.sourceReliability}%</strong></div>
                    <div>• Factual Density: <strong>{resultB.subScores.factualDensity}%</strong></div>
                  </div>
                </div>
              </div>

              {/* Examiner Comparative Note */}
              <div style={{
                backgroundColor: 'var(--paper-base)',
                border: '1px solid var(--paper-border)',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                color: 'var(--ink-secondary)',
                lineHeight: 1.5,
              }}>
                <strong style={{ color: 'var(--ink-primary)' }}>EDITORIAL ATTRIBUTION DELTA: </strong>
                Dossier A exhibits a {Math.abs(resultA.credibilityScore - resultB.credibilityScore)} point credibility differential over Dossier B, with significantly lower sensational intensifiers and superior institutional cross-verification.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
