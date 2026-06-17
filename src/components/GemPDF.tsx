import React, { useState } from "react";
import { BookOpen, Search, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface DocumentPage {
  title: string;
  category: string;
  content: string[];
}

export default function GemPDF() {
  const [activePage, setActivePage] = useState(0);

  const pages: DocumentPage[] = [
    {
      title: "gemstoneOS 2000 System Overview",
      category: "Introduction",
      content: [
        "Welcome to gemstoneOS 2000 Svalbard Under Construction Edition!",
        "This retro operating system replicates the cozy, high-fidelity window environment of early Windows 2000/98 systems, coupled with real mineral diagnostics and geological tools.",
        "Your workspace includes double-bevel custom action buttons, retro title bar gradients, a functional floating virtual AI assistant, a modular sound card, and multiple offline programs designed to run perfectly inside our sandbox container.",
        "Enjoy browsing system specs, mining minerals, drawing canvas designs, or editing logs in our secure, authentic Svalbard computing portal."
      ]
    },
    {
      title: "Crystalline Mining Secrets",
      category: "Mining Guide",
      content: [
        "Svalbard and Jan Mayen host intense depths of subterranean geological gemstone deposits, mostly sapphire and agate clumps.",
        "For peak mining speed in Mineral Clicker:",
        "1. Focus on upgrading 'Supercrystalline Laser Arrays' to boost your Gems-per-second autonomously.",
        "2. Thermal drilling rigs should be configured at 45° latitude angles for optimal rock crust penetration levels.",
        "3. Watch out for deep seismic shakes in weather radars that might disrupt turbine speeds temporarily."
      ]
    },
    {
      title: "Interactive Cheat Codes",
      category: "Secrets Panel",
      content: [
        "Uncover buried command functions inside the Net Explorer and GemTerminal prompts!",
        "In GemTerminal, you can try typing several special commands:",
        "• 'matrix' or 'hack' - loads falling green streams of secure hex telemetry.",
        "• 'color cyan' - changes your CLI interface color schema instantly.",
        "• 'launch calc' - launches the space-calc program straight from command lists.",
        "• 'fortune' - returns humorous nostalgic wisdom logs."
      ]
    }
  ];

  const currentPage = pages[activePage] || pages[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-gem-pdf">
      {/* Top PDF Ribbon Menu */}
      <div className="bg-[#dfdfdf] p-2 border-b border-[#808080] flex justify-between items-center select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <BookOpen size={14} className="text-blue-900" />
          <span className="text-xs font-bold text-gray-800">SVALBARD_USER_GUIDE.PDF</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-700">
          <span>Page:</span>
          <span className="font-bold underline">{activePage + 1}</span>
          <span>of {pages.length}</span>
        </div>
      </div>

      {/* Main PDF Content book views */}
      <div className="flex-1 min-h-0 p-3.5 bg-neutral-600 flex justify-center items-start overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-lg bg-white p-6 md:p-8 shadow-2xl retro-border-inset select-text min-h-[280px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-[#000080] bg-[#000080]/10 px-2 py-0.5 rounded uppercase font-bold">
                {currentPage.category}
              </span>
              <span className="text-[10px] font-mono text-gray-500">REV: 2.0.4</span>
            </div>

            <h3 className="text-base font-extrabold text-[#000080] font-sans">
              {currentPage.title}
            </h3>

            <div className="text-xs text-stone-800 leading-relaxed font-sans space-y-3 pt-1">
              {currentPage.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-150 pt-4 flex justify-between items-center mt-6 text-[10px] text-gray-500 font-mono select-none">
            <span>Svalbard Press Bureau © 2000</span>
            <span>OS Guide PDF Reader</span>
          </div>
        </div>
      </div>

      {/* Navigation Footer Toolbar */}
      <div className="p-2.5 bg-[#dfdfdf] border-t border-[#808080] shrink-0 select-none flex justify-between items-center">
        <div className="flex gap-1.5">
          <button
            onClick={() => setActivePage(p => Math.max(0, p - 1))}
            disabled={activePage === 0}
            className="retro-button !py-1 flex items-center gap-1 text-[11px]"
            title="Previous Page"
          >
            <ArrowLeft size={11} />
            <span>Prev</span>
          </button>
          <button
            onClick={() => setActivePage(p => Math.min(pages.length - 1, p + 1))}
            disabled={activePage === pages.length - 1}
            className="retro-button !py-1 flex items-center gap-1 text-[11px]"
            title="Next Page"
          >
            <span>Next</span>
            <ArrowRight size={11} />
          </button>
        </div>

        <span className="text-[10px] font-mono text-gray-650 flex items-center gap-1">
          <Sparkles size={11} className="text-cyan-800" />
          <span>Manual Reader Core v2.0</span>
        </span>
      </div>
    </div>
  );
}
