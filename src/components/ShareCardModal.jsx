import React, { useState } from 'react';

export default function ShareCardModal({ isOpen, onClose, result }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const isReal = result.verdictType === 'real';
  const stampClass = isReal ? 'stamp-real' : result.verdictType === 'fake' ? 'stamp-fake' : 'stamp-uncertain';
  const stampText = isReal ? 'VERIFIED CORROBORATION' : result.verdictType === 'fake' ? 'MANIPULATION SIGNATURES' : 'INCONCLUSIVE SOURCING';

  const handleCopyCard = () => {
    const textToCopy = `TruthLens Editorial Audit:
Specimen: "${result.inputSnippet}"
Verdict: ${result.verdict} (Credibility Rating: ${result.credibilityScore}/100)
Examiner Reference: #${result.id}
Audit Timestamp: ${result.formattedTime}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleDownloadCard = () => {
    // Generate clean editorial newspaper clipping SVG
    const svgCard = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="380" viewBox="0 0 640 380">
      <!-- Paper Background -->
      <rect width="640" height="380" fill="#FAF8F5" stroke="#16140F" stroke-width="2"/>
      <rect x="12" y="12" width="616" height="356" fill="none" stroke="#DCD7CC" stroke-width="1"/>
      
      <!-- Masthead -->
      <text x="36" y="52" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#16140F">TruthLens</text>
      <text x="148" y="47" font-family="monospace" font-size="10" fill="#787267">EDITORIAL AUDIT DISPATCH · REF #${result.id}</text>
      <line x1="36" y1="64" x2="604" y2="64" stroke="#16140F" stroke-width="1.5"/>
      <line x1="36" y1="68" x2="604" y2="68" stroke="#16140F" stroke-width="0.5"/>
      
      <!-- Specimen Excerpt -->
      <text x="36" y="102" font-family="monospace" font-size="10" fill="#787267">EXAMINED SPECIMEN EXCERPT:</text>
      <text x="36" y="132" font-family="Georgia, serif" font-style="italic" font-size="16" fill="#16140F">"${result.inputSnippet.replace(/"/g, "'").substring(0, 75)}..."</text>
      
      <!-- Stamped Verdict Box -->
      <rect x="36" y="180" width="340" height="84" fill="#F4F1EA" stroke="#16140F" stroke-width="1.5"/>
      <text x="52" y="212" font-family="monospace" font-size="11" font-weight="bold" fill="#48433A">OFFICIAL EDITORIAL VERDICT:</text>
      <text x="52" y="244" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#16140F">${stampText}</text>
      
      <!-- Rating Ledger -->
      <rect x="400" y="180" width="204" height="84" fill="#F4F1EA" stroke="#16140F" stroke-width="1.5"/>
      <text x="416" y="210" font-family="monospace" font-size="10" fill="#787267">CREDIBILITY RATING</text>
      <text x="416" y="246" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#16140F">${result.credibilityScore} <tspan font-family="monospace" font-size="13" font-weight="normal" fill="#787267">/ 100</tspan></text>
      
      <!-- Sub-scores -->
      <text x="36" y="306" font-family="monospace" font-size="11" fill="#48433A">Outrage: ${result.subScores.emotionalIntensity}% · Attribution: ${result.subScores.sourceReliability}% · Specificity: ${result.subScores.factualDensity}%</text>
      
      <!-- Colophon -->
      <line x1="36" y1="326" x2="604" y2="326" stroke="#DCD7CC" stroke-width="1"/>
      <text x="36" y="348" font-family="monospace" font-size="10" fill="#9E988D">Certified by TruthLens Forensics Desk · ${result.formattedTime}</text>
    </svg>`;

    const blob = new Blob([svgCard], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TruthLens-Proof-${result.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="editorial-modal-overlay" onClick={onClose}>
      <div
        className="editorial-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: 'var(--rule-strong)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}>
          <div>
            <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
              DISPATCH PROOF CARD · REPORTERS CLIPPING
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              marginTop: '2px',
            }}>
              Exportable Audit Clipping
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            [Close]
          </button>
        </div>

        {/* Body & Physical Proof Sheet */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card Preview */}
          <div style={{
            backgroundColor: 'var(--paper-base)',
            border: '2px solid var(--ink-primary)',
            padding: '24px',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              borderBottom: 'var(--rule-hairline)',
              paddingBottom: '12px',
              marginBottom: '16px',
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>
                TruthLens<span style={{ color: 'var(--accent-red)' }}>.</span>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-muted)' }}>
                REF #{result.id} · {result.formattedTime}
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              lineHeight: 1.5,
              color: 'var(--ink-primary)',
              marginBottom: '20px',
            }}>
              "{result.inputSnippet}"
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: 'var(--rule-hairline)',
              paddingTop: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div className={`rubber-stamp ${stampClass}`} style={{ fontSize: '0.75rem' }}>
                {stampText}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-primary)' }}>
                RATING: <strong>{result.credibilityScore}/100</strong>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <button
              onClick={handleCopyCard}
              className="btn-outline"
            >
              {copied ? '✓ Copied plain memo' : 'Copy plain-text summary'}
            </button>

            <button
              onClick={handleDownloadCard}
              className="btn-ink"
            >
              <span>Download SVG clipping</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
