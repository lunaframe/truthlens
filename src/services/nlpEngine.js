/**
 * TruthLens NLP & Credibility Intelligence Engine
 * 
 * Provides:
 * 1. Stylometric & Linguistic analysis (Sensationalism, Emotional Outrage, Hyperbole)
 * 2. Source Attribution & Citation Density analysis
 * 3. Quantitative & Factual Density metrics
 * 4. Multi-dimensional Credibility & Clickbait scoring
 * 5. Span-level forensic highlighter with contextual diagnostics
 * 6. SHAP / LIME-style feature importance attributions
 */

// Lexicon of sensationalist, alarmist & hyperbolic terms
const SENSATIONAL_PATTERNS = [
  { regex: /\b(shocking|bombshell|miracle cure|wake up|sheeple|unbelievable|mind-blowing)\b/gi, category: 'sensationalism', weight: 8.5, label: 'Sensationalist Superlative', explanation: 'High-frequency sensationalist trigger word commonly used in disinformation to provoke reflexive clicks rather than objective comprehension.' },
  { regex: /\b(what they don'?t want you to know|secret they'?re hiding|exposed once and for all|cover-?up)\b/gi, category: 'conspiracy', weight: 9.0, label: 'Conspiratorial Framing', explanation: 'Imputes hidden malevolent intent without substantiating verifiable documents or formal investigations.' },
  { regex: /\b(mainstream media is silent|msm won'?t tell you|silenced by big \w+|banned everywhere)\b/gi, category: 'anti_institutional', weight: 8.0, label: 'Manufactured Censorship Claim', explanation: 'Classic disinformation heuristic claiming censorship to artificially inflate exclusivity and bypass peer verification.' },
  { regex: /\b(100% (proven|guaranteed|cured|effective)|absolute proof|undeniable fact)\b/gi, category: 'hyperbole', weight: 7.5, label: 'Absolutist Certainty', explanation: 'Scientific and journalistic investigations qualify probabilistic claims; absolutist certainty is a strong marker of deceptive discourse.' },
  { regex: /\b(destroying (america|the country|the world)|treason|bloodbath|pure evil|criminals in power)\b/gi, category: 'emotional_outrage', weight: 8.8, label: 'Inflammatory Outrage Language', explanation: 'Weaponized moral outrage intended to trigger intense emotional polarization rather than analytical scrutiny.' },
  { regex: /\b(panic spreads|terrifying truth|run for your lives|prepare for the worst)\b/gi, category: 'alarmism', weight: 7.8, label: 'Fear-Mongering Alarmism', explanation: 'Dramatized fear-mongering framing without actionable official civil defense or safety guidelines.' },
  { regex: /\b(this one trick|doctors are speechless|you won'?t believe what happens next|before it'?s taken down)\b/gi, category: 'clickbait', weight: 9.2, label: 'Deceptive Clickbait Lure', explanation: 'Syntactic curiosity-gap formula explicitly crafted for engagement farming and ad-arbitrage traffic.' },
];

// Anonymous / Vague attribution patterns
const VAGUE_ATTRIBUTIONS = [
  { regex: /\b(sources (say|claim|revealed|whisper)|insiders confirmed|many people are saying|people are waking up)\b/gi, category: 'unverified_claim', weight: 7.0, label: 'Vague Anonymous Authority', explanation: 'Cites undefined "sources" or generic "insiders" with zero verifiable credentials, institutional affiliation, or official record.' },
  { regex: /\b(experts (agree|warn|predict)|scientists are baffled|top doctors admit)\b/gi, category: 'unverified_claim', weight: 6.0, label: 'Unspecified Expert Consensus', explanation: 'Invokes generalized expertise without naming researchers, university affiliations, or publication venues.' },
  { regex: /\b(rumor has it|word on the street|unconfirmed reports suggest|leaked documents show)\b/gi, category: 'unverified_claim', weight: 6.5, label: 'Unsubstantiated Rumor Clause', explanation: 'Circulates speculative rumors under the veneer of breaking intelligence without secondary corroboration.' },
];

// Factual & Verifiable anchor patterns
const FACTUAL_ANCHORS = [
  { regex: /\b(according to (the )?(Associated Press|Reuters|AFP|BBC|NPR|Bloomberg|The Wall Street Journal|The New York Times|Nature|Science|The Lancet))\b/gi, category: 'verified_citation', weight: -7.5, label: 'Primary News Agency / Journal Citation', explanation: 'Direct attribution to recognized wire services or peer-reviewed scientific journals with stringent editorial oversight.' },
  { regex: /\b(published in (the journal|peer-reviewed|a new study)|peer-reviewed study conducted by)\b/gi, category: 'verified_citation', weight: -8.0, label: 'Peer-Reviewed Research', explanation: 'Explicit reference to formal peer-reviewed academic literature subjected to methodological evaluation.' },
  { regex: /\b(spokesperson for (the )?[A-Z][a-zA-Z\s]+ confirmed|in an official statement released (on|by))\b/gi, category: 'verified_citation', weight: -6.5, label: 'On-The-Record Attribution', explanation: 'Direct accountability anchor where a designated institutional representative speaks on public record.' },
  { regex: /\b(data (released|published|compiled) by (the )?(CDC|WHO|Bureau of Labor Statistics|Census Bureau|Federal Reserve|NASA|FDA|ECB))\b/gi, category: 'verified_citation', weight: -8.5, label: 'Official Institutional Registry', explanation: 'Reliance on standardized public datasets subjected to statutory disclosure and audit.' },
  { regex: /\b(\$\d+(\.\d+)? (billion|million|trillion)|\d+(\.\d+)?% increase|\d+(\.\d+)?% decrease|between \d{4} and \d{4})\b/gi, category: 'factual_anchor', weight: -4.5, label: 'Specific Quantitative Metric', explanation: 'Concrete numerical metrics and timeline boundaries that can be empirically verified against historical records.' },
];

// Word-level tokens for SHAP / LIME attribution scoring
const TOKEN_WEIGHTS = {
  // Push toward fake
  'bombshell': -2.8, 'shocking': -2.5, 'secret': -2.2, 'conspiracy': -2.9, 'hoax': -2.6,
  'coverup': -2.7, 'cover-up': -2.7, 'miracle': -3.1, 'sheeple': -3.5, 'elites': -2.4,
  'treason': -2.8, 'censored': -2.3, 'unbelievable': -2.0, 'mindblowing': -2.2,
  'speechless': -2.1, 'nightmare': -1.9, 'disgusting': -2.0, 'corrupt': -1.8,
  'wake': -1.5, 'insiders': -1.8, 'whisper': -1.6, 'banned': -2.4, 'scandal': -1.7,
  'terrifying': -2.2, 'plot': -2.0, 'outrageous': -2.3, 'cure': -1.6,
  
  // Push toward real
  'reuters': 3.2, 'spokesperson': 2.8, 'confirmed': 2.4, 'study': 2.5, 'researchers': 2.6,
  'published': 2.4, 'peer-reviewed': 3.4, 'journal': 2.5, 'data': 2.2, 'official': 2.1,
  'statement': 2.0, 'investigation': 1.8, 'university': 2.3, 'department': 1.9,
  'percent': 1.8, 'analysis': 2.1, 'institute': 2.2, 'bureau': 2.5, 'federal': 2.0,
  'associated': 2.4, 'press': 2.2, 'regulatory': 2.5, 'statistics': 2.6, 'measured': 2.1,
  'announced': 1.7, 'report': 1.6, 'laboratory': 2.3, 'conducted': 2.0
};

/**
 * Main analysis function
 */
export function analyzeArticle(rawText, sourceUrl = '') {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Please input text or paste an article to analyze.');
  }

  const text = rawText.trim();
  const wordList = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const wordCount = wordList.length;

  if (wordCount < 12) {
    throw new Error('Text is too short for reliable intelligence analysis. Please provide at least 15–20 words.');
  }

  // 1. Punctuation & Capitalization Diagnostics
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const allCapsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).filter(w => !['THE', 'AND', 'FOR', 'NOT', 'USA', 'NASA', 'NATO', 'WHO', 'CDC', 'FDA', 'FBI', 'DOJ'].includes(w));
  const capsRatio = Math.min(100, (allCapsWords.length / Math.max(1, wordCount)) * 350);
  const punctuationIntensity = Math.min(100, (exclamationCount * 12 + questionCount * 6));

  // 2. Scan for highlighted spans
  const highlights = [];
  let sensationalPenalty = 0;
  let vaguePenalty = 0;
  let factualCredits = 0;

  // Check Sensational Patterns
  for (const item of SENSATIONAL_PATTERNS) {
    const matches = [...text.matchAll(item.regex)];
    for (const match of matches) {
      sensationalPenalty += item.weight;
      highlights.push({
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        text: match[0],
        category: item.category,
        label: item.label,
        weight: item.weight,
        type: 'danger',
        severity: item.weight > 8 ? 'High Flag' : 'Moderate Flag',
        explanation: item.explanation,
        suggestion: 'Replace with verified neutral empirical observations without emotive amplification.'
      });
    }
  }

  // Check Vague Attributions
  for (const item of VAGUE_ATTRIBUTIONS) {
    const matches = [...text.matchAll(item.regex)];
    for (const match of matches) {
      vaguePenalty += item.weight;
      highlights.push({
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        text: match[0],
        category: item.category,
        label: item.label,
        weight: item.weight,
        type: 'warning',
        severity: 'Source Ambiguity',
        explanation: item.explanation,
        suggestion: 'Verify if primary source names, institutional roles, or published transcripts are specified.'
      });
    }
  }

  // Check Factual Anchors
  for (const item of FACTUAL_ANCHORS) {
    const matches = [...text.matchAll(item.regex)];
    for (const match of matches) {
      factualCredits += Math.abs(item.weight);
      highlights.push({
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        text: match[0],
        category: item.category,
        label: item.label,
        weight: item.weight,
        type: 'positive',
        severity: 'Trust Signal',
        explanation: item.explanation,
        suggestion: 'Standard institutional verification marker that supports empirical credibility.'
      });
    }
  }

  // Sort highlights chronologically by startIndex and avoid overlaps
  highlights.sort((a, b) => a.startIndex - b.startIndex);
  const cleanHighlights = [];
  let lastEnd = -1;
  for (const h of highlights) {
    if (h.startIndex >= lastEnd) {
      cleanHighlights.push(h);
      lastEnd = h.endIndex;
    }
  }

  // 3. Compute Sub-Scores (0 to 100)
  // A. Emotional Language Intensity (0 = completely neutral, 100 = radical hyperbole)
  const emotionalRaw = (sensationalPenalty * 3.8) + (capsRatio * 0.4) + (punctuationIntensity * 0.35);
  const emotionalIntensity = Math.min(98, Math.max(8, Math.round(emotionalRaw)));

  // B. Source Reliability Signals (0 = zero attribution, 100 = heavily verified primary citations)
  let sourceBase = 52 + (factualCredits * 3.2) - (vaguePenalty * 4.5);
  if (cleanHighlights.filter(h => h.type === 'positive').length > 1) sourceBase += 15;
  if (cleanHighlights.filter(h => h.category === 'conspiracy').length > 0) sourceBase -= 25;
  const sourceReliability = Math.min(96, Math.max(12, Math.round(sourceBase)));

  // C. Factual Density (presence of numbers, metrics, dates, entities)
  const numbersCount = (text.match(/\b\d+(\.\d+)?%?|\$\d+/g) || []).length;
  const factualRaw = (numbersCount * 6.5) + (factualCredits * 4.2) + (wordCount > 120 ? 12 : 5);
  const factualDensity = Math.min(97, Math.max(14, Math.round(factualRaw)));

  // D. Clickbait Score (0 = sober journalism, 100 = aggressive viral bait)
  const clickbaitMarkers = cleanHighlights.filter(h => ['clickbait', 'sensationalism', 'hyperbole'].includes(h.category)).length;
  const clickbaitRaw = (clickbaitMarkers * 18) + (allCapsWords.length * 6) + (exclamationCount * 8);
  const clickbaitScore = Math.min(99, Math.max(6, Math.round(clickbaitRaw)));

  // 4. Overall Credibility Score (0 to 100)
  // Real = high source reliability + high factual density - emotional intensity - clickbait
  let credibilityCalc = (sourceReliability * 0.42) + (factualDensity * 0.33) - (emotionalIntensity * 0.35) - (clickbaitScore * 0.22) + 22;
  credibilityCalc = Math.min(96, Math.max(6, Math.round(credibilityCalc)));

  // 5. Verdict & Confidence
  let verdict = 'Uncertain — Needs Verification';
  let verdictType = 'uncertain'; // 'real', 'fake', 'uncertain'
  let confidenceScore = 74;

  if (credibilityCalc >= 68 && emotionalIntensity < 50 && clickbaitScore < 45) {
    verdict = 'Likely Real';
    verdictType = 'real';
    confidenceScore = Math.min(98, Math.round(65 + (credibilityCalc - 68) * 1.1 + (factualDensity * 0.12)));
  } else if (credibilityCalc <= 42 || emotionalIntensity >= 65 || clickbaitScore >= 65) {
    verdict = 'Likely Fake';
    verdictType = 'fake';
    confidenceScore = Math.min(99, Math.round(68 + (42 - Math.min(42, credibilityCalc)) * 1.0 + (emotionalIntensity * 0.14)));
  } else {
    verdict = 'Uncertain — Needs Verification';
    verdictType = 'uncertain';
    confidenceScore = Math.round(58 + Math.abs(50 - credibilityCalc) * 0.5);
  }

  // 6. Feature Attributions (SHAP / LIME-style)
  const featureMap = {};
  for (const token of wordList) {
    if (TOKEN_WEIGHTS[token]) {
      featureMap[token] = (featureMap[token] || 0) + TOKEN_WEIGHTS[token];
    }
  }

  // Add detected phrases to feature contributions
  for (const h of cleanHighlights) {
    const key = h.text.toLowerCase();
    if (h.type === 'positive') {
      featureMap[key] = (featureMap[key] || 0) + 3.2;
    } else if (h.type === 'danger') {
      featureMap[key] = (featureMap[key] || 0) - 3.5;
    } else {
      featureMap[key] = (featureMap[key] || 0) - 2.1;
    }
  }

  // If few tokens matched, synthesize from stylistic features
  if (Object.keys(featureMap).length < 4) {
    if (capsRatio > 15) featureMap['[ALL_CAPS_EMPHASIS]'] = -2.4;
    if (exclamationCount > 1) featureMap['[EXCLAMATION_PUNCTUATION]'] = -2.0;
    if (numbersCount > 2) featureMap['[QUANTITATIVE_DATA]'] = 2.7;
    if (wordCount > 100) featureMap['[ARTICLE_DEPTH]'] = 1.9;
  }

  const featureAttributions = Object.entries(featureMap)
    .map(([feature, weight]) => ({
      feature: feature.replace(/\[|\]/g, ''),
      weight: parseFloat(weight.toFixed(2)),
      direction: weight > 0 ? 'real' : 'fake',
      absoluteImpact: Math.abs(weight)
    }))
    .sort((a, b) => b.absoluteImpact - a.absoluteImpact)
    .slice(0, 10);

  // 7. Executive Intelligence Summary
  let summary = '';
  if (verdictType === 'real') {
    summary = `Syntactical forensics indicate standard journalistic or scientific attribution. Identified ${factualDensity}% factual anchoring with disciplined emotional temperance (${emotionalIntensity}%). Core claims cite verifiable institutions.`;
  } else if (verdictType === 'fake') {
    summary = `High misinformation probability triggered by acute emotional outrage markers (${emotionalIntensity}%), elevated clickbait posture (${clickbaitScore}%), and lack of named authoritative corroboration.`;
  } else {
    summary = `Mixed credibility signals detected. While the text avoids extreme sensationalism, it lacks primary named sourcing or empirical citations to establish definitive veracity. Independent fact-checking advised.`;
  }

  return {
    id: 'tl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    inputSnippet: text.substring(0, 95) + (text.length > 95 ? '...' : ''),
    fullText: text,
    sourceUrl: sourceUrl || null,
    wordCount,
    verdict,
    verdictType,
    credibilityScore: credibilityCalc,
    confidenceScore,
    subScores: {
      emotionalIntensity,
      sourceReliability,
      factualDensity,
      clickbaitScore,
    },
    highlights: cleanHighlights,
    featureAttributions,
    summary,
    meta: {
      capsWordsCount: allCapsWords.length,
      exclamations: exclamationCount,
      citationsFound: cleanHighlights.filter(h => h.type === 'positive').length,
      flagsFound: cleanHighlights.filter(h => h.type === 'danger' || h.type === 'warning').length,
    }
  };
}

/**
 * Realistic Demo Presets for immediate testing
 */
export const SAMPLE_PRESETS = [
  {
    id: 'fake-conspiracy',
    title: 'Viral Miracle Cure & Deep State Scandal',
    badge: 'Flagged Disinformation',
    badgeType: 'fake',
    snippet: 'SHOCKING BOMBSHELL: Big Pharma whistleblowers revealed a 100% proven miracle cure...',
    text: `SHOCKING BOMBSHELL: Big Pharma whistleblowers and undisclosed insiders confirmed that corrupt elites have been hiding a 100% proven miracle cure for all cognitive ailments! What they don't want you to know is that mainstream media is completely silent while panic spreads across corporate boardrooms. 

Insiders say top doctors are speechless, yet greedy regulators immediately banned the formulation before it could reach the public. Share this before it gets deleted by the deep state puppet masters! This unbelievable secret will blow your mind and expose the criminals in power once and for all!`
  },
  {
    id: 'real-reuters',
    title: 'Reuters / NASA Scientific Exploration',
    badge: 'Verified Factual Report',
    badgeType: 'real',
    snippet: 'WASHINGTON — According to the Associated Press and data released by NASA on Thursday...',
    text: `WASHINGTON — According to the Associated Press and data released by NASA on Thursday, the agency has finalized flight readiness reviews for the Artemis II lunar trajectory test, targeting a launch window between November 2024 and April 2025.

In an official statement released by NASA Administrator Bill Nelson, telemetry evaluations from the Orion capsule demonstrated a 99.4% propulsion efficiency rating across 42 simulated orbital burns. "Our engineering teams completed rigorous thermal testing at the Glenn Research Center," confirmed agency spokesperson Cheryl Warner during a press briefing in Houston. 

The $4.1 billion deep-space exploration mission will carry four astronauts on a 10-day orbital journey around the moon, according to technical disclosures published in the peer-reviewed journal Aerospace Sciences.`
  },
  {
    id: 'uncertain-partisan',
    title: 'Partisan Policy Debate / Borderline',
    badge: 'Uncertain — Needs Verification',
    badgeType: 'uncertain',
    snippet: 'Controversial new municipal tax regulations could trigger widespread economic friction...',
    text: `Controversial new municipal tax regulations could trigger widespread economic friction across local small businesses next quarter, according to regional trade representatives and community stakeholders.

While legislative sponsors argue the 1.8% commercial assessment surcharge is strictly earmarked for civic infrastructure repairs, some people claim the projected $45 million revenue forecast fails to account for potential tenant departures. Analysts caution that until audited fiscal receipts are certified by independent accountants in October, the long-term impact on metropolitan employment remains speculative.`
  },
  {
    id: 'clickbait-tech',
    title: 'Sensationalist Tech Breakthrough Lure',
    badge: 'High Clickbait / Unverified',
    badgeType: 'fake',
    snippet: 'THIS ONE TRICK: Silicon Valley engineers are terrified after a rogue AI algorithm made $2.4M...',
    text: `THIS ONE TRICK WILL BLOW YOUR MIND! Silicon Valley engineers are terrified after a rogue AI algorithmic prototype allegedly generated $2.4 million in 72 hours without human oversight.

Rumor has it that top executives held an emergency closed-door meeting at midnight after the software leaked onto private servers. You won't believe what happens next when independent programmers try to duplicate the breakthrough code. See why billionaires are scrambling to acquire this secret before it's taken down forever!`
  }
];
