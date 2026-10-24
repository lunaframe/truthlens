import React, { useState, Component } from 'react';
import HeroSection from './components/HeroSection';
import AnalysisInput from './components/AnalysisInput';
import ScanningLoader from './components/ScanningLoader';
import VerdictDashboard from './components/VerdictDashboard';
import InteractiveTextHighlighter from './components/InteractiveTextHighlighter';
import ExplainabilityChart from './components/ExplainabilityChart';
import HistorySidebar from './components/HistorySidebar';
import CompareSourcesModal from './components/CompareSourcesModal';
import ShareCardModal from './components/ShareCardModal';
import { analyzeArticle, SAMPLE_PRESETS } from './services/nlpEngine';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px',
          border: '1px solid var(--accent-red)',
          backgroundColor: 'var(--paper-card)',
          margin: '20px 0',
        }}>
          <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-red)', marginBottom: '8px' }}>
            Section Rendering Notice
          </h4>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>
            {String(this.state.error?.message || 'Component data mismatch')}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [inputText, setInputText] = useState(SAMPLE_PRESETS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);

  // Initial result computed immediately for seamless first load
  const [currentResult, setCurrentResult] = useState(() => {
    try {
      return analyzeArticle(SAMPLE_PRESETS[0].text);
    } catch {
      return null;
    }
  });

  // History state stored in localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('truthlens_history');
      if (saved) return JSON.parse(saved);
      const initial = analyzeArticle(SAMPLE_PRESETS[0].text);
      localStorage.setItem('truthlens_history', JSON.stringify([initial]));
      return [initial];
    } catch {
      return [];
    }
  });

  const handleRunAnalysis = (textToScan = inputText) => {
    setError(null);
    const targetText = textToScan || inputText;

    if (!targetText || targetText.trim().length === 0) {
      setError('Please provide text or select a specimen to analyze.');
      return;
    }

    setIsAnalyzing(true);

    // Multi-stage verification delay for realistic editorial audit UX
    setTimeout(() => {
      try {
        const result = analyzeArticle(targetText);
        setCurrentResult(result);
        setIsAnalyzing(false);

        // Prepend to history
        setHistory((prev) => {
          const updated = [result, ...prev.filter(h => h.inputSnippet !== result.inputSnippet)].slice(0, 30);
          localStorage.setItem('truthlens_history', JSON.stringify(updated));
          return updated;
        });

        // Smoothly scroll down to results
        setTimeout(() => {
          const resultsElem = document.getElementById('results-dashboard');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);

      } catch (err) {
        setIsAnalyzing(false);
        setError(err.message || 'An unexpected error occurred during linguistic extraction.');
      }
    }, 1300);
  };

  const handleSelectHistoryItem = (item) => {
    setInputText(item.fullText);
    setCurrentResult(item);
    setError(null);
    setTimeout(() => {
      const resultsElem = document.getElementById('results-dashboard');
      if (resultsElem) {
        resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('truthlens_history');
  };

  const scrollToAnalyzer = () => {
    const elem = document.getElementById('analyzer-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToExplainability = () => {
    const elem = document.getElementById('results-dashboard');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper-base)', position: 'relative' }}>
      
      {/* Top Editorial Masthead Navigation */}
      <header className="masthead-nav">
        <div className="editorial-container masthead-inner">
          
          {/* Wordmark Only - No Icon, No Glow */}
          <div className="wordmark" onClick={scrollToAnalyzer}>
            <span>TruthLens</span>
            <span className="wordmark-period">.</span>
          </div>

          {/* Nav Actions: 3 Text Links, 1 Solid Ink Button */}
          <nav className="nav-links-row">
            <button
              onClick={scrollToExplainability}
              className="nav-text-link"
            >
              Methodology & Attribution
            </button>

            <button
              onClick={() => setIsCompareOpen(true)}
              className="nav-text-link"
            >
              Compare Sources
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="nav-text-link"
            >
              Archive ({history.length})
            </button>

            <button
              onClick={scrollToAnalyzer}
              className="btn-ink"
            >
              <span>Audit a story</span>
              <span aria-hidden="true">→</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="editorial-container">
        
        {/* Asymmetric Hero Section */}
        <HeroSection
          onScrollToAnalyzer={scrollToAnalyzer}
          onOpenCompare={() => setIsCompareOpen(true)}
        />

        {/* Core Input Analyzer Desk */}
        <div style={{ marginTop: '48px' }}>
          <ErrorBoundary>
            <AnalysisInput
              text={inputText}
              onChangeText={setInputText}
              onAnalyze={() => handleRunAnalysis(inputText)}
              isAnalyzing={isAnalyzing}
              error={error}
              onClearError={() => setError(null)}
            />
          </ErrorBoundary>
        </div>

        {/* Fact-Check Audit In Progress State */}
        {isAnalyzing && <ScanningLoader />}

        {/* Analysis Results View */}
        {!isAnalyzing && currentResult && (
          <ErrorBoundary>
            <div id="results-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginBottom: '40px' }}>
              
              {/* Top Verdict Case File & Precision Dial Dashboard */}
              <VerdictDashboard
                result={currentResult}
                onOpenShareCard={() => setIsShareCardOpen(true)}
                onOpenCompareWithCurrent={() => setIsCompareOpen(true)}
              />

              {/* Proofreader Galley: Interactive Text Highlighter */}
              <InteractiveTextHighlighter
                fullText={currentResult.fullText}
                highlights={currentResult.highlights}
              />

              {/* SHAP Statistical Attribution Waterfall */}
              <ExplainabilityChart
                featureAttributions={currentResult.featureAttributions}
              />

            </div>
          </ErrorBoundary>
        )}

      </main>

      {/* Editorial Colophon / Masthead Footer */}
      <footer className="editorial-footer">
        <div className="editorial-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '36px',
            marginBottom: '36px',
          }}>
            <div>
              <div className="wordmark" style={{ marginBottom: '8px' }}>
                <span>TruthLens</span>
                <span className="wordmark-period">.</span>
              </div>
              <p style={{
                fontSize: '0.86rem',
                color: 'var(--ink-secondary)',
                lineHeight: 1.55,
                maxWidth: '340px',
              }}>
                An investigative newsroom fact-checking desk and forensic stylometric auditor. Decomposes emotional pressure, loaded syntax, and sourcing density.
              </p>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: 'var(--ink-tertiary)',
              lineHeight: 1.6,
            }}>
              <span className="small-caps" style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-primary)' }}>
                PUBLICATION & METROLOGY
              </span>
              <div>Series: Investigative Linguistic Forensics</div>
              <div>Decomposition: Additive Feature Attributions (SHAP)</div>
              <div>Stylometry Lexicons: NRC-VAD · AFINN · Syllabic Readability</div>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: 'var(--ink-tertiary)',
              lineHeight: 1.6,
            }}>
              <span className="small-caps" style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-primary)' }}>
                ARCHIVE COLOPHON
              </span>
              <div>Volume IV · Issue 10 · 2026 Edition</div>
              <div>Catalog Ref: #TL-DESK-2026-X</div>
              <div>Typeset in Newsreader, Fraunces & JetBrains Mono</div>
            </div>
          </div>

          <div style={{
            borderTop: 'var(--rule-hairline)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--ink-muted)',
          }}>
            <span>© 2026 TruthLens Forensics Bureau · All editorial audits generated locally.</span>
            <span>NO COOKIES · NO SURVEILLANCE TELEMETRY</span>
          </div>
        </div>
      </footer>

      {/* Slide-out Archive Filing Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Dual Wire Sourcing Comparator Dossier Modal */}
      <CompareSourcesModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialArticleText={currentResult ? currentResult.fullText : inputText}
      />

      {/* Shareable Editorial Dispatch Proof Clipping Modal */}
      <ShareCardModal
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
        result={currentResult}
      />

    </div>
  );
}
