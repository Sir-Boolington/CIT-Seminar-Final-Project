import { useState, useMemo } from 'react';
import glossaryData from '../data/glossary.json';

const CATEGORY_CONFIG = {
  attack: { label: 'Attack type', color: 'bg-red-500/10 text-red-400' },
  defense: { label: 'Defense', color: 'bg-green-500/10 text-green-400' },
  social_engineering: { label: 'Social engineering', color: 'bg-amber-500/10 text-amber-400' },
  general: { label: 'General', color: 'bg-indigo-500/10 text-indigo-400' },
};

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTerms = useMemo(() => {
    let terms = glossaryData.terms;

    if (activeCategory !== 'all') {
      terms = terms.filter((t) => t.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      terms = terms.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }

    return terms;
  }, [search, activeCategory]);

  // Group by first letter
  const grouped = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTerms]);

  const allLetters = useMemo(() => {
    const letters = new Set(glossaryData.terms.map((t) => t.term[0].toUpperCase()));
    return [...letters].sort();
  }, []);

  return (
    <div className="relative z-10 px-7 py-7 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-medium text-ts-text mb-1">Glossary</h1>
        <p className="text-xs text-ts-text3">Cybersecurity terms, attack types, and defense concepts</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-ts-surface border border-ts-border rounded-lg px-3.5 py-2.5 mb-4">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none text-sm text-ts-text placeholder:text-ts-text3 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-ts-text3 hover:text-ts-text text-xs">
            Clear
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
            activeCategory === 'all'
              ? 'bg-indigo-500/10 text-ts-accent2 border-indigo-500/30'
              : 'border-ts-border text-ts-text3 hover:border-ts-border-h'
          }`}
        >
          All ({glossaryData.terms.length})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
          const count = glossaryData.terms.filter((t) => t.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                activeCategory === key
                  ? `${cfg.color} border-current/30`
                  : 'border-ts-border text-ts-text3 hover:border-ts-border-h'
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Alphabet sidebar */}
      <div className="flex gap-4">
        <div className="flex-1">
          {grouped.length === 0 ? (
            <div className="text-center py-12 text-ts-text3 text-sm">
              No terms found matching "{search}"
            </div>
          ) : (
            grouped.map(([letter, terms]) => (
              <div key={letter} id={`letter-${letter}`} className="mb-5">
                <div className="text-sm font-medium text-ts-accent2 font-mono mb-2 pb-1 border-b border-ts-border">
                  {letter}
                </div>
                {terms.map((term) => {
                  const cat = CATEGORY_CONFIG[term.category];
                  return (
                    <div
                      key={term.id}
                      className="bg-ts-surface border border-ts-border rounded-lg p-3.5 mb-2 hover:border-ts-border-h transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-ts-text">{term.term}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${cat.color}`}>
                          {cat.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-ts-text3 leading-relaxed mb-2">
                        {term.definition}
                      </p>
                      {term.related.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {term.related.map((r) => (
                            <span
                              key={r}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-ts-text3 border border-white/[0.06]"
                            >
                              {r.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Alpha jump sidebar */}
        <div className="hidden md:flex flex-col gap-0.5 pt-1 sticky top-4 self-start">
          {allLetters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="text-[9px] text-ts-text3 w-[18px] h-[16px] flex items-center justify-center rounded hover:text-ts-accent2 hover:bg-indigo-500/10 transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
