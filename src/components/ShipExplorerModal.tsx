import React, { useState } from 'react';
import { X, Anchor, Shield, BookOpen } from 'lucide-react';
import { SHIP_SECTIONS, ShipSection } from '../data/worldData';

interface ShipExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShipExplorerModal({ isOpen, onClose }: ShipExplorerModalProps) {
  const [selectedSection, setSelectedSection] = useState<ShipSection>(SHIP_SECTIONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-['Amiri']">سفينة نوكتيس (The Noctis)</h2>
              <p className="text-xs text-slate-400">دليل مقاصير وأسطح سفينة القراصنة سوداء الهيكل</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Deck List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block px-1 mb-2">أقسام ومستويات السفينة:</span>
            {SHIP_SECTIONS.map((sec) => {
              const isSelected = selectedSection.id === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec)}
                  className={`w-full text-right p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold font-['Amiri']">{sec.nameAr}</div>
                    <div className="text-[10px] text-slate-400">{sec.nameEn}</div>
                  </div>
                  <Shield className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Detailed Section Info Panel */}
          <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs text-emerald-400 font-bold tracking-wider uppercase block mb-1">
                  {selectedSection.nameEn}
                </span>
                <h3 className="text-2xl font-bold text-white font-['Amiri']">{selectedSection.nameAr}</h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> الوصف والاستخدام:
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-200">{selectedSection.descAr}</p>
                </div>

                <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-emerald-400" /> الأحداث الرئيسية فيه بالرواية:
                  </h4>
                  <p className="text-sm leading-relaxed text-emerald-100">{selectedSection.eventsAr}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition"
            >
              إغلاق دليل السفينة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
