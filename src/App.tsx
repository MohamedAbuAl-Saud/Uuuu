import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ReaderView from './components/ReaderView';
import WorldMapModal from './components/WorldMapModal';
import ShipExplorerModal from './components/ShipExplorerModal';
import CrewDirectoryModal from './components/CrewDirectoryModal';
import PDFViewerModal from './components/PDFViewerModal';
import ArabicPDFExporterModal from './components/ArabicPDFExporterModal';
import AISummarizerModal from './components/AISummarizerModal';
import SearchModal from './components/SearchModal';
import SettingsModal, { ReaderSettings } from './components/SettingsModal';
import { ALL_CHAPTERS, NOVEL_META } from './data/novelData';

export default function App() {
  const [currentChapterId, setCurrentChapterId] = useState<number | string>(1);
  const [isDualLanguage, setIsDualLanguage] = useState(false);

  // Modals state
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isShipOpen, setIsShipOpen] = useState(false);
  const [isCrewOpen, setIsCrewOpen] = useState(false);
  const [isOriginalPdfOpen, setIsOriginalPdfOpen] = useState(false);
  const [isArabicPdfOpen, setIsArabicPdfOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Reader Settings State
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    theme: 'dark',
    fontFamily: 'Amiri',
    fontSize: 18,
    lineHeight: 1.9,
  });

  const currentChapter = ALL_CHAPTERS.find(c => String(c.id) === String(currentChapterId)) || ALL_CHAPTERS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Navigation Header */}
      <Navbar
        currentChapterId={currentChapterId}
        onSelectChapter={(id) => setCurrentChapterId(id)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenShip={() => setIsShipOpen(true)}
        onOpenCrew={() => setIsCrewOpen(true)}
        onOpenPdf={() => setIsArabicPdfOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDualLanguage={isDualLanguage}
        onToggleDualLanguage={() => setIsDualLanguage(!isDualLanguage)}
      />

      {/* Main Ebook Reader View */}
      <div className="flex-1">
        <ReaderView
          chapter={currentChapter}
          onSelectChapter={(id) => setCurrentChapterId(id)}
          settings={readerSettings}
          onOpenAi={() => setIsAiOpen(true)}
        />
      </div>

      {/* Interactive Modals */}
      <WorldMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      <ShipExplorerModal
        isOpen={isShipOpen}
        onClose={() => setIsShipOpen(false)}
      />

      <CrewDirectoryModal
        isOpen={isCrewOpen}
        onClose={() => setIsCrewOpen(false)}
      />

      {/* Arabic Translated Printable PDF Modal */}
      <ArabicPDFExporterModal
        isOpen={isArabicPdfOpen}
        onClose={() => setIsArabicPdfOpen(false)}
      />

      {/* Original PDF Manuscript Viewer */}
      <PDFViewerModal
        isOpen={isOriginalPdfOpen}
        onClose={() => setIsOriginalPdfOpen(false)}
        pdfPath={NOVEL_META.coverImage}
      />

      <AISummarizerModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentChapterTitle={currentChapter.titleAr}
        currentChapterSummary={currentChapter.summaryAr}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChapter={(id) => setCurrentChapterId(id)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={readerSettings}
        onChangeSettings={(s) => setReaderSettings(s)}
      />
    </div>
  );
}
