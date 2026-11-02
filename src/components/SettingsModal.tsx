import React from 'react';
import { X, Type, Sun, Moon, Eye, Sliders } from 'lucide-react';

export interface ReaderSettings {
  theme: 'dark' | 'sepia' | 'ocean' | 'light';
  fontFamily: 'Amiri' | 'Cairo' | 'Tajawal';
  fontSize: number; // in px, e.g. 18
  lineHeight: number; // e.g. 1.8
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onChangeSettings: (newSettings: ReaderSettings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onChangeSettings
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100 font-['Amiri']">إعدادات القراءة والتنسيق</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-6 space-y-6 text-xs text-slate-200">
          {/* Theme selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-emerald-400" /> مظهر القارئ (النمط):
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => onChangeSettings({ ...settings, theme: 'dark' })}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  settings.theme === 'dark' ? 'bg-slate-950 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950/50 border-slate-800 text-slate-400'
                }`}
              >
                داكن
              </button>
              <button
                onClick={() => onChangeSettings({ ...settings, theme: 'ocean' })}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  settings.theme === 'ocean' ? 'bg-blue-950 border-emerald-500 text-emerald-300 font-bold' : 'bg-blue-950/40 border-slate-800 text-slate-400'
                }`}
              >
                محيطي
              </button>
              <button
                onClick={() => onChangeSettings({ ...settings, theme: 'sepia' })}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  settings.theme === 'sepia' ? 'bg-[#fbf0d9] text-[#5f4b32] border-[#d2b48c] font-bold' : 'bg-[#fbf0d9]/20 border-slate-800 text-slate-400'
                }`}
              >
                ورقي
              </button>
              <button
                onClick={() => onChangeSettings({ ...settings, theme: 'light' })}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  settings.theme === 'light' ? 'bg-slate-100 text-slate-900 border-emerald-500 font-bold' : 'bg-slate-800 border-slate-800 text-slate-400'
                }`}
              >
                فاتح
              </button>
            </div>
          </div>

          {/* Font Family Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-400 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-emerald-400" /> خط النص العربي:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChangeSettings({ ...settings, fontFamily: 'Amiri' })}
                className={`py-2.5 px-3 rounded-xl border text-center transition font-['Amiri'] text-sm ${
                  settings.fontFamily === 'Amiri' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950/50 border-slate-800 text-slate-300'
                }`}
              >
                خط الأميري
              </button>
              <button
                onClick={() => onChangeSettings({ ...settings, fontFamily: 'Cairo' })}
                className={`py-2.5 px-3 rounded-xl border text-center transition font-['Cairo'] text-xs ${
                  settings.fontFamily === 'Cairo' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950/50 border-slate-800 text-slate-300'
                }`}
              >
                خط القاهرة
              </button>
              <button
                onClick={() => onChangeSettings({ ...settings, fontFamily: 'Tajawal' })}
                className={`py-2.5 px-3 rounded-xl border text-center transition font-['Tajawal'] text-xs ${
                  settings.fontFamily === 'Tajawal' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950/50 border-slate-800 text-slate-300'
                }`}
              >
                خط تجوال
              </button>
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-bold">حجم الخط:</span>
              <span className="text-emerald-400 font-bold">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="28"
              step="1"
              value={settings.fontSize}
              onChange={(e) => onChangeSettings({ ...settings, fontSize: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Line Height Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-bold">تباعد الأسطر:</span>
              <span className="text-emerald-400 font-bold">{settings.lineHeight}</span>
            </div>
            <input
              type="range"
              min="1.4"
              max="2.4"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => onChangeSettings({ ...settings, lineHeight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition"
          >
            حفظ واستمرار القراءة
          </button>
        </div>
      </div>
    </div>
  );
}
