import React from 'react';

export default function HistorySidebar({
  isOpen,
  onClose,
  history = [],
  onSelectHistoryItem,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(22, 20, 15, 0.65)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--paper-card)',
          borderLeft: '1px solid var(--paper-border-strong)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: 'var(--rule-strong)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}>
          <div>
            <span className="small-caps" style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
              FILING DESK · HISTORICAL AUDIT LOG
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              marginTop: '2px',
            }}>
              Archived Dispatches ({history.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            [Close Archive]
          </button>
        </div>

        {/* Drawer Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {history.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
            }}>
              No articles audited in this session yet.
            </div>
          ) : (
            history.map((item) => {
              const isReal = item.verdictType === 'real';
              const stampClass = isReal ? 'stamp-real' : item.verdictType === 'fake' ? 'stamp-fake' : 'stamp-uncertain';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  style={{
                    backgroundColor: 'var(--paper-base)',
                    border: '1px solid var(--paper-border)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'border-color 120ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ink-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--paper-border)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--ink-muted)',
                    }}>
                      {item.formattedTime}
                    </span>

                    <span className={`rubber-stamp ${stampClass}`} style={{ fontSize: '0.64rem', padding: '2px 6px' }}>
                      {item.credibilityScore}/100 · {item.verdict}
                    </span>
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.98rem',
                    lineHeight: 1.45,
                    color: 'var(--ink-primary)',
                    marginBottom: '8px',
                  }}>
                    "{item.inputSnippet}"
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--ink-tertiary)',
                  }}>
                    <span>Flags: {item.meta?.flagsFound ?? 0}</span>
                    <span style={{ textDecoration: 'underline' }}>Recall manuscript →</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div style={{
            padding: '16px 24px',
            borderTop: 'var(--rule-hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--paper-muted)',
          }}>
            <button
              onClick={onClearHistory}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                color: 'var(--accent-red)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Purge session archive
            </button>

            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
              STORED IN LOCAL BROWSER REPOSITORY
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
