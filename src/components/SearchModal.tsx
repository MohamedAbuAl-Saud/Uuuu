import React, { useState } from 'react';
import { X, Search, BookOpen, ArrowLeft } from 'lucide-react';
import { searchChapters, Chapter } from '../data/novelData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (id: number | string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectChapter }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ chapter: Chapter; matchSnippet: string }[]>([]);

  if (!isOpen) return null;

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length > 1) {
      setResults(searchChapters(q));
    } else {
      setResults([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[75vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ابحث عن كلمة، شخصية، أو موقع (مثلاً: سابل، غليم، الحورية، القراصنة)..."
            className="flex-1 bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500 font-['Cairo']"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim().length <= 1 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              اكتب كلمتين أو أكثر لبدء البحث الفوري في نصوص وفصول الرواية الـ 40.
            </div>
          )}

          {query.trim().length > 1 && results.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              لم يتم العثور على نتائج للكلمة "<span className="text-emerald-400 font-bold">{query}</span>"
            </div>
          )}

          {results.map((res, i) => (
            <button
              key={i}
              onClick={() => {
                onSelectChapter(res.chapter.id);
                onClose();
              }}
              className="w-full text-right p-4 bg-slate-950/60 hover:bg-slate-850 border border-slate-800 rounded-xl transition group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 font-['Amiri'] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> {res.chapter.titleAr}
                </span>
                <span className="text-[10px] text-slate-500">{res.chapter.seaLocation}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition">
                {res.matchSnippet}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
