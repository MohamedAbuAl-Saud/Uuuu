import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfPath: string;
}

export default function PDFViewerModal({ isOpen, onClose, pdfPath }: PDFViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdfPath });
        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError('تعذر تحميل ملف الـ PDF الأصلي في المعاين.');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [isOpen, pdfPath]);

  useEffect(() => {
    if (!isOpen || !pdfDocRef.current || loading) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDocRef.current!.getPage(pageNumber);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };

        await page.render(renderContext).promise;
      } catch {
        // ignore
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, pageNumber, scale, loading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-['Amiri']">معاين المخطوطة والمستند الأصلي (PDF)</h2>
              <p className="text-xs text-slate-400">تصفح الرواية الأصلية باللغة الإنكليزية مع الصور والتوضيحات الأصيلة</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={pdfPath}
              download="The_Song_of_Salt_and_Shadow.pdf"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1.5 transition"
              title="تحميل الملف الأصلي"
            >
              <Download className="w-4 h-4" /> تحميل PDF
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span>
              الصفحة <strong className="text-emerald-400">{pageNumber}</strong> من <strong className="text-slate-200">{numPages}</strong>
            </span>
            <button
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded transition"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span>{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(2.5, s + 0.2))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded transition"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Canvas Viewport */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 flex justify-center items-center">
          {loading && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-slate-400">جاري تحميل المستند الأصلي...</p>
            </div>
          )}

          {error && (
            <div className="text-center p-6 bg-slate-900 border border-slate-800 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-white">
              <canvas ref={canvasRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
