import React, { useState } from 'react';
import { X, MapPin, Compass, Navigation, Waves, Sparkles } from 'lucide-react';
import { SEA_LOCATIONS, SeaLocation } from '../data/worldData';

interface WorldMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapterByLocation?: (locationName: string) => void;
}

export default function WorldMapModal({ isOpen, onClose }: WorldMapModalProps) {
  const [selectedSea, setSelectedSea] = useState<SeaLocation>(SEA_LOCATIONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-['Amiri']">خريطة البحار والأراضي الساحرية</h2>
              <p className="text-xs text-slate-400">مسار خيط البريق الفضي (Glim) عبر البحار الستة</p>
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
          {/* Visual Interactive Map Canvas / Graphic */}
          <div className="md:col-span-2 relative bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between min-h-[360px] overflow-hidden group">
            {/* Ambient Background Sea Waves Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Glowing Silver Thread Animation (The Glim) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-400/60 stroke-2 fill-none">
              <path
                d="M 60 280 Q 180 200, 240 240 T 400 120 T 520 200 T 620 90"
                className="animate-dash"
                strokeDasharray="8 8"
              />
            </svg>

            {/* Map Locations Markers */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SEA_LOCATIONS.map((loc) => {
                const isSelected = selectedSea.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedSea(loc)}
                    className={`p-3 rounded-lg border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300">
                        {loc.dangerLevel === 'deadly' ? '☠️ مهلك' : loc.dangerLevel === 'high' ? '⚠️ خطير' : '🌊 هادئ'}
                      </span>
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    </div>
                    <span className="text-sm font-bold font-['Amiri']">{loc.nameAr}</span>
                    <span className="text-[10px] text-slate-400">{loc.nameEn}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" /> مسار البريق الفضي يسري عبر أوريليث حتى بحر الأغنية الأولى
              </span>
              <span className="text-slate-500">سفينة نوكتيس</span>
            </div>
          </div>

          {/* Location Detail Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Waves className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-emerald-300 font-['Amiri']">{selectedSea.nameAr}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">{selectedSea.nameEn}</p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">مستوى الخطورة:</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md inline-block ${
                    selectedSea.dangerLevel === 'deadly' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {selectedSea.dangerLevel === 'deadly' ? 'قاتل ومحفوف باللعنات' : 'خطير يتطلب الملاحة الحذرة'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">وصف المنطقة والأسرار:</span>
                  <p className="text-sm leading-relaxed text-slate-200">{selectedSea.descAr}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> العودة للقراءة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
