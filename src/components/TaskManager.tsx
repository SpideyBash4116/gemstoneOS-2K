import React, { useState, useEffect } from "react";
import { Activity, XCircle, RefreshCw } from "lucide-react";
import { WindowItem } from "../types";

interface TaskManagerProps {
  windows: { [key: string]: WindowItem | undefined };
  activeWindowId: string | null;
  onFocusApp: (id: string) => void;
  onCloseApp: (id: string) => void;
}

export default function TaskManager({
  windows,
  activeWindowId,
  onFocusApp,
  onCloseApp,
}: TaskManagerProps) {
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(38.2);
  const [history, setHistory] = useState<number[]>(Array(24).fill(12));
  const [activeTab, setActiveTab] = useState<"applications" | "performance">("applications");

  // Keep updating CPU statistics to simulate activity
  useEffect(() => {
    const timer = setInterval(() => {
      const activeCount = Object.values(windows).filter(w => w?.isOpen).length;
      const baseCpu = 2 + activeCount * 4;
      const randomVariance = Math.floor(Math.random() * 8) - 4;
      const nextUsage = Math.max(1, Math.min(99, baseCpu + randomVariance));
      
      setCpuUsage(nextUsage);
      setHistory(prev => [...prev.slice(1), nextUsage]);
      
      const baseRam = 16.4 + activeCount * 3.8;
      const ramVariance = (Math.random() * 0.8) - 0.4;
      setRamUsage(parseFloat(Math.max(8.0, Math.min(64.0, baseRam + ramVariance)).toFixed(1)));
    }, 1500);

    return () => clearInterval(timer);
  }, [windows]);

  const runningApps = Object.values(windows).filter(w => w?.isOpen && w.id !== "task_manager");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-task-manager">
      {/* Settings Tab Selector */}
      <div className="flex border-b border-[#808080] bg-[#dfdfdf] p-1 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-3 py-1 text-xs font-semibold border ${
            activeTab === "applications"
              ? "bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#c0c0c0] shadow-[-1px_-1px_0px_#dfdfdf]"
              : "bg-[#dfdfdf] border-transparent hover:bg-gray-100"
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={`px-3 py-1 text-xs font-semibold border ${
            activeTab === "performance"
              ? "bg-[#c0c0c0] border-t-white border-l-white border-r-[#808080] border-b-[#c0c0c0] shadow-[-1px_-1px_0px_#dfdfdf]"
              : "bg-[#dfdfdf] border-transparent hover:bg-gray-100"
          }`}
        >
          Performance
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 p-3 flex flex-col justify-between">
        {activeTab === "applications" ? (
          <div className="flex-1 flex flex-col min-h-0">
            <span className="text-xs text-gray-700 font-bold mb-1.5 flex items-center gap-1">
              <Activity size={12} className="text-emerald-800" />
              RUNNING PROCESSES ({runningApps.length})
            </span>
            
            <div className="flex-1 bg-white retro-border-inset overflow-y-auto mb-3 select-none">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="bg-[#dfdfdf] text-black border-b border-[#808080] font-sans font-bold">
                    <th className="p-1 px-2 border-r border-[#808080]">Task</th>
                    <th className="p-1 px-2 border-r border-[#808080]">Status</th>
                    <th className="p-1 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {runningApps.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500 italic">
                        No secondary applications currently active.
                      </td>
                    </tr>
                  ) : (
                    runningApps.map((app) => {
                      if (!app) return null;
                      return (
                        <tr
                          key={app.id}
                          className={`border-b border-[#dfdfdf] cursor-default ${
                            activeWindowId === app.id ? "bg-[#000080]/10" : "hover:bg-gray-50"
                          }`}
                          onClick={() => onFocusApp(app.id)}
                        >
                          <td className="p-1.5 px-2 font-semibold font-sans">{app.title.split("-")[0].trim()}</td>
                          <td className="p-1.5 px-2 text-emerald-800 font-bold">Running</td>
                          <td className="p-1 px-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCloseApp(app.id);
                              }}
                              className="bg-[#c0c0c0] hover:bg-red-700 hover:text-white px-2 py-0.5 border border-[#808080] active:border-white shadow-sm flex items-center gap-1 rounded-[1px] text-[9px] font-sans font-bold"
                            >
                              <XCircle size={10} />
                              End Task
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="text-[10px] text-gray-600 bg-yellow-50 p-2 border border-yellow-300 rounded leading-tight">
              <strong>💡 Pro Tip:</strong> Ending a task unmounts it instantly. You can reboot the system if any process becomes volatile!
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
            {/* CPU Graphs & Gauges */}
            <div className="p-3 bg-black text-[#39ff14] font-mono rounded retro-border-inset flex flex-col gap-2 shrink-0">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">CPU Usage: {cpuUsage}%</span>
                <span>Speed: 450 MHz (Pentium II Core)</span>
              </div>
              
              {/* Retro graph blocks */}
              <div className="h-16 border border-emerald-900 bg-neutral-950/90 relative flex items-end overflow-hidden p-[1px] gap-[2px]">
                {/* Horizontal guide grids */}
                <div className="absolute inset-0 grid grid-rows-4 pointer-events-none opacity-20">
                  <div className="border-b border-emerald-500 w-full" />
                  <div className="border-b border-emerald-500 w-full" />
                  <div className="border-b border-emerald-500 w-full" />
                </div>
                
                {history.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-[#39ff14]/75 border-t border-emerald-400"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
            </div>

            {/* RAM Status Gauge */}
            <div className="retro-border-inset bg-[#dfdfdf] p-3 flex flex-col gap-1.5">
              <div className="text-xs font-bold text-gray-800 flex justify-between">
                <span>Kernel RAM Memory Resource Usage</span>
                <span className="font-mono">{ramUsage} MB / 64 MB ({(ramUsage/64*100).toFixed(1)}%)</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="h-4 bg-white retro-border-inset flex relative overflow-hidden p-[1px]">
                <div
                  className="bg-gradient-to-r from-blue-900 to-indigo-600 h-full transition-all duration-1000"
                  style={{ width: `${(ramUsage / 64) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 text-[10px] text-gray-600 pt-1 font-mono gap-2 border-t border-gray-300">
                <div>Swap File Space: 124MB</div>
                <div>System File Caches: 12.8MB</div>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer Buttons */}
        <div className="flex justify-end gap-1.5 pt-3 border-t border-[#808080] shrink-0 select-none">
          <button
            onClick={() => {
              setCpuUsage(100);
              setTimeout(() => setCpuUsage(15), 1000);
            }}
            className="retro-button flex items-center gap-1 text-[10px]"
          >
            <RefreshCw size={11} />
            <span>Calibrate Sensor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
