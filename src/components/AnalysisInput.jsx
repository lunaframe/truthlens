import React, { useState } from 'react';
import { SAMPLE_PRESETS } from '../services/nlpEngine';

export default function AnalysisInput({
  text = '',
  onChangeText,
  onAnalyze,
  isAnalyzing = false,
  error = null,
  onClearError
}) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);

  // Word count & character count
  const words = (text.trim().match(/\b\S+\b/g) || []).length;
  const chars = text.length;
  const estimatedReadMin = (words / 200).toFixed(1);

  const handleApplyPreset = (preset) => {
    onChangeText(preset.text);
    if (onClearError) onClearError();
  };

  const handleSimulateUrlFetch = () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);

    setTimeout(() => {
      setUrlLoading(false);
      if (urlInput.toLowerCase().includes('reuters') || urlInput.toLowerCase().includes('apnews') || urlInput.toLowerCase().includes('nasa')) {
        onChangeText(SAMPLE_PRESETS[1].text);
      } else {
        onChangeText(SAMPLE_PRESETS[0].text);
      }
      setActiveTab('text');
    }, 500);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div id="analyzer-section" style={{
      backgroundColor: 'var(--paper-card)',
      border: '1px solid var(--paper-border-strong)',
      padding: '32px',
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      marginBottom: '48px',
    }}>
      
      {/* Editorial Intake Header */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: 'var(--rule-hairline)',
        paddingBottom: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
            DISPATCH INTAKE DESK · MANUSCRIPT AUDITOR
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontWeight: 600,
            color: 'var(--ink-primary)',
            marginTop: '2px',
          }}>
            Submit text for linguistic & credibility decomposition
          </h2>
        </div>

        {/* Mode Toggle: Text vs URL */}
        <div style={{ display: 'flex', border: '1px solid var(--paper-border-strong)' }}>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'text' ? 'var(--ink-primary)' : 'var(--paper-card)',
              color: activeTab === 'text' ? 'var(--paper-card)' : 'var(--ink-secondary)',
              cursor: 'pointer',
              transition: 'all 120ms',
            }}
          >
            Direct Text Input
          </button>
          <button
            onClick={() => setActiveTab('url')}
            style={{
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              borderLeft: '1px solid var(--paper-border-strong)',
              background: activeTab === 'url' ? 'var(--ink-primary)' : 'var(--paper-card)',
              color: activeTab === 'url' ? 'var(--paper-card)' : 'var(--ink-secondary)',
              cursor: 'pointer',
              transition: 'all 120ms',
            }}
          >
            URL Syndication
          </button>
        </div>
      </div>

      {/* Preset Reference Files */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        <span className="small-caps" style={{ marginRight: '6px', fontSize: '0.7rem' }}>
          LOAD REFERENCE SPECIMEN:
        </span>
        {SAMPLE_PRESETS.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => handleApplyPreset(preset)}
            style={{
              background: 'var(--paper-muted)',
              border: '1px solid var(--paper-border)',
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              borderRadius: 'var(--radius-xs)',
              transition: 'all 120ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--ink-primary)';
              e.currentTarget.style.color = 'var(--ink-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--paper-border)';
              e.currentTarget.style.color = 'var(--ink-secondary)';
            }}
          >
            #{idx + 1} {(preset.title || preset.label || 'Specimen').split('/')[0].split('&')[0].trim()}
          </button>
        ))}
      </div>

      {/* Input Area: Direct Text vs URL */}
      {activeTab === 'text' ? (
        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={(e) => {
              onChangeText(e.target.value);
              if (error && onClearError) onClearError();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste news story, syndicated wire dispatch, or social assertion here for editorial decomposition..."
            rows={7}
            style={{
              width: '100%',
              backgroundColor: 'var(--paper-base)',
              border: '1px solid var(--paper-border-strong)',
              borderRadius: 'var(--radius-xs)',
              padding: '16px 18px',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              lineHeight: 1.65,
              color: 'var(--ink-primary)',
              resize: 'vertical',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(22, 20, 15, 0.05)',
            }}
          />
        </div>
      ) : (
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--paper-base)',
          border: '1px solid var(--paper-border-strong)',
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
            ARTICLE OR WIRE DISPATCH URL
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example-news-outlet.org/story/investigation-report"
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid var(--paper-border-strong)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                backgroundColor: 'var(--paper-card)',
                color: 'var(--ink-primary)',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSimulateUrlFetch}
              disabled={urlLoading || !urlInput.trim()}
              className="btn-ink"
            >
              {urlLoading ? 'Fetching wire...' : 'Ingest article →'}
            </button>
          </div>
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
            Simulates DOM extraction, stripping ad scripts and boilerplate navigation.
          </span>
        </div>
      )}

      {/* Error Note */}
      {error && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          backgroundColor: 'var(--accent-red-bg)',
          borderLeft: '3px solid var(--accent-red)',
          color: 'var(--accent-red)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
        }}>
          AUDIT HALTED: {error}
        </div>
      )}

      {/* Bottom Ledger Bar */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderTop: 'var(--rule-hairline)',
        paddingTop: '16px',
      }}>
        {/* Statistics Metric */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.76rem',
          color: 'var(--ink-tertiary)',
          display: 'flex',
          gap: '16px',
        }}>
          <span>{words} words</span>
          <span>·</span>
          <span>{chars} characters</span>
          <span>·</span>
          <span>~{estimatedReadMin} min read</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {text.length > 0 && (
            <button
              onClick={() => onChangeText('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear draft
            </button>
          )}

          <button
            onClick={() => onAnalyze()}
            disabled={isAnalyzing || !text.trim()}
            className="btn-ink"
            style={{ padding: '12px 24px', fontSize: '0.92rem' }}
          >
            <span>{isAnalyzing ? 'Running linguistic audit...' : 'Decompose credibility'}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

    </div>
  );
}
