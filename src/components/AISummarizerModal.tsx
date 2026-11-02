import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, BookOpen } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AISummarizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapterTitle?: string;
  currentChapterSummary?: string;
}

export default function AISummarizerModal({ isOpen, onClose, currentChapterTitle, currentChapterSummary }: AISummarizerModalProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: `أهلاً بك! أنا مرشد رواية "أغنية الملح والظلال" الذكي. أستطيع إجابتك عن أسرار بحار أوريليث، تحول الحوريات، لعنة قبعة سابل وظله، أو ملخص أي فصل من الفصول الـ 40. كيف أستطيع مساعدتك اليوم؟`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Initialize Gemini API client
      const apiKey = process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `أنت خبير وأديب متخصص في تحليل ورواية "أغنية الملح والظلال" (The Song of Salt and Shadow) للكاتبة سيرين روز.
تدور القصة حول الحورية إيريس (Eryse) والقبطان الملعون سابل كرو (Captain Sable Crowe) وسفينته "نوكتيس" في بحار أوريليث والبحار الستة.
أجب عن سؤال القارئ التالي باللغة العربية بأسلوب أدبي مشوق ودقيق:

السؤال: ${userMsg}

ملاحظة الفصل الحالي للقارئ: ${currentChapterTitle || ''} - ${currentChapterSummary || ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const reply = response.text || 'عذراً، لم أستطع إيجاد إجابة دقيقة في الوقت الحالي.';
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'حدث خطأ أثناء التواصل مع مرشد الرواية الذكي. يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-['Amiri']">مرشد الرواية الذكي (AI Reader Assistant)</h2>
              <p className="text-xs text-slate-400">استفسر عن أي شخصية، موقع، أسطورة أو أحداث الرواية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`p-2 rounded-xl h-fit ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-4 rounded-2xl max-w-[85%] leading-relaxed text-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="p-2 bg-slate-800 text-emerald-400 rounded-xl">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                جاري التفكير في إجابة أسئلة الرواية...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 whitespace-nowrap">مقترحات:</span>
          <button
            onClick={() => { setInput('ما هي لعنة الظل التي يعاني منها القبطان سابل كرو؟'); }}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg whitespace-nowrap transition"
          >
            لعنة سابل وظله
          </button>
          <button
            onClick={() => { setInput('ما هي سحر وتأثير بحر التجدد وبحر العظام؟'); }}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg whitespace-nowrap transition"
          >
            سحر البحار الستة
          </button>
          <button
            onClick={() => { setInput('لماذا ولدت إيريس بدون ذيل سمكة حقيقي؟'); }}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg whitespace-nowrap transition"
          >
            حقيقة إيريس
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/90 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل مرشد الرواية عن أي تفصيل أو تحليل..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
