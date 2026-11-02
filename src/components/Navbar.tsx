import React, { useState } from 'react';
import {
  BookOpen,
  Map,
  Users,
  Anchor,
  Search,
  Settings,
  Sparkles,
  FileText,
  List,
  Bookmark,
  Languages
} from 'lucide-react';
import AmbientSoundPlayer from './AmbientSoundPlayer';
import { ALL_CHAPTERS, Chapter } from '../data/novelData';

interface NavbarProps {
  currentChapterId: number | string;
  onSelectChapter: (id: number | string) => void;
  onOpenMap: () => void;
  onOpenShip: () => void;
  onOpenCrew: () => void;
  onOpenPdf: () => void;
  onOpenAi: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  isDualLanguage: boolean;
  onToggleDualLanguage: () => void;
}

export default function Navbar({
  currentChapterId,
  onSelectChapter,
  onOpenMap,
  onOpenShip,
  onOpenCrew,
  onOpenPdf,
  onOpenAi,
  onOpenSearch,
  onOpenSettings,
  isDualLanguage,
  onToggleDualLanguage
}: NavbarProps) {
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);

  const currentChapter = ALL_CHAPTERS.find(c => String(c.id) === String(currentChapterId)) || ALL_CHAPTERS[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/80 px-4 py-3 shadow-xl" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-xl shadow-md text-white border border-emerald-400/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-100 font-['Amiri'] leading-tight flex items-center gap-2">
              أغنية الملح والظلال
              <span className="text-[10px] font-sans px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">سيرين روز</span>
            </h1>
            <p className="text-xs text-slate-400">The Song of Salt and Shadow</p>
          </div>
        </div>

        {/* Chapter Quick Select Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsChapterMenuOpen(!isChapterMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 transition shadow-inner"
          >
            <List className="w-4 h-4 text-emerald-400" />
            <span className="font-bold font-['Amiri'] max-w-[140px] sm:max-w-[200px] truncate">
              {currentChapter.titleAr}
            </span>
          </button>

          {isChapterMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                <span>فصول الرواية (40 فصل + الخاتمة)</span>
                <span className="text-[10px] text-emerald-400">40/40</span>
              </div>
              {ALL_CHAPTERS.map((ch) => {
                const isSelected = String(ch.id) === String(currentChapterId);
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      onSelectChapter(ch.id);
                      setIsChapterMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span className="font-['Amiri'] font-semibold">{ch.titleAr}</span>
                    <span className="text-[10px] opacity-70 font-sans">{ch.seaLocation}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Controls & Modal Triggers */}
        <div className="flex items-center gap-2">
          {/* Ambient Player */}
          <div className="hidden lg:block">
            <AmbientSoundPlayer />
          </div>

          {/* Map Trigger */}
          <button
            onClick={onOpenMap}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 rounded-xl transition"
            title="خريطة البحار الساحرية"
          >
            <Map className="w-4 h-4" />
          </button>

          {/* Ship Explorer Trigger */}
          <button
            onClick={onOpenShip}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 rounded-xl transition"
            title="دليل سفينة نوكتيس"
          >
            <Anchor className="w-4 h-4" />
          </button>

          {/* Crew Directory Trigger */}
          <button
            onClick={onOpenCrew}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 rounded-xl transition"
            title="طاقم السفينة والشخصيات"
          >
            <Users className="w-4 h-4" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 rounded-xl transition"
            title="بحث في الرواية"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Reader Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 rounded-xl transition"
            title="إعدادات القراءة والخطوط"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Export Arabic Translated PDF Button */}
          <button
            onClick={onOpenPdf}
            className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="تنزيل وطباعة الرواية العربية المترجمة كـ PDF"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">تحميل كـ PDF</span>
          </button>

          {/* AI Reader Assistant */}
          <button
            onClick={onOpenAi}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1"
            title="مرشد الرواية الذكي"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
