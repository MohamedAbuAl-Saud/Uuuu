import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Share2,
  Copy,
  Check,
  Compass,
  Info,
  Anchor,
  Scroll
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, ALL_CHAPTERS, NOVEL_META } from '../data/novelData';
import { ReaderSettings } from './SettingsModal';

interface ReaderViewProps {
  chapter: Chapter;
  onSelectChapter: (id: number | string) => void;
  settings: ReaderSettings;
  onOpenAi: () => void;
}

export default function ReaderView({
  chapter,
  onSelectChapter,
  settings,
  onOpenAi
}: ReaderViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('novel_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentIndex = ALL_CHAPTERS.findIndex(c => String(c.id) === String(chapter.id));
  const prevChapter = currentIndex > 0 ? ALL_CHAPTERS[currentIndex - 1] : null;
  const nextChapter = currentIndex < ALL_CHAPTERS.length - 1 ? ALL_CHAPTERS[currentIndex + 1] : null;

  const isBookmarked = bookmarks.includes(String(chapter.id));

  const toggleBookmark = () => {
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarks.filter(b => b !== String(chapter.id));
    } else {
      updated = [...bookmarks, String(chapter.id)];
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    setBookmarks(updated);
    try {
      localStorage.setItem('novel_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const copyParagraph = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapter.id]);

  const getFontClass = () => {
    switch (settings.fontFamily) {
      case 'Amiri':
        return "font-['Amiri',serif]";
      case 'Tajawal':
        return "font-['Tajawal',sans-serif]";
      case 'Cairo':
      default:
        return "font-['Cairo',sans-serif]";
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-700 pb-20 overflow-x-hidden" 
      dir="rtl"
      style={{
        background: '#0c0d16',
        backgroundImage: 'radial-gradient(circle at top, #1a1c2c 0%, #0c0d16 100%)'
      }}
    >
      {/* Chapter Progress Header */}
      <div className="border-b border-amber-900/20 bg-black/40 py-3 px-4 sticky top-[57px] z-30 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-amber-500/50 hidden sm:inline">سجلات الإبحار:</span>
            <span className="font-bold text-amber-100 font-['Amiri']">{chapter.seaLocation}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[10px] text-amber-500/40 uppercase font-serif tracking-[0.2em]">
              <span>Chapter {currentIndex + 1} of {ALL_CHAPTERS.length}</span>
            </div>
            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
                isBookmarked
                  ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-900/50'
                  : 'bg-white/5 text-amber-500/60 border-amber-900/30 hover:text-amber-400 hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="font-['Amiri']">{isBookmarked ? 'موثّق' : 'حفظ الأثر'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-12 mb-12">
        {/* PARCHMENT NOVEL CONTAINER */}
        <div 
          className="relative bg-[#f4e4bc] rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] p-1 group animate-fadeIn"
          style={{
            backgroundImage: 'url("/src/assets/images/ancient_parchment_texture_1793573754468.jpg")',
            backgroundSize: 'cover'
          }}
        >
          {/* Ornate Frame Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{ 
              border: '24px solid transparent',
              borderImage: 'url("/src/assets/images/ancient_pirate_border_1793573504823.jpg") 100 round' 
            }}
          />

          <div className="relative p-8 sm:p-16">
            {/* Chapter Header */}
            <div className="text-center space-y-4 mb-16">
              <div className="flex items-center justify-center gap-3 opacity-30 mb-2">
                <Scroll className="w-5 h-5 text-amber-950" />
                <div className="h-px w-20 bg-amber-950"></div>
                <Anchor className="w-5 h-5 text-amber-950" />
                <div className="h-px w-20 bg-amber-950"></div>
                <Scroll className="w-5 h-5 text-amber-950" />
              </div>

              <h1 className="text-4xl sm:text-6xl font-black font-['Amiri'] text-amber-950 leading-tight">
                {chapter.titleAr}
              </h1>
              <p className="text-sm font-serif italic text-amber-900/60 tracking-[0.2em] uppercase">{chapter.titleEn}</p>
              
              <div className="flex justify-center mt-6">
                <div className="px-4 py-1.5 border-2 border-amber-900/10 rounded-full text-xs font-bold text-amber-900/40 uppercase tracking-widest font-serif">
                  Noctis Log • {chapter.seaLocation.split('-')[0]}
                </div>
              </div>

              {/* CHAPTER ILLUSTRATION */}
              <div className="mt-12 w-full max-w-2xl mx-auto relative group/img">
                <div className="absolute inset-0 bg-amber-950/20 blur-2xl opacity-0 group-hover/img:opacity-40 transition-opacity duration-1000" />
                <div className="relative rounded-2xl overflow-hidden border-8 border-amber-900/10 shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
                  <img 
                    src={`/assets/images/ch${chapter.id}_illustration.jpg`} 
                    alt="Chapter Scene"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/images/ship_divider.png";
                    }}
                    className="w-full h-full object-cover sepia-[0.3] brightness-90 contrast-110"
                  />
                  {/* Decorative caption */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-amber-100/60 italic font-['Amiri'] text-center">
                      مشهد من {chapter.titleAr}: {chapter.summaryAr.slice(0, 100)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Paragraphs with high literary styling */}
            <div
              className={`space-y-12 ${getFontClass()} text-amber-950 selection:bg-amber-800/20`}
              style={{
                fontSize: `${settings.fontSize + 2}px`,
                lineHeight: settings.lineHeight
              }}
            >
              {chapter.contentAr.map((paragraph: string, index: number) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <p className="indent-12 text-justify leading-loose first-letter:text-4xl first-letter:font-bold first-letter:text-amber-900 drop-shadow-sm">
                    {paragraph}
                  </p>

                  <button
                    onClick={() => copyParagraph(paragraph, index)}
                    className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-all p-2 text-amber-900/40 hover:text-amber-900 hover:scale-110"
                    title="اقتباس"
                  >
                    {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Chapter End Marker */}
            <div className="mt-20 flex flex-col items-center gap-6 opacity-20">
              <div className="flex items-center gap-4">
                <div className="h-px bg-amber-950 w-32"></div>
                <span className="text-2xl">⚓</span>
                <div className="h-px bg-amber-950 w-32"></div>
              </div>
              <p className="font-serif text-[10px] tracking-[0.5em] uppercase font-bold text-amber-950">End of Record</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Custom Styles */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
          {prevChapter ? (
            <button
              onClick={() => onSelectChapter(prevChapter.id)}
              className="p-6 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-900/20 rounded-3xl text-right transition-all group flex items-center gap-4 hover:-translate-x-2"
            >
              <div className="p-3 bg-amber-900/20 rounded-2xl">
                <ChevronRight className="w-6 h-6 text-amber-400 group-hover:scale-125 transition-transform" />
              </div>
              <div>
                <span className="text-[10px] text-amber-600/60 font-bold uppercase tracking-wider block mb-1">الفصل السابق</span>
                <span className="text-lg font-bold text-amber-100 font-['Amiri']">{prevChapter.titleAr}</span>
              </div>
            </button>
          ) : <div />}

          {nextChapter ? (
            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="p-6 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-900/20 rounded-3xl text-left transition-all group flex items-center justify-between hover:translate-x-2 shadow-xl shadow-black/20"
            >
              <div>
                <span className="text-[10px] text-amber-600/60 font-bold uppercase tracking-wider block mb-1">الفصل التالي</span>
                <span className="text-lg font-bold text-amber-300 font-['Amiri']">{nextChapter.titleAr}</span>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <ChevronLeft className="w-6 h-6 text-amber-400 group-hover:scale-125 transition-transform" />
              </div>
            </button>
          ) : (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center shadow-inner">
              <span className="text-lg text-emerald-400 font-bold block mb-2 font-['Amiri']">🎉 بلغت النهاية بسلام</span>
              <span className="text-xs text-emerald-500/60">لقد أتممت رحلتك عبر أغنية الملح والظلال.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
