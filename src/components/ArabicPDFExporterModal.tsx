import React, { useState, useRef, useEffect } from 'react';
import { X, Download, BookOpen, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ALL_CHAPTERS } from '../data/novelData';

interface ArabicPDFExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArabicPDFExporterModal({ isOpen, onClose }: ArabicPDFExporterModalProps) {
  const [downloadScope, setDownloadScope] = useState<'full' | 'p1' | 'p2' | 'p3' | 'p4'>('full');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreGenerating, setIsPreGenerating] = useState(false);
  const [preGenProgress, setPreGenProgress] = useState(0);
  const [cachedPdfBlobUrl, setCachedPdfBlobUrl] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  // Automatically pre-generate PDF in the background as soon as modal opens so it's instantly ready
  useEffect(() => {
    if (!isOpen) {
      setCachedPdfBlobUrl(null);
      setIsPreGenerating(false);
      setPreGenProgress(0);
      return;
    }

    let isCancelled = false;

    const preGeneratePDF = async () => {
      if (cachedPdfBlobUrl) return;
      setIsPreGenerating(true);
      setPreGenProgress(5);
      setProgressMsg('جاري التحضير التلقائي للـ PDF في الخلفية ليكون جاهزاً فوراً...');

      // Small delay to let DOM render fully
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (isCancelled || !printRef.current) return;

      try {
        const html2canvas = (await import('html2canvas')).default;
        const { jsPDF } = await import('jspdf');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();

        const sections = Array.from(printRef.current.children) as HTMLElement[];
        const totalSections = sections.length;

        for (let i = 0; i < totalSections; i++) {
          if (isCancelled) return;
          const section = sections[i];
          const progress = Math.round(((i + 1) / totalSections) * 100);
          setPreGenProgress(progress);
          setProgressMsg(`جاري التحضير المسبق للصفحة ${i + 1} من ${totalSections} (${progress}%)...`);

          const canvas = await html2canvas(section, {
            scale: 1.5, // Optimal crisp scale for background pre-generation speed and quality
            useCORS: true,
            logging: false,
            backgroundColor: '#FFFFFF',
            windowWidth: 595,
            onclone: (clonedDoc) => {
              const styleSheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
              styleSheets.forEach(sheet => sheet.remove());
              const cleanStyle = clonedDoc.createElement('style');
              cleanStyle.innerHTML = `
                * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
                body { background: #ffffff; color: #1e293b; font-family: 'Amiri', serif; }
              `;
              clonedDoc.head.appendChild(cleanStyle);
            }
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.92);
          const margin = 0;
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
        }

        if (!isCancelled) {
          const pdfBlob = pdf.output('blob');
          const url = URL.createObjectURL(pdfBlob);
          setCachedPdfBlobUrl(url);
          setIsPreGenerating(false);
          setProgressMsg('الملف جاهز الآن للتحميل الفوري!');
        }
      } catch (err) {
        console.error('Pre-generation failed:', err);
        if (!isCancelled) {
          setIsPreGenerating(false);
          setProgressMsg('يمكنك التنزيل اليدوي عند الإتمام.');
        }
      }
    };

    preGeneratePDF();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, downloadScope]);

  if (!isOpen) return null;

  const getSelectedChapters = () => {
    if (downloadScope === 'p1') return ALL_CHAPTERS.slice(0, 10);
    if (downloadScope === 'p2') return ALL_CHAPTERS.slice(10, 20);
    if (downloadScope === 'p3') return ALL_CHAPTERS.slice(20, 30);
    if (downloadScope === 'p4') return ALL_CHAPTERS.slice(30);
    return ALL_CHAPTERS;
  };

  const activeChapters = getSelectedChapters();

  // Helper to split text into fixed-length lines for 8-line pagination
  const paginateText = (textArray: string[], linesPerPage: number = 8) => {
    const allLines: string[] = [];
    const charsPerLine = 52; 

    textArray.forEach(paragraph => {
      const words = paragraph.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length > charsPerLine) {
          allLines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      if (currentLine) allLines.push(currentLine.trim());
    });

    const pages: string[][] = [];
    for (let i = 0; i < allLines.length; i += linesPerPage) {
      pages.push(allLines.slice(i, i + linesPerPage));
    }
    return pages;
  };

  const handleDownloadPDF = async () => {
    if (cachedPdfBlobUrl) {
      // Instant download if pre-generated!
      const a = document.createElement('a');
      a.href = cachedPdfBlobUrl;
      a.download = downloadScope === 'full' ? 'أغنية_الملح_والظلال_الفاخرة.pdf' : `أغنية_الملح_والظلال_جزء_${downloadScope}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Otherwise generate on the fly
    setIsGenerating(true);
    setProgressMsg('جاري تجهيز وثيقة الرواية (0%)...');

    try {
      if (!printRef.current) return;
      
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const sections = Array.from(printRef.current.children) as HTMLElement[];
      const totalSections = sections.length;
      
      for (let i = 0; i < totalSections; i++) {
        const section = sections[i];
        const progress = Math.round(((i + 1) / totalSections) * 100);
        setProgressMsg(`جاري معالجة الصفحة ${i + 1} من ${totalSections} (${progress}%)...`);

        const canvas = await html2canvas(section, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
          windowWidth: 595,
          onclone: (clonedDoc) => {
            const styleSheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
            styleSheets.forEach(sheet => sheet.remove());
            const cleanStyle = clonedDoc.createElement('style');
            cleanStyle.innerHTML = `
              * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
              body { background: #ffffff; color: #1e293b; font-family: 'Amiri', serif; }
            `;
            clonedDoc.head.appendChild(cleanStyle);
          }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const margin = 0;
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
      }

      pdf.save(downloadScope === 'full' ? 'أغنية_الملح_والظلال_الفاخرة.pdf' : `أغنية_الملح_والظلال_جزء_${downloadScope}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('حدث خطأ أثناء التصدير. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  const handleDownloadHTML = () => {
    const baseUrl = 'https://ais-dev-qflrdfg54z76ika2kckcej-16627332617.europe-west2.run.app';
    
    let globalPageCounter = 0;
    let pagesHtml = '';

    // Front 6 images
    if (downloadScope === 'full') {
      const frontImages = [
        { file: 'cover.png', alt: 'غلاف الرواية' },
        { file: 'title_art.png', alt: 'أغنية الملح والظلال' },
        { file: 'map_1.png', alt: 'خريطة العالم - الجزء الأول' },
        { file: 'map_2.png', alt: 'خريطة العالم - الجزء الثاني' },
        { file: 'quote_art.png', alt: 'اقتباس مميز' },
        { file: 'ship_divider.png', alt: 'سفينة نوكتيس' },
      ];

      frontImages.forEach(img => {
        pagesHtml += `
          <div style="width: 595px; height: 842px; background: #ffffff; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; box-sizing: border-box; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <img src="${baseUrl}/assets/images/${img.file}" alt="${img.alt}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        `;
      });

      // Page 7: Dedication
      globalPageCounter++;
      pagesHtml += `
        <div style="width: 595px; min-height: 842px; padding: 40px; background: #fef2f2; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box; position: relative; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 50px; position: relative;">
            <div style="position: absolute; top: 20px; left: 20px; font-size: 20px; opacity: 0.2;">⚓ ⛵</div>
            <div style="position: absolute; top: 20px; right: 20px; font-size: 20px; opacity: 0.2;">🌹 🌊</div>
            <div style="text-align: center; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 18px;">
              <div style="font-size: 24px; font-weight: bold; color: #dc2626; font-family: 'Amiri', serif; margin-bottom: 8px;">
                إهداء خاص وعشق لأبنتي
              </div>
              <p style="font-size: 18px; line-height: 2.1; color: #991b1b; font-family: 'Amiri', serif; margin: 0; font-weight: bold;">
                صنعت ورتبت وصممت لأجلك يا سما
              </p>
              <p style="font-size: 16px; line-height: 2.0; color: #7f1d1d; font-family: 'Amiri', serif; margin: 0;">
                ذكرى من القلب وحبيب القلب محمد أبو السعود
              </p>
              <p style="font-size: 15px; line-height: 2.0; color: #991b1b; font-family: 'Amiri', serif; margin: 0;">
                يا أجمل نعمة في حياتي، استمتعي وابتسمي فهي مصنوعة لأجلك يا سمسمتي وحدكِ.
              </p>
              <p style="font-size: 15px; line-height: 2.0; color: #b91c1c; font-family: 'Amiri', serif; font-style: italic; margin: 0;">
                يا قمر البحار ودرة القلوب، يا من ملكتِ الروح والنبض.. أهدي إليكِ بحار العشق وغيمات الغزل، فأنتِ الرواية الأبدية التي تكتمل بابتسامتك ووجودك الساحر في حياتي.
              </p>
              <div style="margin-top: 20px; padding: 10px 20px; border: 1px solid #fecaca; border-radius: 12px; background-color: #fee2e2; color: #991b1b; font-size: 15px; font-family: sans-serif; font-weight: bold;">
                ♡SM♡Sama♡Mohamed Abu AlSaud♡
              </div>
            </div>
            <div style="position: absolute; bottom: 20px; width: calc(100% - 40px); display: flex; justify-content: space-between; color: #f87171; font-size: 11px; font-family: 'Amiri', serif;">
              <span>♡SM♡Sama♡Mohamed Abu AlSaud♡</span>
              <span>صفحة ${globalPageCounter}</span>
            </div>
          </div>
        </div>
      `;
    }

    // Chapters
    activeChapters.forEach(ch => {
      const chapterPages = paginateText(ch.contentAr, 8);

      // Chapter Header Page
      globalPageCounter++;
      pagesHtml += `
        <div style="width: 595px; min-height: 842px; padding: 40px; background: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box; position: relative; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="border: 1.5px solid #cbd5e1; width: 100%; height: 100%; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; position: relative; background: #ffffff;">
            <div style="position: absolute; top: -2px; left: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-right: 0; border-bottom: 0;"></div>
            <div style="position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-left: 0; border-bottom: 0;"></div>
            <div style="position: absolute; bottom: -2px; left: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-right: 0; border-top: 0;"></div>
            <div style="position: absolute; bottom: -2px; right: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-left: 0; border-top: 0;"></div>

            <div style="position: absolute; top: 15px; right: 25px; font-size: 14px; opacity: 0.3;">⚓</div>
            <div style="position: absolute; top: 15px; left: 25px; font-size: 14px; opacity: 0.3;">⛵</div>

            <div style="text-align: center; width: 100%;">
              <span style="font-size: 12px; color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">الفصل الجديد • New Chapter</span>
              <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; font-family: 'Amiri', serif; margin-top: 10px; margin-bottom: 8px;">${ch.titleAr}</h1>
              <p style="font-size: 14px; color: #64748b; margin-bottom: 20px; font-style: italic;">${ch.titleEn}</p>
              
              <div style="width: 100%; height: 310px; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 2px solid #cbd5e1; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
                <img src="${baseUrl}/assets/images/ch${ch.id}_illustration.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover; filter: contrast(1.05) brightness(1.02);" />
              </div>
              
              <p style="font-size: 13px; color: #0f766e; font-weight: bold;">الموقع البحري: ${ch.seaLocation}</p>
            </div>
            
            <div style="position: absolute; bottom: 20px; width: calc(100% - 40px); display: flex; justify-content: space-between; color: #94a3b8; font-size: 11px; font-family: 'Amiri', serif;">
              <span>♡SM♡Sama♡Mohamed Abu AlSaud♡</span>
              <span>صفحة ${globalPageCounter}</span>
            </div>
          </div>
        </div>
      `;

      // Chapter Text Pages
      chapterPages.forEach(lines => {
        globalPageCounter++;
        pagesHtml += `
          <div style="width: 595px; min-height: 842px; padding: 40px; background: #ffffff; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box; position: relative; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="border: 1.5px solid #cbd5e1; width: 100%; height: 100%; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; position: relative; background: #ffffff;">
              <div style="position: absolute; top: -2px; left: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-right: 0; border-bottom: 0;"></div>
              <div style="position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-left: 0; border-bottom: 0;"></div>
              <div style="position: absolute; bottom: -2px; left: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-right: 0; border-top: 0;"></div>
              <div style="position: absolute; bottom: -2px; right: -2px; width: 18px; height: 18px; border: 2px solid #0f766e; border-left: 0; border-top: 0;"></div>

              <div style="position: absolute; top: 15px; right: 25px; font-size: 12px; opacity: 0.25;">🌊</div>
              <div style="position: absolute; top: 15px; left: 25px; font-size: 12px; opacity: 0.25;">🌹</div>

              <div style="width: 100%; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 12px;">
                ${lines.map(line => `<p style="font-size: 19px; line-height: 2.3; color: #1e293b; text-align: center; font-family: 'Amiri', serif; margin: 0; min-height: 45px;">${line}</p>`).join('')}
              </div>

              <div style="position: absolute; bottom: 20px; width: calc(100% - 40px); display: flex; justify-content: space-between; color: #94a3b8; font-size: 11px; font-family: 'Amiri', serif;">
                <span>♡SM♡Sama♡Mohamed Abu AlSaud♡</span>
                <span>صفحة ${globalPageCounter}</span>
              </div>
            </div>
          </div>
        `;
      });
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>أغنية الملح والظلال - سيرين روز</title>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { background: #0f172a; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 40px; font-family: 'Amiri', serif; }
          @media print {
            body { background: #ffffff; padding: 0; }
            .page { margin: 0; box-shadow: none; page-break-after: always; break-after: page; }
          }
        </style>
      </head>
      <body>
        ${pagesHtml}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'أغنية_الملح_والظلال_الفاخرة.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pageContainerStyle: React.CSSProperties = {
    padding: '40px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '842px', 
    width: '595px', 
    boxSizing: 'border-box',
    position: 'relative'
  };

  const innerBorderStyle: React.CSSProperties = {
    border: '1.5px solid #cbd5e1', 
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    position: 'relative',
    backgroundColor: '#ffffff'
  };

  const decorativeCorner = (pos: 'tl'|'tr'|'bl'|'br') => {
    const style: React.CSSProperties = {
      position: 'absolute',
      width: '18px',
      height: '18px',
      border: '2px solid #0f766e'
    };
    if (pos === 'tl') return { ...style, top: '-2px', left: '-2px', borderRight: 0, borderBottom: 0 };
    if (pos === 'tr') return { ...style, top: '-2px', right: '-2px', borderLeft: 0, borderBottom: 0 };
    if (pos === 'bl') return { ...style, bottom: '-2px', left: '-2px', borderRight: 0, borderTop: 0 };
    if (pos === 'br') return { ...style, bottom: '-2px', right: '-2px', borderLeft: 0, borderTop: 0 };
    return style;
  };

  let globalPageCounter = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl" dir="rtl">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[96vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Amiri']">تصدير الرواية الفاخرة (جاهز للتنزيل الفوري)</h2>
              <p className="text-sm text-slate-400">يتم تحضير الملف في الخلفية تلقائياً ليكون جاهزاً للتحميل بلحظة واحدة</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadHTML}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              <Download className="w-5 h-5" /> تنزيل كـ HTML
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 ${
                cachedPdfBlobUrl 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 animate-pulse font-extrabold' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {cachedPdfBlobUrl ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {cachedPdfBlobUrl ? 'تنزيل PDF فوري الآن!' : isPreGenerating ? `جاري التحضير (${preGenProgress}%)...` : 'تنزيل PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status / Progress Msg */}
        {(isPreGenerating || isGenerating) && (
          <div className="bg-emerald-900/50 px-8 py-2.5 text-center border-b border-emerald-800/30 flex items-center justify-center gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <p className="text-emerald-300 text-xs font-bold">
              {isPreGenerating ? `⚡ تحضير تلقائي للخلفية: ${preGenProgress}% - سيزن التحميل فوراً عند ضغط الزر` : progressMsg}
            </p>
          </div>
        )}

        {cachedPdfBlobUrl && !isPreGenerating && (
          <div className="bg-emerald-500/20 px-8 py-2 text-center border-b border-emerald-500/30">
            <p className="text-emerald-400 text-xs font-bold">
              ✨ الملف جاهز تماماً في الذاكرة! اضغط على زر "تنزيل PDF فوري الآن" ليتم تحميله على جهازك في أقل من ثانية.
            </p>
          </div>
        )}

        {/* Preview Scroll Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-slate-950 flex flex-col items-center gap-12 scroll-smooth custom-scrollbar">
          <div ref={printRef} style={{ width: '595px' }}>
            {/* Front 6 Full Bleed Image Pages */}
            {downloadScope === 'full' && (
              <>
                {[
                  { src: '/assets/images/cover.png', alt: 'غلاف الرواية' },
                  { src: '/assets/images/title_art.png', alt: 'أغنية الملح والظلال' },
                  { src: '/assets/images/map_1.png', alt: 'خريطة العالم - الجزء الأول' },
                  { src: '/assets/images/map_2.png', alt: 'خريطة العالم - الجزء الثاني' },
                  { src: '/assets/images/quote_art.png', alt: 'اقتباس مميز' },
                  { src: '/assets/images/ship_divider.png', alt: 'سفينة نوكتيس' },
                ].map((img, idx) => (
                  <div key={`full-bleed-${idx}`} style={{
                    width: '595px',
                    height: '842px',
                    backgroundColor: '#ffffff',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box'
                  }}>
                    <img 
                      src={img.src} 
                      alt={img.alt}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/images/ship_divider.png";
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ))}

                {/* Page 7: Sama Dedication & Romance Page */}
                {(() => {
                  globalPageCounter++;
                  return (
                    <div style={{
                      ...pageContainerStyle,
                      backgroundColor: '#fef2f2',
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '50px',
                        position: 'relative'
                      }}>
                        <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '20px', opacity: 0.2 }}>⚓ ⛵</div>
                        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '20px', opacity: 0.2 }}>🌹 🌊</div>

                        <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px' }}>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', fontFamily: 'Amiri', marginBottom: '8px' }}>
                            إهداء خاص وعشق لأبنتي
                          </div>
                          <p style={{ fontSize: '18px', lineHeight: '2.1', color: '#991b1b', fontFamily: 'Amiri', margin: 0, fontWeight: 'bold' }}>
                            صنعت ورتبت وصممت لأجلك يا سما
                          </p>
                          <p style={{ fontSize: '16px', lineHeight: '2.0', color: '#7f1d1d', fontFamily: 'Amiri', margin: 0 }}>
                            ذكرى من القلب وحبيب القلب محمد أبو السعود
                          </p>
                          <p style={{ fontSize: '15px', lineHeight: '2.0', color: '#991b1b', fontFamily: 'Amiri', margin: 0 }}>
                            يا أجمل نعمة في حياتي، استمتعي وابتسمي فهي مصنوعة لأجلك يا سمسمتي وحدكِ.
                          </p>
                          <p style={{ fontSize: '15px', lineHeight: '2.0', color: '#b91c1c', fontFamily: 'Amiri', fontStyle: 'italic', margin: 0 }}>
                            يا قمر البحار ودرة القلوب، يا من ملكتِ الروح والنبض.. أهدي إليكِ بحار العشق وغيمات الغزل، فأنتِ الرواية الأبدية التي تكتمل بابتسامتك ووجودك الساحر في حياتي.
                          </p>

                          <div style={{ marginTop: '20px', padding: '10px 20px', border: '1px solid #fecaca', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '15px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                            ♡SM♡Sama♡Mohamed Abu AlSaud♡
                          </div>
                        </div>
                        
                        <div style={{ position: 'absolute', bottom: '20px', width: 'calc(100% - 40px)', display: 'flex', justifyContent: 'space-between', color: '#f87171', fontSize: '11px', fontFamily: 'Amiri' }}>
                          <span>♡SM♡Sama♡Mohamed Abu AlSaud♡</span>
                          <span>صفحة {globalPageCounter}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {activeChapters.map((ch) => {
              const pages = paginateText(ch.contentAr, 8);
              return (
                <React.Fragment key={ch.id}>
                  {/* Chapter Header Page */}
                  {(() => {
                    globalPageCounter++;
                    return (
                      <div style={pageContainerStyle}>
                        <div style={innerBorderStyle}>
                          <div style={decorativeCorner('tl')}></div>
                          <div style={decorativeCorner('tr')}></div>
                          <div style={decorativeCorner('bl')}></div>
                          <div style={decorativeCorner('br')}></div>
                          
                          <div style={{ position: 'absolute', top: '15px', right: '25px', fontSize: '14px', opacity: 0.3 }}>⚓</div>
                          <div style={{ position: 'absolute', top: '15px', left: '25px', fontSize: '14px', opacity: 0.3 }}>⛵</div>

                          <div style={{ textAlign: 'center', width: '100%' }}>
                            <span style={{ fontSize: '12px', color: '#0d9488', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>الفصل الجديد • New Chapter</span>
                            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', fontFamily: 'Amiri', marginTop: '10px', marginBottom: '8px' }}>{ch.titleAr}</h1>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', fontStyle: 'italic' }}>{ch.titleEn}</p>
                            
                            <div style={{ width: '100%', height: '310px', backgroundColor: '#f8fafc', borderRadius: '16px', overflow: 'hidden', border: '2px solid #cbd5e1', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                              <img 
                                src={`/assets/images/ch${ch.id}_illustration.jpg`} 
                                alt=""
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/assets/images/ship_divider.png";
                                  (e.target as HTMLImageElement).style.objectFit = 'contain';
                                  (e.target as HTMLImageElement).style.opacity = '0.6';
                                }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.05) brightness(1.02)' }} 
                              />
                            </div>
                            
                            <p style={{ fontSize: '13px', color: '#0f766e', fontWeight: 'bold' }}>الموقع البحري: {ch.seaLocation}</p>
                          </div>
                          
                          <div style={{ position: 'absolute', bottom: '20px', width: 'calc(100% - 40px)', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px', fontFamily: 'Amiri' }}>
                            <span>♡SM♡Sama♡Mohamed Abu AlSaud♡</span>
                            <span>صفحة {globalPageCounter}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Text Pages */}
                  {pages.map((lines, pIdx) => {
                    globalPageCounter++;
                    return (
                      <div key={`${ch.id}-p${pIdx}`} style={pageContainerStyle}>
                        <div style={innerBorderStyle}>
                          <div style={decorativeCorner('tl')}></div>
                          <div style={decorativeCorner('tr')}></div>
                          <div style={decorativeCorner('bl')}></div>
                          <div style={decorativeCorner('br')}></div>

                          <div style={{ position: 'absolute', top: '15px', right: '25px', fontSize: '12px', opacity: 0.25 }}>🌊</div>
                          <div style={{ position: 'absolute', top: '15px', left: '25px', fontSize: '12px', opacity: 0.25 }}>🌹</div>

                          <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                            {lines.map((line, lIdx) => (
                              <p key={lIdx} style={{ fontSize: '19px', lineHeight: '2.3', color: '#1e293b', textAlign: 'center', fontFamily: 'Amiri', margin: 0, minHeight: '45px' }}>
                                {line}
                              </p>
                            ))}
                          </div>

                          <div style={{ position: 'absolute', bottom: '20px', width: 'calc(100% - 40px)', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px', fontFamily: 'Amiri' }}>
                            <span>♡SM♡Sama♡Mohamed Abu AlSaud♡</span>
                            <span>صفحة {globalPageCounter}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 20px; }
      `}</style>
    </div>
  );
}
