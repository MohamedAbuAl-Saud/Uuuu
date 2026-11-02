import React, { useState } from 'react';
import { X, Users, User, ShieldAlert, Sparkles } from 'lucide-react';
import { CREW_MEMBERS, CrewMember } from '../data/worldData';

interface CrewDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrewDirectoryModal({ isOpen, onClose }: CrewDirectoryModalProps) {
  const [selectedMember, setSelectedMember] = useState<CrewMember>(CREW_MEMBERS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-['Amiri']">شخصيات الرواية وطاقم السفينة</h2>
              <p className="text-xs text-slate-400">دليل الشخصيات الرئيسية والبحارة والسحرة والحوريات</p>
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
          {/* Character List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block px-1 mb-2">أفراد الطاقم والشخصيات:</span>
            {CREW_MEMBERS.map((m) => {
              const isSelected = selectedMember.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className={`w-full text-right p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{m.avatarIcon}</span>
                    <div>
                      <div className="text-sm font-bold font-['Amiri']">{m.nameAr}</div>
                      <div className="text-[10px] text-slate-400">{m.roleAr}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Member Card Details */}
          <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-inner">
                  {selectedMember.avatarIcon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Amiri']">{selectedMember.nameAr}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{selectedMember.roleAr} ({selectedMember.nameEn})</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" /> نبذة ودور الشخصية:
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-200">{selectedMember.descAr}</p>
                </div>

                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>أول ظهور في القصة:</span>
                  <span className="font-bold text-emerald-300">{selectedMember.firstAppearance}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition"
            >
              إغلاق دليل الشخصيات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
