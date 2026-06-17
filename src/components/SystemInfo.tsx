import React, { useState } from "react";
import { Cpu, ShieldCheck, Database, Compass, Radio } from "lucide-react";

export default function SystemInfo() {
  const [activeTab, setActiveTab] = useState<"specs" | "registry">("specs");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-system-info">
      <div className="flex border-b border-[#808080] bg-[#dfdfdf] p-1 gap-1 shrink-0 select-none">
        <button
          onClick={() => setActiveTab("specs")}
          className={`px-3 py-1 text-xs font-semibold border ${
            activeTab === "specs"
              ? "bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#c0c0c0] shadow-[-1px_-1px_0px_#dfdfdf]"
              : "bg-[#dfdfdf] border-transparent hover:bg-gray-100"
          }`}
        >
          General Specs
        </button>
        <button
          onClick={() => setActiveTab("registry")}
          className={`px-3 py-1 text-xs font-semibold border ${
            activeTab === "registry"
              ? "bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#c0c0c0] shadow-[-1px_-1px_0px_#dfdfdf]"
              : "bg-[#dfdfdf] border-transparent hover:bg-gray-100"
          }`}
        >
          Mine Registry
        </button>
      </div>

      <div className="flex-1 min-h-0 p-3 overflow-y-auto">
        {activeTab === "specs" ? (
          <div className="space-y-3">
            <div className="flex gap-3 bg-white p-3 retro-border-inset shadow-sm">
              <Cpu size={32} className="text-blue-900 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-sm block text-[#000080]">gemstoneOS Compute Specs</span>
                <p className="text-gray-600 mt-1">Processed securely using a virtual Intel Pentium II 450MHz, configured with 10 classic app pipelines and double-bevel styling boards.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono leading-relaxed bg-[#dfdfdf] p-2.5 retro-border-inset">
              <div>
                <strong className="text-indigo-900 block font-sans">💻 CORE HARDWARE</strong>
                <p>Processor: x86 Compatible Family 6 Model 5</p>
                <p>Total Memory: 65,536 KB System RAM</p>
                <p>Video Controller: PCI S3 Trio64V+ (4MB VRAM)</p>
                <p>System Clock: Real-Time Svalbard UTC Ticker</p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-gray-400 pt-2 sm:pt-0 sm:pl-3">
                <strong className="text-emerald-900 block font-sans">❄️ REGION CHARACTERISTICS</strong>
                <p>Geolocation: Svalbard Archipelago (Spitsbergen)</p>
                <p>Latitude: 78.9° N | Longitude: 15.6° E</p>
                <p>Average Glacial Density: 99.42%</p>
                <p>Secondary Support: Longyearbyen Station</p>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-950 p-2.5 border border-emerald-350 rounded text-xs flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
              <span>Diagnostic System core has been checked. System temperature and RAM are certified highly stable.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2.5 items-center text-xs font-bold text-gray-800">
              <Database size={14} className="text-purple-800" />
              <span>SVALBARD MINE REGISTRY FILES</span>
            </div>

            <div className="bg-white retro-border-inset p-3 overflow-x-auto">
              <table className="w-full text-left font-mono text-[10.5px]">
                <thead>
                  <tr className="border-b border-gray-300 font-sans font-bold text-stone-700">
                    <th className="pb-1">Mine Node</th>
                    <th className="pb-1">Mineral Class</th>
                    <th className="pb-1">Peak Hardness</th>
                    <th className="pb-1">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-1.5 font-sans font-semibold">Node 01: Glacier Shaft</td>
                    <td>Blue Sapphire</td>
                    <td>9.0 Mohs</td>
                    <td className="text-emerald-800 font-bold">ACTIVE</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans font-semibold">Node 02: Ice Core Ridge</td>
                    <td>Frozen Amethyst</td>
                    <td>7.0 Mohs</td>
                    <td className="text-amber-800 font-bold">STANDBY</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans font-semibold">Node 03: Coal Basin Delta</td>
                    <td>Obsidian Jet</td>
                    <td>6.5 Mohs</td>
                    <td className="text-blue-900 font-bold">CALIBRATING</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-[10px] select-none text-stone-700 font-mono">
              <div className="p-2 bg-slate-100 border border-gray-350 flex items-center gap-1.5 justify-center">
                <Compass size={12} className="text-indigo-850" />
                <span>Drill Angle: 45.8°</span>
              </div>
              <div className="p-2 bg-slate-100 border border-gray-350 flex items-center gap-1.5 justify-center">
                <Radio size={12} className="text-red-750 animate-ping" />
                <span>Nodes Ping: 42ms</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
