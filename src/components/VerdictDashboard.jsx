import React, { useState } from 'react';
import ConfidenceMeter from './ConfidenceMeter';
import CredibilityBreakdown from './CredibilityBreakdown';

export default function VerdictDashboard({
  result,
  onOpenShareCard,
  onOpenCompareWithCurrent,
}) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const {
    verdict,
    verdictType,
    confidenceScore,
    credibilityScore,
    subScores,
    summary,
    formattedTime,
    wordCount,
    meta,
  } = result;

  const handleCopyReport = () => {
    const reportText = `[TruthLens Editorial Case Memo]
Verdict: ${verdict} (Certainty: ${confidenceScore}%)
Credibility Calibre: ${credibilityScore}/100
Emotional Pressure: ${subScores.emotionalIntensity}%
Attribution Rigor: ${subScores.sourceReliability}%
Factual Specificity: ${subScores.factualDensity}%
Sensationalism Score: ${subScores.clickbaitScore}%
Examiner Summary: ${summary}
Audit Timestamp: ${formattedTime}`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  let stampClass = 'stamp-uncertain';
  let stampText = 'VERDICT: INCONCLUSIVE SOURCING';

  if (verdictType === 'real') {
    stampClass = 'stamp-real';
    stampText = 'VERDICT: CORROBORATED & FACTUAL';
  } else if (verdictType === 'fake') {
    stampClass = 'stamp-fake';
    stampText = 'VERDICT: SEVERE MANIPULATION DEFICIT';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Primary Case File Memo Card */}
      <div style={{
        backgroundColor: 'var(--paper-card)',
        border: '1px solid var(--paper-border-strong)',
        padding: '36px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
      }}>
        
        {/* Memo Masthead Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: 'var(--rule-hairline)',
          paddingBottom: '20px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
              FORENSIC CASE MEMO · DISPATCH AUDIT #{meta?.readingGrade ? meta.readingGrade.replace(/\D/g, '') + '401' : '8401'}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: 'var(--ink-muted)',
              marginTop: '4px',
            }}>
              <span>FILED: {formattedTime}</span>
              <span>·</span>
              <span>{wordCount} WORDS EXAMINED</span>
              <span>·</span>
              <span>READING GRADE: {meta?.readingGrade || 'General (8.2)'}</span>
            </div>
          </div>

          {/* Slanted Rubber Stamp */}
          <div className={`rubber-stamp ${stampClass}`}>
            {stampText}
          </div>
        </div>

        {/* Narrative & Gauge Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '36px',
          alignItems: 'center',
        }}>
          {/* Left Column: Headline and Forensic Narrative */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 2.4vw, 1.95rem)',
              fontWeight: 500,
              lineHeight: 1.22,
              letterSpacing: '-0.025em',
              color: 'var(--ink-primary)',
              marginBottom: '16px',
            }}>
              {verdictType === 'real' && 'High journalistic consistency and institutional attribution verified.'}
              {verdictType === 'fake' && 'Severe credibility deficit and emotional manipulation signatures isolated.'}
              {verdictType === 'uncertain' && 'Inconclusive attribution profile: primary cross-corroboration required.'}
            </h2>

            <p style={{
              fontSize: '0.98rem',
              lineHeight: 1.65,
              color: 'var(--ink-secondary)',
              marginBottom: '24px',
              fontFamily: 'var(--font-body)',
            }}>
              {summary}
            </p>

            {/* Imperfect Specific Metric Pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: 'var(--ink-secondary)',
              marginBottom: '28px',
            }}>
              <span style={{
                padding: '4px 10px',
                backgroundColor: 'var(--paper-muted)',
                border: '1px solid var(--paper-border)',
              }}>
                § {meta?.flagsFound ?? 0} loaded terms isolated
              </span>
              <span style={{
                padding: '4px 10px',
                backgroundColor: 'var(--paper-muted)',
                border: '1px solid var(--paper-border)',
              }}>
                § {meta?.citationsFound ?? 0} institutional citations
              </span>
              <span style={{
                padding: '4px 10px',
                backgroundColor: 'var(--paper-muted)',
                border: '1px solid var(--paper-border)',
              }}>
                § {meta?.capsWordsCount ?? 0} emphatic uppercase tokens
              </span>
            </div>

            {/* Actions: Clean Editorial Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handleCopyReport}
                className="btn-outline"
                style={{ fontSize: '0.82rem' }}
              >
                {copied ? '✓ Copied to clipboard' : 'Copy editorial brief'}
              </button>

              <button
                onClick={onOpenCompareWithCurrent}
                className="btn-outline"
                style={{ fontSize: '0.82rem' }}
              >
                Compare with secondary wire
              </button>

              <button
                onClick={onOpenShareCard}
                className="btn-ink"
                style={{ fontSize: '0.82rem' }}
              >
                <span>Export proof card</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Precision Editorial Dial */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: 'var(--rule-hairline)',
            paddingLeft: '24px',
          }}>
            <span className="small-caps" style={{ marginBottom: '16px' }}>
              CALIBRATED CREDIBILITY RATING
            </span>
            <ConfidenceMeter
              score={credibilityScore}
              verdictType={verdictType}
              size={180}
            />
          </div>
        </div>

      </div>

      {/* 4-Vector Forensic Credibility Ledger */}
      <CredibilityBreakdown subScores={subScores} />

    </div>
  );
}
