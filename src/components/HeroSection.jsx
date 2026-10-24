import React from 'react';

export default function HeroSection({ onScrollToAnalyzer, onOpenCompare }) {
  return (
    <section style={{
      padding: '48px 0 64px 0',
      borderBottom: 'var(--rule-hairline)',
      position: 'relative',
    }}>
      <div className="grid-12" style={{ alignItems: 'start' }}>
        
        {/* Left Column: Asymmetric Editorial Brief (5 of 12 columns) */}
        <div style={{
          gridColumn: 'span 5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingRight: '24px',
        }}>
          
          {/* Section Marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--accent-red)',
              display: 'inline-block',
            }}></span>
            <span className="small-caps">
              FIG. 01 — Editorial Forensics Desk
            </span>
          </div>

          {/* Characterful Serif Headline - Sentence Case, Tight Tracking */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 4.2vw, 3.75rem)',
            fontWeight: 500,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: 'var(--ink-primary)',
            marginBottom: '24px',
          }}>
            Read the article. <br />
            Then read what it’s doing to you.
          </h1>

          {/* Plain, specific, dry editorial subcopy */}
          <p style={{
            fontSize: '1.08rem',
            lineHeight: 1.6,
            color: 'var(--ink-secondary)',
            marginBottom: '36px',
            maxWidth: '440px',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
          }}>
            TruthLens marks the loaded language, emotional pressure, and weak sourcing in any news story, and shows its work.
          </p>

          {/* Primary Action Button & Underlined Secondary Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '44px' }}>
            <button
              onClick={onScrollToAnalyzer}
              className="btn-ink"
            >
              <span>Audit an article</span>
              <span aria-hidden="true">→</span>
            </button>

            <button
              onClick={onOpenCompare}
              className="link-editorial"
            >
              Compare two sources side-by-side
            </button>
          </div>

          {/* Footnote-Style Caption with Imperfect Real Data */}
          <div style={{
            borderTop: 'var(--rule-hairline)',
            paddingTop: '16px',
            maxWidth: '420px',
          }}>
            <p className="small-caps" style={{ marginBottom: '6px', color: 'var(--ink-muted)' }}>
              OBSERVED CASE METRICS · OCT 2026
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--ink-tertiary)',
              lineHeight: 1.5,
            }}>
              Outrage index 71 · 14 loaded terms isolated · 3 anonymous attributions · 0.28 sec linguistic decomposition.
            </p>
          </div>

        </div>

        {/* Right Column: Signature Visual — Marked-Up Galley Proof / Case File (7 of 12 columns) */}
        <div style={{
          gridColumn: 'span 7',
          position: 'relative',
        }}>
          
          {/* Physical Galley Sheet Container */}
          <div style={{
            backgroundColor: 'var(--paper-card)',
            border: '1px solid var(--paper-border-strong)',
            padding: '36px 36px 28px 36px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
          }}>

            {/* Proof Sheet Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: 'var(--rule-strong)',
              paddingBottom: '16px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <p className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
                  CASE SPECIMEN #TL-8402 · EDITORIAL GALLEY PROOF
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--ink-muted)',
                  marginTop: '2px',
                }}>
                  ORIGIN: SYNDICATED FEED · TIMESTAMP: 14:18:02 EST
                </p>
              </div>

              {/* Slanted Rubber Stamp */}
              <div className="rubber-stamp stamp-fake">
                CREDIBILITY 34/100 · SEVERE DEFICIT
              </div>
            </div>

            {/* Galley Body with Proofreader Annotations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 180px',
              gap: '24px',
            }}>
              
              {/* Article Text with Highlighting & Underlining */}
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--ink-primary)',
              }}>
                <p style={{ marginBottom: '16px' }}>
                  An internal memo circulating among regulatory officials has sparked{' '}
                  <span className="proof-highlight-yellow" title="Hyperbolic emotional term">
                    widespread catastrophic panic
                  </span>
                  <span className="margin-note-num">[1]</span>{' '}
                  across several regional infrastructure departments. While agency liaisons 
                  insist protocols remain standard, critics claim this marks{' '}
                  <span className="proof-underline-red" title="Uncorroborated catastrophic assertion">
                    an irreversible betrayal of public trust
                  </span>
                  <span className="margin-note-num">[2]</span>.
                </p>

                <p style={{ marginBottom: '16px' }}>
                  According to{' '}
                  <span className="proof-underline-red" title="Anonymous singular attribution">
                    unnamed senior officials speaking under strict confidentiality
                  </span>
                  <span className="margin-note-num">[3]</span>, 
                  the upcoming policy shift will mandate immediate structural overhauls 
                  before independent validation can conclude.
                </p>
              </div>

              {/* Marginalia Column: Editorial Proof Notes */}
              <div style={{
                borderLeft: '1px dashed var(--paper-border-strong)',
                paddingLeft: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--ink-secondary)',
                lineHeight: 1.45,
              }}>
                <div>
                  <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>[1] LOADED TERM</span>
                  <p style={{ color: 'var(--ink-tertiary)', marginTop: '2px' }}>
                    Superlative compound intended to trigger existential anxiety without baseline metric.
                  </p>
                </div>

                <div>
                  <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>[2] MORAL PRESSURE</span>
                  <p style={{ color: 'var(--ink-tertiary)', marginTop: '2px' }}>
                    Value-laden phrasing substituting emotional indictment for factual evidence.
                  </p>
                </div>

                <div>
                  <span style={{ color: 'var(--ink-primary)', fontWeight: 700 }}>[3] WEAK ATTRIBUTION</span>
                  <p style={{ color: 'var(--ink-tertiary)', marginTop: '2px' }}>
                    Zero named institutions or cross-verifiable documents cited in primary assertion.
                  </p>
                </div>
              </div>

            </div>

            {/* Proof Sheet Footer Ledger */}
            <div style={{
              borderTop: 'var(--rule-hairline)',
              marginTop: '24px',
              paddingTop: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--ink-muted)',
            }}>
              <div>
                <span>AUDITOR NOTE: </span>
                <span style={{ color: 'var(--ink-secondary)' }}>
                  Elevated sensationalism ratio (0.71) exceeds newsroom acceptable tolerance (0.25).
                </span>
              </div>
              <div style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                § VERDICT: UNCORROBORATED
              </div>
            </div>

          </div>

          {/* Slight paper offset card behind to create a physical document stack feeling */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-8px',
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--paper-muted)',
            border: '1px solid var(--paper-border)',
            zIndex: -1,
          }}></div>

        </div>

      </div>
    </section>
  );
}
