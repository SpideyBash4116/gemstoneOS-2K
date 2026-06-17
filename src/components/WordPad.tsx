import React, { useState } from "react";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, FileText, Sparkles, Printer } from "lucide-react";

export default function WordPad() {
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [title, setTitle] = useState("Svalbard_Mining_Proposal.doc");

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const handlePrint = () => {
    alert(`Document '${title}' successfully dispatched to virtual Svalbard Laser Jet II printer queue!`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-gem-wordpad">
      {/* Ribbon Control Menu bar */}
      <div className="bg-[#dfdfdf] p-2 border-b border-[#808080] flex flex-wrap gap-2.5 items-center select-none shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="retro-input !bg-white !font-sans text-xs font-bold w-48 shrink-0 py-0.5"
          placeholder="proposal.doc"
          title="Document Title"
        />

        <div className="h-[18px] w-[1px] bg-gray-400 self-center" />

        {/* Font Select */}
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="retro-border-outset bg-[#c0c0c0] text-xs h-[22px] px-1 outline-none font-sans cursor-default"
          title="Select Font Family"
        >
          <option value="font-sans">Inter Sans</option>
          <option value="font-display">Space Grotesk</option>
          <option value="font-mono">JetBrains Mono</option>
        </select>

        <div className="h-[18px] w-[1px] bg-gray-400 self-center" />

        {/* Formats */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsBold(p => !p)}
            className={`retro-button !p-1.5 h-[22px] w-[22px] ${isBold ? "bg-stone-300 border-inset" : ""}`}
            title="Bold"
          >
            <Bold size={11} className="font-bold" />
          </button>
          <button
            onClick={() => setIsItalic(p => !p)}
            className={`retro-button !p-1.5 h-[22px] w-[22px] ${isItalic ? "bg-stone-300 border-inset" : ""}`}
            title="Italic"
          >
            <Italic size={11} className="italic" />
          </button>
        </div>

        <div className="h-[18px] w-[1px] bg-gray-400 self-center" />

        {/* Alignments */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setAlignment("left")}
            className={`retro-button !p-1.5 h-[22px] w-[22px] ${alignment === "left" ? "bg-stone-300 border-inset" : ""}`}
            title="Align Left"
          >
            <AlignLeft size={11} />
          </button>
          <button
            onClick={() => setAlignment("center")}
            className={`retro-button !p-1.5 h-[22px] w-[22px] ${alignment === "center" ? "bg-stone-300 border-inset" : ""}`}
            title="Align Center"
          >
            <AlignCenter size={11} />
          </button>
          <button
            onClick={() => setAlignment("right")}
            className={`retro-button !p-1.5 h-[22px] w-[22px] ${alignment === "right" ? "bg-stone-300 border-inset" : ""}`}
            title="Align Right"
          >
            <AlignRight size={11} />
          </button>
        </div>

        <div className="h-[18px] w-[1px] bg-gray-400 self-center" />

        {/* Print Option */}
        <button
          onClick={handlePrint}
          className="retro-button !py-1 flex items-center gap-1 active:scale-[0.98]"
          title="Print Document"
        >
          <Printer size={11.5} />
          <span>Print</span>
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 p-3 bg-stone-100 flex flex-col">
        <div className="flex-1 bg-white retro-border-inset p-3 shadow-inner relative overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`w-full h-full border-none outline-none leading-relaxed resize-none focus:bg-white select-text ${fontFamily} ${
              alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
            } ${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""} text-sm`}
            placeholder="Review and polish your official Svalbard gemstone extraction proposals here..."
          />
        </div>
      </div>

      {/* Footer bar */}
      <div className="p-2 bg-[#dfdfdf] border-t border-[#808080] text-[10.5px] text-gray-700 font-mono flex justify-between items-center select-none shrink-0">
        <span className="flex items-center gap-1">
          <FileText size={11} />
          <span>Words count: {wordCount}</span>
        </span>
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-amber-600" />
          <span>PRO TEXT: WordPad v2.00</span>
        </span>
      </div>
    </div>
  );
}
