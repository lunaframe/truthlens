import React, { useState, useMemo, useRef, useEffect } from 'react';

export default function InteractiveTextHighlighter({ fullText = '', highlights = [] }) {
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'flags', 'trust'
  const containerRef = useRef(null);

  // Close active note on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveHighlight(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveHighlight(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter highlights
  const activeHighlightsList = useMemo(() => {
    if (filterMode === 'flags') {
      return highlights.filter(h => h.type === 'danger' || h.type === 'warning');
    }
    if (filterMode === 'trust') {
      return highlights.filter(h => h.type === 'positive');
    }
    return highlights;
  }, [highlights, filterMode]);

  // Construct text chunks with proofreader highlighted spans
  const renderedContent = useMemo(() => {
    if (!fullText) return null;
    if (!activeHighlightsList || activeHighlightsList.length === 0) {
      return <span>{fullText}</span>;
    }

    const elements = [];
    let currentIndex = 0;

    activeHighlightsList.forEach((h, idx) => {
      // Unhighlighted text before this span
      if (h.startIndex > currentIndex) {
        elements.push(
          <span key={`text-${currentIndex}`}>
            {fullText.substring(currentIndex, h.startIndex)}
          </span>
        );
      }

      // Highlighted span
      const isSelected = activeHighlight && activeHighlight.startIndex === h.startIndex;
      let spanClass = 'proof-highlight-yellow';
      if (h.type === 'danger') {
        spanClass = 'proof-underline-red';
      } else if (h.type === 'positive') {
        spanClass = 'proof-anchor-green';
      }

      elements.push(
        <span
          key={`highlight-${idx}-${h.startIndex}`}
          className={spanClass}
          onClick={(e) => {
            e.stopPropagation();
            setActiveHighlight(isSelected ? null : h);
          }}
          style={{
            position: 'relative',
            outline: isSelected ? '1px dashed var(--ink-primary)' : 'none',
            outlineOffset: '2px',
          }}
        >
          {fullText.substring(h.startIndex, h.endIndex)}
          <span className="margin-note-num">[{idx + 1}]</span>
        </span>
      );

      currentIndex = Math.max(currentIndex, h.endIndex);
    });

    // Trailing text
    if (currentIndex < fullText.length) {
      elements.push(
        <span key={`text-tail`}>
          {fullText.substring(currentIndex)}
        </span>
      );
    }

    return elements;
  }, [fullText, activeHighlightsList, activeHighlight]);

  const flagsCount = highlights.filter(h => h.type === 'danger' || h.type === 'warning').length;
  const trustCount = highlights.filter(h => h.type === 'positive').length;

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: 'var(--paper-card)',
        border: '1px solid var(--paper-border-strong)',
        padding: '36px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header & Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: 'var(--rule-strong)',
        paddingBottom: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
            EDITORIAL PROOFREADER GALLEY · INLINE ANNOTATIONS
          </span>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontWeight: 600,
            color: 'var(--ink-primary)',
            marginTop: '2px',
          }}>
            Annotated Manuscript
          </h3>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '5px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 500,
              border: '1px solid var(--paper-border-strong)',
              background: filterMode === 'all' ? 'var(--ink-primary)' : 'transparent',
              color: filterMode === 'all' ? 'var(--paper-card)' : 'var(--ink-secondary)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            All Annotations ({highlights.length})
          </button>

          <button
            onClick={() => setFilterMode('flags')}
            style={{
              padding: '5px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 500,
              border: '1px solid var(--paper-border-strong)',
              background: filterMode === 'flags' ? 'var(--accent-red)' : 'transparent',
              color: filterMode === 'flags' ? '#ffffff' : 'var(--ink-secondary)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            Red Flags ({flagsCount})
          </button>

          <button
            onClick={() => setFilterMode('trust')}
            style={{
              padding: '5px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 500,
              border: '1px solid var(--paper-border-strong)',
              background: filterMode === 'trust' ? 'var(--ink-verified)' : 'transparent',
              color: filterMode === 'trust' ? '#ffffff' : 'var(--ink-secondary)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            Verified Anchors ({trustCount})
          </button>
        </div>
      </div>

      {/* Main Layout: Text Proof + Proofreader Marginalia Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeHighlight ? '1fr 340px' : '1fr',
        gap: '32px',
        alignItems: 'start',
      }}>
        
        {/* Manuscript Paper Block */}
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.14rem',
          lineHeight: 1.8,
          color: 'var(--ink-primary)',
          backgroundColor: 'var(--paper-base)',
          border: '1px solid var(--paper-border)',
          padding: '28px 32px',
          borderRadius: 'var(--radius-xs)',
        }}>
          {renderedContent}
        </div>

        {/* Selected Annotation Marginalia Callout */}
        {activeHighlight && (
          <div style={{
            backgroundColor: 'var(--paper-card)',
            border: `2px solid ${activeHighlight.type === 'positive' ? 'var(--ink-verified)' : 'var(--accent-red)'}`,
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            position: 'sticky',
            top: '80px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              borderBottom: 'var(--rule-hairline)',
              paddingBottom: '10px',
            }}>
              <span className="small-caps" style={{
                color: activeHighlight.type === 'positive' ? 'var(--ink-verified)' : 'var(--accent-red)',
                fontWeight: 700,
              }}>
                {activeHighlight.type === 'positive' ? 'VERIFIED ANCHOR' : 'SUSPICIOUS LINGUISTIC PATTERN'}
              </span>

              <button
                onClick={() => setActiveHighlight(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--ink-muted)',
                  cursor: 'pointer',
                }}
              >
                [close]
              </button>
            </div>

            <div style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: 'var(--ink-primary)',
              marginBottom: '12px',
              lineHeight: 1.4,
              borderLeft: '2px solid var(--ink-primary)',
              paddingLeft: '10px',
            }}>
              "{activeHighlight.text || activeHighlight.phrase}"
            </div>

            <p style={{
              fontSize: '0.84rem',
              color: 'var(--ink-secondary)',
              lineHeight: 1.55,
              marginBottom: '16px',
            }}>
              {activeHighlight.explanation}
            </p>

            {activeHighlight.suggestion && (
              <div style={{
                backgroundColor: 'var(--paper-muted)',
                padding: '12px',
                borderLeft: '2px solid var(--ink-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: 'var(--ink-secondary)',
                lineHeight: 1.45,
              }}>
                <span style={{ fontWeight: 600, color: 'var(--ink-primary)', display: 'block', marginBottom: '2px' }}>
                  EDITORIAL REMEDY:
                </span>
                {activeHighlight.suggestion}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Proof Legend */}
      <div style={{
        marginTop: '24px',
        borderTop: 'var(--rule-hairline)',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.74rem',
        color: 'var(--ink-tertiary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="proof-highlight-yellow" style={{ padding: '0 6px' }}>yellow marker</span>
          <span>Emotional / loaded intensifier</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="proof-underline-red">red underline</span>
          <span>Uncorroborated / anonymous attribution</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="proof-anchor-green" style={{ padding: '0 6px' }}>green anchor</span>
          <span>Institutional / empirical citation</span>
        </div>
      </div>

    </div>
  );
}
