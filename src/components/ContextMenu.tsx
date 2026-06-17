import React, { useState, useRef, useEffect } from "react";
import {
  RotateCw,
  FolderPlus,
  FilePlus,
  Image,
  Sparkles,
  Terminal,
  Activity,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Folder,
  FileText,
  Mic,
  Monitor,
} from "lucide-react";
import { AppType, WallpaperPreset } from "../types";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onLaunchApp: (appId: AppType) => void;
  onSetWallpaper: (preset: WallpaperPreset) => void;
  currentWallpaper: WallpaperPreset;
  onActivateScreensaver: () => void;
  onCrash: (msg: string) => void;
  onRefresh: () => void;
  onAddFolder: () => void;
  onAddTextFile: () => void;
  onReboot: () => void;
  playClick: () => void;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onLaunchApp,
  onSetWallpaper,
  currentWallpaper,
  onActivateScreensaver,
  onCrash,
  onRefresh,
  onAddFolder,
  onAddTextFile,
  onReboot,
  playClick,
}: ContextMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<"new" | "wallpaper" | "system" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  // Adjust menu position if it overflows the window boundaries
  const [adjustedX, setAdjustedX] = useState(x);
  const [adjustedY, setAdjustedY] = useState(y);

  useEffect(() => {
    if (menuRef.current) {
      const menuWidth = 190;
      const menuHeight = 280;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let nextX = x;
      let nextY = y;

      if (x + menuWidth > screenWidth) {
        nextX = screenWidth - menuWidth - 4;
      }
      if (y + menuHeight > screenHeight) {
        nextY = screenHeight - menuHeight - 4;
      }

      setAdjustedX(Math.max(4, nextX));
      setAdjustedY(Math.max(4, nextY));
    }
  }, [x, y]);

  const handleAction = (callback: () => void) => {
    playClick();
    callback();
    onClose();
  };

  const wallpapers: { id: WallpaperPreset; label: string; bg: string }[] = [
    { id: "under-construction", label: "Svalbard Construction", bg: "bg-amber-500" },
    { id: "teal", label: "Arctic Teal", bg: "bg-[#0d5c5c]" },
    { id: "win95-classic", label: "Classic Cyan (95)", bg: "bg-[#008080]" },
    { id: "space-stars", label: "Space Starfield", bg: "bg-slate-900" },
    { id: "gradient-sunset", label: "Svalbard Twilight", bg: "bg-orange-800" },
    { id: "retro-brick", label: "Retro Brick Wall", bg: "bg-[#c0392b]" },
    { id: "hot-pink", label: "Hot Velvet Pink", bg: "bg-pink-600" },
    { id: "lavender", label: "Northern Lavender", bg: "bg-indigo-300" },
  ];

  return (
    <div
      ref={menuRef}
      id="retro-desktop-context-menu"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      className="fixed w-[185px] bg-[#c0c0c0] retro-border-outset p-0.5 select-none z-[9999] shadow-2xl text-[11px] font-sans text-black flex flex-col"
    >
      {/* 1. Refresh option */}
      <button
        onClick={() => handleAction(onRefresh)}
        className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default shrink-0 focus:outline-none"
      >
        <RotateCw size={12} className="text-blue-900 group-hover:text-white shrink-0" />
        <span className="font-semibold flex-1">Refresh Desktop</span>
        <span className="text-gray-500 hover:text-white font-mono text-[9px]">F5</span>
      </button>

      <div className="h-[1px] bg-gray-400 my-0.5 shrink-0" />

      {/* 2. New submenu */}
      <div
        className="relative shrink-0"
        onMouseEnter={() => setActiveSubmenu("new")}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <button
          className={`w-full text-left px-3 py-1.5 flex items-center justify-between cursor-default focus:outline-none ${
            activeSubmenu === "new" ? "bg-[#000080] text-white" : "hover:bg-[#000080] hover:text-white text-black"
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderPlus size={12} className="text-yellow-600 shrink-0" />
            <span className="font-semibold">New Creation</span>
          </div>
          <ChevronRight size={10} className="shrink-0 opacity-80" />
        </button>

        {activeSubmenu === "new" && (
          <div className="absolute left-[180px] top-[-2px] w-[150px] bg-[#c0c0c0] retro-border-outset p-0.5 flex flex-col shadow-2xl z-[10001]">
            <button
              onClick={() => handleAction(onAddFolder)}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default focus:outline-none"
            >
              <Folder size={12} className="text-amber-700 shrink-0" />
              <span className="font-semibold">New Folder</span>
            </button>
            <button
              onClick={() => handleAction(onAddTextFile)}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default focus:outline-none"
            >
              <FileText size={12} className="text-slate-700 shrink-0" />
              <span className="font-semibold">Text Document</span>
            </button>
            <button
              onClick={() => handleAction(() => onLaunchApp("sound_recorder"))}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default focus:outline-none"
            >
              <Mic size={12} className="text-red-700 shrink-0" />
              <span className="font-semibold">Tape Recording</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Wallpaper settings submenu */}
      <div
        className="relative shrink-0"
        onMouseEnter={() => setActiveSubmenu("wallpaper")}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <button
          className={`w-full text-left px-3 py-1.5 flex items-center justify-between cursor-default focus:outline-none ${
            activeSubmenu === "wallpaper" ? "bg-[#000080] text-white" : "hover:bg-[#000080] hover:text-white text-black"
          }`}
        >
          <div className="flex items-center gap-2">
            <Image size={12} className="text-[#008080] shrink-0" />
            <span className="font-semibold">Desktop Wallpaper</span>
          </div>
          <ChevronRight size={10} className="shrink-0 opacity-80" />
        </button>

        {activeSubmenu === "wallpaper" && (
          <div className="absolute left-[180px] top-[-2px] w-[170px] bg-[#c0c0c0] retro-border-outset p-0.5 flex flex-col shadow-2xl z-[10001]">
            <div className="px-2 py-1 text-[9px] text-gray-500 font-bold tracking-wider border-b border-gray-400 mb-1">
              SELECT ACTIVE MATRIX:
            </div>
            {wallpapers.map((wp) => (
              <button
                key={wp.id}
                onClick={() => handleAction(() => onSetWallpaper(wp.id))}
                className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between gap-1 cursor-default focus:outline-none"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-3 h-3 ${wp.bg} border border-gray-600 rounded-sm shrink-0`} />
                  <span className={`font-semibold truncate ${currentWallpaper === wp.id ? "text-blue-900 hover:text-white underline" : ""}`}>
                    {wp.label}
                  </span>
                </div>
                {currentWallpaper === wp.id && (
                  <span className="text-[9px] text-green-700 font-bold shrink-0">●</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Core System Actions submenu */}
      <div
        className="relative shrink-0"
        onMouseEnter={() => setActiveSubmenu("system")}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <button
          className={`w-full text-left px-3 py-1.5 flex items-center justify-between cursor-default focus:outline-none ${
            activeSubmenu === "system" ? "bg-[#000080] text-white" : "hover:bg-[#000080] hover:text-white text-black"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sliders size={12} className="text-indigo-950 shrink-0" />
            <span className="font-semibold">System Utilities</span>
          </div>
          <ChevronRight size={10} className="shrink-0 opacity-80" />
        </button>

        {activeSubmenu === "system" && (
          <div className="absolute left-[180px] top-[-2px] w-[160px] bg-[#c0c0c0] retro-border-outset p-0.5 flex flex-col shadow-2xl z-[10001]">
            <button
              onClick={() => handleAction(() => onLaunchApp("terminal"))}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default focus:outline-none"
            >
              <Terminal size={12} className="text-neutral-800 shrink-0" />
              <span className="font-semibold">GemTerminal CLI</span>
            </button>
            <button
              onClick={() => handleAction(() => onLaunchApp("task_manager"))}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default focus:outline-none"
            >
              <Activity size={12} className="text-emerald-950 shrink-0" />
              <span className="font-semibold">Task Manager</span>
            </button>
            <button
              onClick={() => handleAction(() => onLaunchApp("sys_info"))}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default focus:outline-none"
            >
              <Monitor size={12} className="text-slate-800 shrink-0" />
              <span className="font-semibold">Diagnostics Log</span>
            </button>
            <button
              onClick={() => handleAction(onActivateScreensaver)}
              className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default focus:outline-none"
            >
              <Sparkles size={12} className="text-violet-800 shrink-0" />
              <span className="font-semibold">Lock Screensaver</span>
            </button>
            <div className="h-[1px] bg-gray-400 my-0.5 shrink-0" />
            <button
              onClick={() =>
                handleAction(() =>
                  onCrash(
                    "FATAL ERROR EXCEPTION 0xC0000005: Memory allocation breach at sector 0xAA98F0BD. Kernel panic induced via desktop registry context."
                  )
                )
              }
              className="w-full text-left px-3 py-1.5 hover:bg-red-700 hover:text-white flex items-center gap-2 cursor-default text-red-750 focus:outline-none"
            >
              <ShieldAlert size={12} className="shrink-0" />
              <span className="font-semibold">Simulate OS Crash</span>
            </button>
          </div>
        )}
      </div>

      <div className="h-[1px] bg-gray-400 my-0.5 shrink-0" />

      {/* 5. Reboot System */}
      <button
        onClick={() => handleAction(onReboot)}
        className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-default shrink-0 focus:outline-none"
      >
        <RotateCw size={12} className="text-amber-800 shrink-0" />
        <span className="font-semibold">Reboot workstation</span>
      </button>

      {/* 6. Shutdown Workstation */}
      <button
        onClick={() => {
          handleAction(() => {
            // we will simulate the shutdown flow
            const event = new CustomEvent("shutdown-os");
            window.dispatchEvent(event);
          });
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-red-700 hover:text-white flex items-center gap-2 cursor-default text-red-750 shrink-0 focus:outline-none"
      >
        <LogOut size={12} className="shrink-0" />
        <span className="font-bold">Shutdown OS</span>
      </button>
    </div>
  );
}
