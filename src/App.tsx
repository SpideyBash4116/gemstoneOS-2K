import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Monitor,
  FolderOpen,
  Bot,
  Paintbrush,
  Flame,
  Music,
  Settings,
  FileText,
  Globe,
  Terminal,
  Volume2,
  VolumeX,
  Play,
  Power,
  Search,
  X,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Menu,
  Clock,
  Calculator,
  Calendar,
  CloudSnow,
  Users,
  Mic,
  Activity,
  Cpu,
  BookOpen,
} from "lucide-react";

import RetroWindow from "./components/RetroWindow";
import Notepad from "./components/Notepad";
import GemSweeper from "./components/GemSweeper";
import GemPaint from "./components/GemPaint";
import MineralClicker from "./components/MineralClicker";
import GemTune from "./components/GemTune";
import ControlPanel from "./components/ControlPanel";
import GemmyChat from "./components/GemmyChat";
import InternetBrowser from "./components/InternetBrowser";
import Screensaver from "./components/Screensaver";
import CalculatorApp from "./components/Calculator";
import TaskManager from "./components/TaskManager";
import GemTerminal from "./components/GemTerminal";
import GemCalendar from "./components/GemCalendar";
import SvalbardWeather from "./components/SvalbardWeather";
import WordPad from "./components/WordPad";
import SystemInfo from "./components/SystemInfo";
import AddressBook from "./components/AddressBook";
import SoundRecorder from "./components/SoundRecorder";
import GemPDF from "./components/GemPDF";
import FileExplorer from "./components/FileExplorer";
import ContextMenu from "./components/ContextMenu";
import BiosSetup, { BiosConfig } from "./components/BiosSetup";
import { useSystemSounds } from "./hooks/useSystemSounds";

import { AppType, WindowItem, DesktopIcon, SystemSettings, WallpaperPreset } from "./types";

export default function App() {
  // --- SYSTEM STATES ---
  const [settings, setSettings] = useState<SystemSettings>({
    wallpaper: "under-construction",
    soundEnabled: true,
    screensaverTimeout: 60,
    screensaverType: "pipes",
    isShutDown: false,
  });

  const [activeWindowId, setActiveWindowId] = useState<string | null>("welcome");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [startMenuSearch, setStartMenuSearch] = useState("");
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [runCommandText, setRunCommandText] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [screensaverActive, setScreensaverActive] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [hoveredTaskbarInfo, setHoveredTaskbarInfo] = useState<{
    title: string;
    status?: string;
    desc: string;
    isMinimized?: boolean;
    appId?: string;
  } | null>(null);
  const [hoveredTaskbarRect, setHoveredTaskbarRect] = useState<{ left: number; top: number } | null>(null);

  // Z-Index Tracker to bring clicked windows to front
  const [maxZIndex, setMaxZIndex] = useState(10);

  const [bsodError, setBsodError] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [bootStep, setBootStep] = useState<number>(0);
  const [showBiosSetup, setShowBiosSetup] = useState<boolean>(false);
  const [biosConfig, setBiosConfig] = useState<BiosConfig>({
    cpuSpeed: 266,
    memorySize: 64,
    primaryIdeMaster: "FUJITSU MPC3032AT",
    primaryIdeSlave: "NONE",
    cpuVolt: 1.8,
    quietBoot: false,
    bootBeeps: true,
    glacierHeaterActive: false,
    glacierCoolingMode: "PASSIVE",
  });

  // --- WINDOW CONTROLS ---
  const [windows, setWindows] = useState<{ [key in AppType]?: WindowItem }>({
    welcome: {
      id: "welcome",
      title: "Welcome to gemstoneOS 2000 Svalbard Under Construction",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 60,
      y: 50,
      width: 460,
      height: 330,
      zIndex: 10,
    },
    my_computer: {
      id: "my_computer",
      title: "My Computer Info",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 100,
      y: 90,
      width: 440,
      height: 310,
      zIndex: 1,
    },
    gemmy: {
      id: "gemmy",
      title: "Gemmy - Virtual Assistant Core",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 150,
      y: 60,
      width: 580,
      height: 400,
      zIndex: 1,
    },
    minesweeper: {
      id: "minesweeper",
      title: "GemSweeper 3D",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 200,
      y: 40,
      width: 380,
      height: 480,
      zIndex: 1,
    },
    paint: {
      id: "paint",
      title: "GemPaint Canvas Studio",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 90,
      y: 70,
      width: 720,
      height: 520,
      zIndex: 1,
    },
    media_player: {
      id: "media_player",
      title: "GemTune synthesized MIDI sound deck",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 250,
      y: 120,
      width: 390,
      height: 420,
      zIndex: 1,
    },
    clicker: {
      id: "clicker",
      title: "Micro-Mine Clicker Rig v2.4",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 130,
      y: 80,
      width: 610,
      height: 450,
      zIndex: 1,
    },
    control_panel: {
      id: "control_panel",
      title: "Control Panel Properties",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 140,
      width: 520,
      height: 380,
      zIndex: 1,
    },
    notepad: {
      id: "notepad",
      title: "GemText Document Diary",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 120,
      y: 110,
      width: 550,
      height: 410,
      zIndex: 1,
    },
    internet: {
      id: "internet",
      title: "Net Explorer 1.97 Web Browser",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 80,
      y: 30,
      width: 680,
      height: 480,
      zIndex: 1,
    },
    calculator: {
      id: "calculator",
      title: "gemstoneOS Vintage Calculator",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 160,
      y: 100,
      width: 320,
      height: 340,
      zIndex: 1,
    },
    task_manager: {
      id: "task_manager",
      title: "Task Manager Console",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 140,
      y: 90,
      width: 450,
      height: 390,
      zIndex: 1,
    },
    terminal: {
      id: "terminal",
      title: "C:\\WINDOWS\\System32\\cmd.exe",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 100,
      y: 120,
      width: 530,
      height: 380,
      zIndex: 1,
    },
    calendar: {
      id: "calendar",
      title: "gemstoneOS Calendar logs",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 110,
      y: 80,
      width: 480,
      height: 340,
      zIndex: 1,
    },
    weather: {
      id: "weather",
      title: "Svalbard Outpost Meteorology",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 150,
      y: 130,
      width: 470,
      height: 350,
      zIndex: 1,
    },
    wordpad: {
      id: "wordpad",
      title: "WordPad - Elegant Word Processor",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 120,
      y: 80,
      width: 560,
      height: 440,
      zIndex: 1,
    },
    sys_info: {
      id: "sys_info",
      title: "Svalbard Hardware Diagnostics",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 160,
      y: 100,
      width: 440,
      height: 320,
      zIndex: 1,
    },
    address_book: {
      id: "address_book",
      title: "Address Book - Arctic Contacts",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 90,
      width: 530,
      height: 370,
      zIndex: 1,
    },
    sound_recorder: {
      id: "sound_recorder",
      title: "Sound Recorder - Tape deck",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 170,
      y: 120,
      width: 410,
      height: 340,
      zIndex: 1,
    },
    help_guide: {
      id: "help_guide",
      title: "Svalbard_Guide.pdf - Manual Reader",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 130,
      y: 120,
      width: 510,
      height: 410,
      zIndex: 1,
    },
    file_explorer: {
      id: "file_explorer",
      title: "gemstoneOS Explorer",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 95,
      y: 105,
      width: 550,
      height: 390,
      zIndex: 1,
    },
  });

  // --- SHORTCUTS SETUP ---
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([
    { id: "my_computer", label: "My Computer", iconName: "computer", color: "text-blue-900" },
    { id: "gemmy", label: "Gemmy Assistant", iconName: "gemmy", color: "text-amber-800" },
    { id: "file_explorer", label: "File Explorer", iconName: "file_explorer", color: "text-amber-900" },
    { id: "internet", label: "Net Explorer", iconName: "internet", color: "text-[#008080]" },
    { id: "clicker", label: "Mineral Clicker", iconName: "clicker", color: "text-emerald-800" },
    { id: "calculator", label: "Retro Calc", iconName: "calculator", color: "text-orange-950" },
    { id: "minesweeper", label: "GemSweeper", iconName: "minesweeper", color: "text-red-750" },
    { id: "paint", label: "GemPaint Canvas", iconName: "paint", color: "text-purple-700" },
    { id: "media_player", label: "GemTune Music", iconName: "media_player", color: "text-indigo-805" },
    { id: "notepad", label: "Diary Notepad", iconName: "notepad", color: "text-slate-800" },
    { id: "wordpad", label: "WordPad Doc", iconName: "wordpad", color: "text-blue-950" },
    { id: "task_manager", label: "Task Manager", iconName: "task_manager", color: "text-emerald-900" },
    { id: "terminal", label: "GemTerminal", iconName: "terminal", color: "text-neutral-800" },
    { id: "calendar", label: "Calendar", iconName: "calendar", color: "text-indigo-900" },
    { id: "weather", label: "Weather Outpost", iconName: "weather", color: "text-teal-700" },
    { id: "sys_info", label: "System Info", iconName: "sys_info", color: "text-stone-750" },
    { id: "address_book", label: "Address Book", iconName: "address_book", color: "text-red-900" },
    { id: "sound_recorder", label: "Sound Rec", iconName: "sound_recorder", color: "text-yellow-950" },
    { id: "help_guide", label: "Help Guide", iconName: "help_guide", color: "text-sky-900" },
    { id: "control_panel", label: "Control Panel", iconName: "control_panel", color: "text-gray-900" },
  ]);

  // --- TIME AND CLOCK TICKER ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- IDLE SCREENSAVER CHECK ---
  useEffect(() => {
    const handleActivity = () => {
      setIdleTime(0);
      if (screensaverActive) {
        setScreensaverActive(false);
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);

    const checkIdle = setInterval(() => {
      setIdleTime((prev) => {
        const nextIdle = prev + 1;
        if (nextIdle >= settings.screensaverTimeout && !screensaverActive) {
          setScreensaverActive(true);
        }
        return nextIdle;
      });
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      clearInterval(checkIdle);
    };
  }, [settings.screensaverTimeout, screensaverActive]);

  // Hook for full-system classic synths & wave synthesis audio
  const {
    playClick,
    playError,
    playStartup,
    playShutdown,
    playMinimize,
    playMaximize,
    playInfo,
  } = useSystemSounds(settings.soundEnabled);

  // Retro system compatible aliases
  const playBiosClick = playClick;
  const playBootSound = playStartup;
  const playErrorSound = playError;

  const rebootSystem = useCallback(() => {
    playBootSound();
    setBsodError(null);
    setIsBooting(true);
    setBootStep(0);
    setWindows((prev) => {
      const reset: typeof prev = {};
      Object.keys(prev).forEach((key) => {
        const app = key as AppType;
        reset[app] = {
          ...prev[app]!,
          isOpen: app === "welcome",
          isMinimized: false,
          isMaximized: false,
          zIndex: app === "welcome" ? 10 : 1,
        };
      });
      return reset;
    });
    setStartMenuOpen(false);
    setRunDialogOpen(false);
    setScreensaverActive(false);
    setActiveWindowId("welcome");
  }, [playBootSound]);

  // --- CONTEXT MENU HANDLERS ---
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    playClick();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 250);
  }, [playClick]);

  const handleSetWallpaper = useCallback((wp: WallpaperPreset) => {
    setSettings((prev) => ({ ...prev, wallpaper: wp }));
    playClick();
  }, [playClick]);

  const handleActivateScreensaver = useCallback(() => {
    setScreensaverActive(true);
    playClick();
  }, [playClick]);

  const handleCrashSystem = useCallback((msg: string) => {
    playErrorSound();
    setBsodError(msg);
  }, [playErrorSound]);

  const handleAddFolder = useCallback(() => {
    playClick();
    setDesktopIcons((prev) => {
      const folderNum = prev.filter((icon) => icon.label.startsWith("New Folder")).length;
      const label = folderNum === 0 ? "New Folder" : `New Folder (${folderNum + 1})`;
      return [
        ...prev,
        {
          id: "file_explorer",
          label,
          iconName: "file_explorer",
          color: "text-amber-700",
        },
      ];
    });
  }, [playClick]);

  const handleAddTextFile = useCallback(() => {
    playClick();
    setDesktopIcons((prev) => {
      const fileNum = prev.filter((icon) => icon.label.startsWith("New Note")).length;
      const label = fileNum === 0 ? "New Note.txt" : `New Note (${fileNum + 1}).txt`;
      return [
        ...prev,
        {
          id: "notepad",
          label,
          iconName: "notepad",
          color: "text-slate-800",
        },
      ];
    });
  }, [playClick]);

  // Handle Dispatch Shutdown Global Event
  useEffect(() => {
    const handleShutdownOS = () => {
      setStartMenuOpen(false);
      setContextMenu(null);
      setSettings((prev) => ({ ...prev, isShutDown: true }));
    };
    window.addEventListener("shutdown-os", handleShutdownOS);
    return () => window.removeEventListener("shutdown-os", handleShutdownOS);
  }, []);

  // BIOS Boot Simulation Step Timer
  useEffect(() => {
    if (!isBooting || showBiosSetup) return;

    if (biosConfig.quietBoot) {
      if (biosConfig.cpuSpeed === 1200 && biosConfig.glacierCoolingMode !== "NITROGEN") {
        setIsBooting(false);
        setBootStep(0);
        setBsodError("FATAL EXCEPTION 0xF441: SILICON LIQUEFACTION FAULT. Pentium II core temperature reached 115°C! Liquid Nitrogen cryogenic cooling mode was NOT enabled in BIOS setup utility to mitigate the 1.2GHz sub-zero frequency override!");
      } else {
        setIsBooting(false);
        setBootStep(0);
      }
      return;
    }

    const timer = setTimeout(() => {
      if (bootStep < 4) {
        setBootStep((prev) => prev + 1);
      } else {
        setIsBooting(false);
        setBootStep(0);
        if (biosConfig.cpuSpeed === 1200 && biosConfig.glacierCoolingMode !== "NITROGEN") {
          setBsodError("FATAL EXCEPTION 0xF441: SILICON LIQUEFACTION FAULT. Pentium II core temperature reached 115°C! Liquid Nitrogen cryogenic cooling mode was NOT enabled in BIOS setup utility to mitigate the 1.2GHz sub-zero frequency override!");
        }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [isBooting, bootStep, showBiosSetup, biosConfig]);

  // Escape key skipping diagnostic boot sequence
  useEffect(() => {
    if (!isBooting || showBiosSetup) return;
    const handleBootKeys = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsBooting(false);
        setBootStep(0);
      }
    };
    window.addEventListener("keydown", handleBootKeys);
    return () => window.removeEventListener("keydown", handleBootKeys);
  }, [isBooting, showBiosSetup]);

  // BSOD Keydown Listeners
  useEffect(() => {
    if (!bsodError) return;
    const handleBsodKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        setBsodError(null);
      } else if (e.key === "Delete" && e.ctrlKey && e.altKey) {
        e.preventDefault();
        rebootSystem();
      }
    };
    window.addEventListener("keydown", handleBsodKeys);
    return () => window.removeEventListener("keydown", handleBsodKeys);
  }, [bsodError, rebootSystem]);

  // --- WINDOW MANAGER EMITTERS ---
  const launchApp = useCallback((id: AppType) => {
    playBiosClick();
    setStartMenuOpen(false);
    
    // Calculate adaptive default window coords so they don't spawn completely stacked
    const modifierX = (Object.keys(windows).length * 15) % 150;
    const modifierY = (Object.keys(windows).length * 15) % 120;

    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    setWindows((prev) => {
      const win = prev[id];
      if (!win) return prev;
      return {
        ...prev,
        [id]: {
          ...win,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
          x: win.x === 0 ? 60 + modifierX : win.x,
          y: win.y === 0 ? 50 + modifierY : win.y,
        },
      };
    });
    setActiveWindowId(id);
  }, [maxZIndex, playBiosClick, windows]);

  const focusWindow = (id: string) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows((prev) => {
      const target = prev[id as AppType];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          isMinimized: false,
          zIndex: nextZ,
        },
      };
    });
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    playBiosClick();
    setWindows((prev) => {
      const target = prev[id as AppType];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          isOpen: false,
        },
      };
    });
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }

    // 15% Chance of retro System Error / BSOD on closing any window
    if (Math.random() < 0.15) {
      const errors = [
        "A fatal exception 0E has occurred at 0028:C0011C36 in VXD VMM(01) + 00010C36. Gemmy Core tried to digest a crystalline quartz deposit.",
        "An Exception 06 (Invalid Opcode) has occurred at 002B:00007A2E. Mineral Clicker rig hyper-threaded past tectonic speed margins.",
        "Fatal Exception 0D (General Protection Fault) at 005F:0D24B6A1. Net Explorer attempted to download more hardware RAM via 56k dial-up.",
        "Fatal Exception 0E at 0137:BFFA2109 in GemPaint. Too much 16-bit hue saturation detected on 1px canvas rasterizer pipeline.",
        "Stack Overflow in GemTune Synthesizer Core. Lethal dosage of nostalgic retro chiptune wave-synthesis has locked the soundcard.",
        "Critical Mineral Shortage. The gemstoneOS virtual mines have reached critical crystalline density. Physical structure collapsed."
      ];
      const randomMsg = errors[Math.floor(Math.random() * errors.length)];
      
      // Deliberate 300ms transition delay to simulate an operational hang before the abrupt blue crash screen
      setTimeout(() => {
        playErrorSound();
        setBsodError(randomMsg);
      }, 300);
    }
  };

  const minimizeWindow = (id: string) => {
    playMinimize();
    setWindows((prev) => {
      const target = prev[id as AppType];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          isMinimized: true,
        },
      };
    });
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: string) => {
    playMaximize();
    setWindows((prev) => {
      const target = prev[id as AppType];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          isMaximized: !target.isMaximized,
        },
      };
    });
  };

  const dragWindow = (id: string, x: number, y: number) => {
    setWindows((prev) => {
      const target = prev[id as AppType];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          x,
          y,
        },
      };
    });
  };

  const resizeWindow = (id: string, width: number, height: number) => {
    setWindows((prev) => {
      const target = prev[id as AppType];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          width,
          height,
        },
      };
    });
  };

  // Run shortcut prompt commands
  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = runCommandText.toLowerCase().trim();
    setRunDialogOpen(false);
    setRunCommandText("");

    if (cmd === "paint" || cmd === "draw") launchApp("paint");
    else if (cmd === "mines" || cmd === "minesweeper" || cmd === "sweeper") launchApp("minesweeper");
    else if (cmd === "gemmy" || cmd === "ai" || cmd === "chat") launchApp("gemmy");
    else if (cmd === "clicker" || cmd === "gems" || cmd === "miner") launchApp("clicker");
    else if (cmd === "music" || cmd === "player" || cmd === "tune") launchApp("media_player");
    else if (cmd === "notepad" || cmd === "text") launchApp("notepad");
    else if (cmd === "internet" || cmd === "web") launchApp("internet");
    else if (cmd === "control" || cmd === "settings") launchApp("control_panel");
    else if (cmd === "calc" || cmd === "calculator") launchApp("calculator");
    else if (cmd === "task" || cmd === "taskmgr" || cmd === "processes") launchApp("task_manager");
    else if (cmd === "cmd" || cmd === "terminal" || cmd === "dos") launchApp("terminal");
    else if (cmd === "calendar" || cmd === "date") launchApp("calendar");
    else if (cmd === "weather" || cmd === "svalbard") launchApp("weather");
    else if (cmd === "wordpad" || cmd === "write" || cmd === "editor") launchApp("wordpad");
    else if (cmd === "sysinfo" || cmd === "spec" || cmd === "hardware") launchApp("sys_info");
    else if (cmd === "contacts" || cmd === "address" || cmd === "people") launchApp("address_book");
    else if (cmd === "recorder" || cmd === "sound" || cmd === "audio") launchApp("sound_recorder");
    else if (cmd === "manual" || cmd === "help" || cmd === "guide" || cmd === "pdf") launchApp("help_guide");
    else if (cmd === "explorer" || cmd === "files" || cmd === "disk") launchApp("file_explorer");
    else if (cmd === "crash" || cmd === "bsod" || cmd === "error") {
      playErrorSound();
      setBsodError("FATAL EXCEPTION 07: User initiated core terminal crash. Hardware diagnostic sequence loaded via command prompt run.");
    } else {
      alert(`Command executable file '${cmd}' was not registered in gemstoneOS system directory paths.`);
    }
  };

  // Convert wallpaper setting to Tailwind body backgrounds
  const getWallpaperClass = () => {
    switch (settings.wallpaper) {
      case "teal":
        return "bg-teal";
      case "win95-classic":
        return "bg-win95-classic";
      case "space-stars":
        return "bg-space-stars";
      case "gradient-sunset":
        return "bg-gradient-sunset";
      case "retro-brick":
        return "bg-retro-brick";
      case "hot-pink":
        return "bg-hot-pink";
      case "under-construction":
        return "bg-under-construction";
      default:
        return "bg-[#0d5c5c]";
    }
  };

  // Convert Lucide icons in React elements dynamically
  const getLucideIcon = (name: string, colorClass: string) => {
    switch (name) {
      case "computer":
        return <Monitor className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "gemmy":
        return <Bot className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "internet":
        return <Globe className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "clicker":
        return <Flame className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "minesweeper":
        return <Sparkles className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "paint":
        return <Paintbrush className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "media_player":
        return <Music className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "notepad":
        return <FileText className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "control_panel":
        return <Settings className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "calculator":
        return <Calculator className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "task_manager":
        return <Activity className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "terminal":
        return <Terminal className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "calendar":
        return <Calendar className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "weather":
        return <CloudSnow className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "wordpad":
        return <FileText className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "sys_info":
        return <Cpu className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "address_book":
        return <Users className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "sound_recorder":
        return <Mic className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "help_guide":
        return <BookOpen className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      case "file_explorer":
        return <FolderOpen className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
      default:
        return <FolderOpen className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass}`} />;
    }
  };  if (isBooting) {
    if (showBiosSetup) {
      return (
        <BiosSetup
          config={biosConfig}
          onSave={(newConfig) => {
            setBiosConfig(newConfig);
            setShowBiosSetup(false);
            if (newConfig.bootBeeps) {
              playBiosClick();
            }
            // Reset boot step to 0 for a fresh diagnostic sweep with new settings
            setBootStep(0);
          }}
          onDiscard={() => {
            setShowBiosSetup(false);
          }}
          playClick={playBiosClick}
        />
      );
    }

    return (
      <div
        id="bios-boot-screen"
        onContextMenu={(e) => {
          e.preventDefault();
          playBiosClick();
          setShowBiosSetup(true);
        }}
        className="fixed inset-0 bg-black text-green-400 p-8 font-mono text-xs sm:text-sm select-none z-[99999] overflow-y-auto flex flex-col justify-between cursor-default"
      >
        <div className="space-y-4 max-w-[680px] mx-auto w-full">
          {/* Top Brand Logo Banner */}
          <div className="flex justify-between items-start border-b border-green-800 pb-2">
            <div>
              <p className="font-bold text-base tracking-wider text-white">GemCore ROM BIOS v2.000</p>
              <p className="text-gray-500">Copyright (C) 1985-2000 Gemstone Corporation (Svalbard Outpost)</p>
            </div>
            <div className="border border-green-700 p-1 text-[10px] text-green-500 font-bold shrink-0 animate-pulse">
              ENERGY MINING
            </div>
          </div>

          {/* Stage-based diagnostics */}
          <div className="space-y-3">
            {bootStep >= 1 && (
              <>
                <p className="text-white">CPU: Genuine Intel(R) Pentium(R) II Processor at {biosConfig.cpuSpeed} MHz ({biosConfig.cpuVolt.toFixed(1)}V)</p>
                <p>L2 Cache: 512KB Write-Back Cache Enabled</p>
              </>
            )}

            {bootStep >= 2 && (
              <div className="space-y-1">
                <p className="text-white font-bold">
                  Memory Test: <span className="animate-pulse">{biosConfig.memorySize * 1024}KB OK</span>
                </p>
                <p>Detecting Primary IDE Master ... {biosConfig.primaryIdeMaster} (3.2GB)</p>
                <p>Detecting Primary IDE Slave  ... {biosConfig.primaryIdeSlave === "NONE" ? "[NONE]" : `${biosConfig.primaryIdeSlave} (1.2GB)`}</p>
                <p>Detecting Secondary IDE Master ... LITEON CD-ROM LTN301 (24x)</p>
              </div>
            )}

            {bootStep >= 3 && (
              <div className="space-y-1 text-green-300">
                <p className="font-bold text-white">Loading System File Directories...</p>
                <p className="pl-4">C:\WINDOWS\COMMAND.COM ... LOADED</p>
                <p className="pl-4">C:\WINDOWS\SYSTEM\VMM32.VXD ... LOADED</p>
                <p className="pl-4">C:\DRIVERS\SOUNDCORE_MIDI.SYS ... LOADED</p>
                {biosConfig.glacierHeaterActive && (
                  <p className="pl-4 text-amber-500 font-bold">C:\DRIVERS\SVALBARD_HEATER_LOOP.SYS ... LOADED (ACTIVE)</p>
                )}
                {biosConfig.glacierCoolingMode !== "PASSIVE" && (
                  <p className="pl-4 text-cyan-400 font-bold">C:\DRIVERS\ARCTIC_CRYOTHERM_CORES.SYS ... LOADED ({biosConfig.glacierCoolingMode})</p>
                )}
              </div>
            )}

            {bootStep >= 4 && (
              <div className="space-y-1 text-white">
                <p className="text-yellow-400 font-bold">Starting gemstoneOS 2000 Svalbard Under Construction...</p>
                <p className="animate-pulse text-green-300">Launching user desktop environment matrix, please stand by...</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-gray-500 text-[10px] space-y-1 border-t border-green-950 pt-2">
          <div>
            Press <span className="text-white font-bold">ESC</span> to skip diagnostics • <span className="text-yellow-400 font-bold">Right-click anywhere</span> to enter BIOS SETUP
          </div>
          <div className="text-[9px]">
            BIOS Base: GemCore ROM BIOS setup registry block • Current Region: Longyearbyen Station
          </div>
        </div>
      </div>
    );
  }

  if (bsodError) {
    return (
      <div id="bsod-screen" className="fixed inset-0 bg-[#0000aa] text-white p-6 sm:p-12 md:p-20 font-mono text-sm sm:text-base leading-relaxed select-none z-[99999] overflow-y-auto flex flex-col justify-between">
        <div className="max-w-[760px] mx-auto space-y-6 w-full">
          <div className="bg-white text-[#0000aa] px-4 py-1 inline-block font-bold select-none text-xs sm:text-sm">
            gemstoneOS
          </div>
          
          <div className="space-y-4">
            <p className="text-yellow-300 font-bold">*** FATAL EXCEPTION INTERRUPT ***</p>
            <p className="text-gray-100">
              An unexpected error occurred while closing the application. This is an authentic simulation of nostalgic, chaotic computing!
            </p>
            
            <div className="bg-[#000080]/60 p-4 border border-blue-500 rounded font-mono text-xs sm:text-sm text-blue-105 select-text">
              {bsodError}
            </div>
            
            <p className="text-gray-200">
              The operating system has been destabilized temporarily, but fortunately this is gemstoneOS 98 featuring modern process safety cages.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-blue-700">
            <p className="font-bold text-gray-200">What would you like to do?</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-300">
              <li>
                Press <span className="font-bold text-white">[ESC]</span> or <span className="font-bold text-white">[ENTER]</span> (or tap the silver button) to bypass this exception and return to active desktop operations.
              </li>
              <li>
                Press <span className="font-bold text-white">[CTRL+ALT+DEL]</span> (or tap the crimson option) to execute a simulated cold-start hardware cycle. This wipes volatile drawing states, clickers, or note-drafts.
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 select-none">
            <button
              id="bsod-ignore-btn"
              onClick={() => setBsodError(null)}
              className="retro-button !text-xs !bg-[#c0c0c0] !text-black font-bold px-4 py-2 hover:bg-white active:bg-gray-400"
            >
              [ESC/ENTER] Ignore & Resume
            </button>
            
            <button
              id="bsod-reboot-btn"
              onClick={rebootSystem}
              className="retro-button !text-xs !bg-red-800 !text-white font-bold px-4 py-2 hover:bg-red-700 active:bg-red-900 border border-red-950"
            >
              [CTRL+ALT+DEL] Cold Reboot
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-blue-300 pt-8 select-none">
          System core architecture: 16-Bit GemCore Engine • Powered by Intel i486DX
        </div>
      </div>
    );
  }

  if (settings.isShutDown) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-[#ff3a3a] font-mono select-none p-4">
        <div className="text-center space-y-4 max-w-[400px]">
          <Power size={48} className="mx-auto text-red-650 animate-pulse" />
          <h1 className="text-xl font-bold tracking-widest">IT IS NOW SAFE TO TURN OFF YOUR COMPUTER</h1>
          <p className="text-xs text-gray-400">
            gemstoneOS 2000 Svalbard Under Construction has successfully unmounted core processor threads and parked hard disks.
          </p>
          <button
            onClick={() => {
              setSettings({ ...settings, isShutDown: false });
              setTimeout(() => launchApp("welcome"), 100);
            }}
            className="retro-button !text-xs !bg-[#c0c0c0] !text-black !font-bold py-1 px-4 mt-4"
          >
            Reboot system
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
        if (contextMenu) setContextMenu(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
        playClick();
      }}
      className={`fixed inset-0 font-sans text-sm overflow-hidden select-none flex flex-col ${getWallpaperClass()} transition-colors duration-500`}
    >
      {/* ------------------------------------------
          SCREENSAVER LAYER OVERLAY
         ------------------------------------------ */}
      {screensaverActive && (
        <Screensaver
          type={settings.screensaverType}
          onClose={() => setScreensaverActive(false)}
        />
      )}

      {/* ------------------------------------------
          DESKTOP ICONS GRID AREA
         ------------------------------------------ */}
      <main className={`flex-1 relative p-4 grid grid-cols-1 select-none pointer-events-auto [grid-auto-flow:column] [grid-template-rows:repeat(auto-fill,minmax(76px,1fr))] gap-x-2 gap-y-4 w-fit h-[calc(100%-40px)] z-0 transition-all duration-200 ${isRefreshing ? "opacity-35 scale-[0.99] blur-[0.5px]" : "opacity-100 scale-100"}`}>
        {desktopIcons.map((icon, index) => (
          <button
            key={`${icon.id}_${index}`}
            onDoubleClick={() => launchApp(icon.id)}
            onTouchEnd={() => launchApp(icon.id)} // healthy touch support
            className="w-[72px] sm:w-[84px] h-[72px] flex flex-col items-center justify-center p-1 rounded hover:bg-white/10 active:bg-white/20 text-white cursor-default group"
          >
            <div className="mb-1 text-center scale-95 group-hover:scale-105 transition-transform duration-150">
              {getLucideIcon(icon.iconName, icon.color)}
            </div>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium text-center select-none truncate w-full text-shadow-md">
              {icon.label}
            </span>
          </button>
        ))}
      </main>

      {/* ------------------------------------------
          ACTIVE WINDOW PORTALS
         ------------------------------------------ */}
      
      {/* 1. Welcome Splash Screen Window */}
      {windows.welcome?.isOpen && (
        <RetroWindow
          windowState={windows.welcome}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          icon={<Bot size={13} className="text-amber-800" />}
        >
          <div className="flex-1 p-5 text-black font-sans bg-[#c0c0c0] flex flex-col justify-between h-full select-text" id="app-welcome">
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b-2 border-double border-blue-900 pb-2">
                <div className="w-10 h-10 bg-[#000080] rounded-full flex items-center justify-center text-xl text-yellow-300">
                  💎
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#000080]">WELCOME TO gemstoneOS 2000 Svalbard Under Construction!</h2>
                  <p className="text-[10.5px] text-gray-500 font-mono">Build 32-Bit NT Workstation release</p>
                </div>
              </div>

              <div className="text-xs space-y-2 leading-relaxed">
                <p>
                  Golly! Welcome to the most dazzling and beautiful mineral computing simulation.
                  Customize layouts, chat with our floating, cartoon-eyed assistant <strong>Gemmy</strong>, write logs, or mine digital crystals!
                </p>
                <div className="p-2.5 bg-yellow-50 retro-border-inset rounded text-[11px] space-y-1">
                  <span className="font-bold text-yellow-950">🌟 Quick Start Checklist:</span>
                  <ul className="list-disc pl-5 text-stone-800">
                    <li>Launch <strong>GemPaint</strong> left and paint colorful gem shards</li>
                    <li>Open <strong>Control Panel</strong> under start menu to change background themes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-1.5 pt-3 shrink-0 select-none">
              <button onClick={() => launchApp("gemmy")} className="retro-button font-bold text-blue-900">
                Meet Gemmy
              </button>
              <button onClick={() => closeWindow("welcome")} className="retro-button">
                Close
              </button>
            </div>
          </div>
        </RetroWindow>
      )}

      {/* 2. My Computer System Info Info */}
      {windows.my_computer?.isOpen && (
        <RetroWindow
          windowState={windows.my_computer}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          icon={<Monitor size={13} />}
        >
          <div className="flex-1 p-5 text-black font-sans bg-[#c0c0c0] flex flex-col justify-between h-full select-text" id="app-mycomp">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#808080] pb-2">
                <Monitor size={28} className="text-blue-900 shrink-0" />
                <div>
                  <h3 className="font-bold text-xs uppercase text-slate-900">SYSTEM PROPERTIES REGISTRY</h3>
                  <p className="text-[10px] text-gray-500 font-bold">gemstoneOS 2000 Svalbard Under Construction</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs leading-normal">
                <div className="bg-white retro-border-inset p-2.5 space-y-1">
                  <span className="font-bold text-blue-900">HARDWARE MEMORY:</span>
                  <p>Intel Pentium Pro II CPU</p>
                  <p>RAM: 32MB physical RAM</p>
                  <p>Dialup: 56.6 KBps Modem</p>
                </div>

                <div className="bg-white retro-border-inset p-2.5 space-y-1">
                  <span className="font-bold text-blue-900">SYSTEM STORAGE:</span>
                  <p>Local Disk (C:) — FAT32</p>
                  <p>Used: 1.2 GB of 3.4 GB</p>
                  <p>Floppy Drive (A:) — Empty</p>
                </div>
              </div>

              <div className="text-[10px] bg-sky-50 retro-border-inset p-2 text-sky-950 font-mono leading-relaxed">
                * Built with standard Tailwind CSS double-bevel styles and interactive canvas modules. Local cache configured.
              </div>
            </div>

            <div className="flex justify-end gap-1 select-none">
              <button onClick={() => closeWindow("my_computer")} className="retro-button font-bold py-1 z-10">
                OK
              </button>
            </div>
          </div>
        </RetroWindow>
      )}

      {/* 3. Gemmy AI Floating Chat Desktop Wizard */}
      {windows.gemmy?.isOpen && (
        <RetroWindow
          windowState={windows.gemmy}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Bot size={13} className="text-amber-800" />}
          statusBarContent="GemCore Dialup Link Established Safely"
        >
          <GemmyChat />
        </RetroWindow>
      )}

      {/* 4. GemSweeper Mining Game */}
      {windows.minesweeper?.isOpen && (
        <RetroWindow
          windowState={windows.minesweeper}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          icon={<Sparkles size={13} className="text-cyan-800" />}
          statusBarContent="Volcanic deep fault detector functional"
        >
          <GemSweeper />
        </RetroWindow>
      )}

      {/* 5. GemPaint Drawing Studio */}
      {windows.paint?.isOpen && (
        <RetroWindow
          windowState={windows.paint}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Paintbrush size={13} className="text-purple-700" />}
          statusBarContent="Draw gemstone vector sketches with 16bit hue fidelity"
        >
          <GemPaint />
        </RetroWindow>
      )}

      {/* 6. Media Player synthesizer sequencer */}
      {windows.media_player?.isOpen && (
        <RetroWindow
          windowState={windows.media_player}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          icon={<Music size={13} className="text-indigo-800" />}
          statusBarContent="Synthesizing chiptunes on standard SoundBlaster driver"
        >
          <GemTune />
        </RetroWindow>
      )}

      {/* 7. Mineral incremental Clicker Rig */}
      {windows.clicker?.isOpen && (
        <RetroWindow
          windowState={windows.clicker}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Flame size={13} className="text-emerald-700" />}
          statusBarContent="Connected to local mining grid node"
        >
          <MineralClicker />
        </RetroWindow>
      )}

      {/* 8. Control Panel customization bar */}
      {windows.control_panel?.isOpen && (
        <RetroWindow
          windowState={windows.control_panel}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          icon={<Settings size={13} />}
          statusBarContent="Change theme, wallpapers or screensavers of system"
        >
          <ControlPanel
            settings={settings}
            onChangeSettings={setSettings}
            onPreviewScreensaver={() => setScreensaverActive(true)}
            onTriggerBsod={() => {
              playErrorSound();
              setBsodError("FATAL EXCEPTION 0D: Direct diagnostic override called from Systems Control Panel. High capacity hardware simulation mode active.");
            }}
          />
        </RetroWindow>
      )}

      {/* 9. GemText Notepad */}
      {windows.notepad?.isOpen && (
        <RetroWindow
          windowState={windows.notepad}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<FileText size={13} />}
          statusBarContent="Plain Text Editor and Personal Log Diaries"
        >
          <Notepad />
        </RetroWindow>
      )}

      {/* 9b. Retro Calculator */}
      {windows.calculator?.isOpen && (
        <RetroWindow
          windowState={windows.calculator}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Calculator size={13} />}
          statusBarContent="Calculate mathematical mineral formulas"
        >
          <CalculatorApp onPlayClick={playBiosClick} />
        </RetroWindow>
      )}

      {/* 10. Net Explorer Internet Portal */}
      {windows.internet?.isOpen && (
        <RetroWindow
          windowState={windows.internet}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Globe size={13} className="text-[#008080]" />}
          statusBarContent="Ready to surf the Information Superhighway!"
        >
          <InternetBrowser />
        </RetroWindow>
      )}

      {/* 11. Task Manager Window */}
      {windows.task_manager?.isOpen && (
        <RetroWindow
          windowState={windows.task_manager}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Activity size={13} className="text-emerald-950" />}
          statusBarContent="Live hardware process allocations"
        >
          <TaskManager
            windows={windows}
            activeWindowId={activeWindowId}
            onFocusApp={focusWindow}
            onCloseApp={closeWindow}
          />
        </RetroWindow>
      )}

      {/* 12. GemTerminal */}
      {windows.terminal?.isOpen && (
        <RetroWindow
          windowState={windows.terminal}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Terminal size={13} className="text-neutral-900" />}
          statusBarContent="gemstoneOS Console Subsystem"
        >
          <GemTerminal
            onCrash={(msg) => {
              playErrorSound();
              setBsodError(msg);
            }}
            onLaunchApp={launchApp}
          />
        </RetroWindow>
      )}

      {/* 13. GemCalendar */}
      {windows.calendar?.isOpen && (
        <RetroWindow
          windowState={windows.calendar}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Calendar size={13} className="text-indigo-900" />}
          statusBarContent="Svalbard logging timelines calendar"
        >
          <GemCalendar />
        </RetroWindow>
      )}

      {/* 14. SvalbardWeather */}
      {windows.weather?.isOpen && (
        <RetroWindow
          windowState={windows.weather}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<CloudSnow size={13} className="text-teal-700" />}
          statusBarContent="Arctic satellite weather status connected"
        >
          <SvalbardWeather />
        </RetroWindow>
      )}

      {/* 15. WordPad */}
      {windows.wordpad?.isOpen && (
        <RetroWindow
          windowState={windows.wordpad}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<FileText size={13} className="text-blue-950" />}
          statusBarContent="Rich layout document composer active"
        >
          <WordPad />
        </RetroWindow>
      )}

      {/* 16. SystemInfo */}
      {windows.sys_info?.isOpen && (
        <RetroWindow
          windowState={windows.sys_info}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Cpu size={13} className="text-stone-750" />}
          statusBarContent="Central processing registries active"
        >
          <SystemInfo />
        </RetroWindow>
      )}

      {/* 17. AddressBook */}
      {windows.address_book?.isOpen && (
        <RetroWindow
          windowState={windows.address_book}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Users size={13} className="text-rose-950" />}
          statusBarContent="Managing regional contact entries"
        >
          <AddressBook />
        </RetroWindow>
      )}

      {/* 18. SoundRecorder */}
      {windows.sound_recorder?.isOpen && (
        <RetroWindow
          windowState={windows.sound_recorder}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<Mic size={13} className="text-yellow-950" />}
          statusBarContent="Synthesizing wave cassette arrays"
        >
          <SoundRecorder />
        </RetroWindow>
      )}

      {/* 19. GemPDF */}
      {windows.help_guide?.isOpen && (
        <RetroWindow
          windowState={windows.help_guide}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<BookOpen size={13} className="text-sky-900" />}
          statusBarContent="Local pdf diagnostic manual index loaded"
        >
          <GemPDF />
        </RetroWindow>
      )}

      {/* 20. FileExplorer */}
      {windows.file_explorer?.isOpen && (
        <RetroWindow
          windowState={windows.file_explorer}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onDrag={dragWindow}
          onResize={resizeWindow}
          icon={<FolderOpen size={13} className="text-amber-900" />}
          statusBarContent="Disk volume root explorer"
        >
          <FileExplorer onLaunchApp={launchApp} />
        </RetroWindow>
      )}


      {/* ------------------------------------------
          START MENU DIALOG WINDOW RUN EXECUTABLE
         ------------------------------------------ */}
      {runDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
          <form
            onSubmit={handleExecuteCommand}
            className="retro-border-outset p-3 bg-[#c0c0c0] w-full max-w-[340px] space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-1">
              <span className="font-bold text-xs flex items-center gap-1">
                <Terminal size={14} className="text-gray-800" />
                <span>Run gemstoneOS executable</span>
              </span>
              <button
                type="button"
                onClick={() => setRunDialogOpen(false)}
                className="retro-button !p-0.5"
              >
                <X size={10} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p>Type the shortcut name of a gemstoneOS program to launch directly:</p>
              <input
                type="text"
                autoFocus
                placeholder="paint, mines, gemmy, clicker, music..."
                aria-label="Executable name"
                value={runCommandText}
                onChange={(e) => setRunCommandText(e.target.value)}
                className="w-full retro-input py-1 px-2.5 h-[28px]"
              />
              <p className="text-[10px] text-gray-500">
                Options: paint, mines, gemmy, clicker, music, notepad, internet, control
              </p>
            </div>

            <div className="flex justify-end gap-1 select-none">
              <button type="submit" className="retro-button font-bold text-emerald-900 py-1">
                Launch
              </button>
              <button
                type="button"
                onClick={() => setRunDialogOpen(false)}
                className="retro-button py-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}


      {/* ------------------------------------------
          BOTTOM SYSTEM NAVIGATION TASKBAR
         ------------------------------------------ */}
      <footer className="h-10 bg-[#c0c0c0] border-t-2 border-white flex justify-between items-center px-1.5 select-none relative z-[50] mt-auto shrink-0 shadow-md">
        
        <div className="flex items-center gap-1.5">
          {/* Start Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playBiosClick();
                setStartMenuOpen((prev) => !prev);
              }}
              className={`retro-button flex items-center gap-1.5 h-[28px] !px-2.5 font-bold tracking-wide uppercase ${
                startMenuOpen ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
              }`}
            >
              <span className="text-base select-none">💎</span>
              <span className="font-extrabold text-[#000080]">Start</span>
            </button>

            {/* Start Menu Sidebar Drawer Popup */}
            {startMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 bottom-full mb-1.5 w-[275px] bg-[#c0c0c0] retro-border-outset p-1 flex flex-row select-none z-[110]"
              >
                {/* Vintage Left Blue Stripe with gemstoneOS branding */}
                <div className="w-10 bg-gradient-to-b from-[#000080] to-[#1e3799] text-white flex flex-col justify-end items-center py-4 rounded-sm shrink-0 select-none">
                  <span className="font-bold font-mono tracking-widest text-[11px] whitespace-nowrap rotate-[270deg] translate-y-[-50px]">
                    gemstoneOS 2000 Svalbard
                  </span>
                </div>

                {/* Start Menu Right Directory list */}
                <div className="flex-1 flex flex-col p-1 space-y-1 min-w-0">
                  
                  {/* Start Menu Search Input */}
                  <div className="px-2 py-1 bg-white retro-border-inset flex items-center gap-1.5 mb-1 shrink-0">
                    <Search size={11} className="text-gray-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search program..."
                      aria-label="Search program"
                      value={startMenuSearch}
                      onChange={(e) => setStartMenuSearch(e.target.value)}
                      className="w-full bg-transparent select-text h-[18px] text-[11px] font-sans focus:outline-none border-none p-0 outline-none rounded-none text-slate-900"
                    />
                    {startMenuSearch && (
                      <button
                        onClick={() => setStartMenuSearch("")}
                        className="text-gray-400 hover:text-black font-bold text-[10px] px-0.5"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* List of Applications with Search Filtering and scroll support */}
                  <div className="flex-1 overflow-y-auto max-h-[260px] pr-0.5 space-y-0.5 scrollbar-thin select-none">
                    {(() => {
                      const startMenuItems = [
                        { id: "gemmy" as AppType, label: "Gemmy AI Assistant", icon: <Bot size={13} className="text-amber-800 shrink-0" /> },
                        { id: "paint" as AppType, label: "GemPaint Canvas", icon: <Paintbrush size={13} className="text-purple-700 shrink-0" /> },
                        { id: "minesweeper" as AppType, label: "GemSweeper (Mines)", icon: <Sparkles size={13} className="text-cyan-800 shrink-0" /> },
                        { id: "clicker" as AppType, label: "Mineral Rig Clicker", icon: <Flame size={13} className="text-emerald-800 shrink-0" /> },
                        { id: "media_player" as AppType, label: "GemTune MIDI Deck", icon: <Music size={13} className="text-indigo-805 shrink-0" /> },
                        { id: "notepad" as AppType, label: "Diary Notepad", icon: <FileText size={13} className="text-slate-700 shrink-0" /> },
                        { id: "wordpad" as AppType, label: "WordPad Editor", icon: <FileText size={13} className="text-blue-905 shrink-0" /> },
                        { id: "internet" as AppType, label: "Explorer Surf Portal", icon: <Globe size={13} className="text-[#008080] shrink-0" /> },
                        { id: "calculator" as AppType, label: "Vintage Calculator", icon: <Calculator size={13} className="text-orange-950 shrink-0" /> },
                        { id: "task_manager" as AppType, label: "Task Manager Console", icon: <Activity size={13} className="text-emerald-950 shrink-0" /> },
                        { id: "terminal" as AppType, label: "GemTerminal DOS", icon: <Terminal size={13} className="text-neutral-800 shrink-0" /> },
                        { id: "calendar" as AppType, label: "System Calendar", icon: <Calendar size={13} className="text-indigo-900 shrink-0" /> },
                        { id: "weather" as AppType, label: "Weather Outpost", icon: <CloudSnow size={13} className="text-teal-700 shrink-0" /> },
                        { id: "sys_info" as AppType, label: "System Specifications", icon: <Cpu size={13} className="text-stone-750 shrink-0" /> },
                        { id: "address_book" as AppType, label: "Arctic Address Book", icon: <Users size={13} className="text-rose-950 shrink-0" /> },
                        { id: "sound_recorder" as AppType, label: "Cassette Recorder", icon: <Mic size={13} className="text-yellow-950 shrink-0" /> },
                        { id: "help_guide" as AppType, label: "Help Guide Manual", icon: <BookOpen size={13} className="text-sky-900 shrink-0" /> },
                        { id: "file_explorer" as AppType, label: "File Explorer", icon: <FolderOpen size={13} className="text-amber-900 shrink-0" /> },
                        { id: "control_panel" as AppType, label: "System Control Panel", icon: <Settings size={13} className="text-gray-900 shrink-0" /> },
                      ];

                      const filtered = startMenuItems.filter(item =>
                        item.label.toLowerCase().includes(startMenuSearch.toLowerCase())
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="text-[10px] text-gray-500 italic p-4 text-center">
                            No matching items
                          </div>
                        );
                      }

                      return filtered.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            launchApp(item.id);
                            setStartMenuOpen(false);
                            setStartMenuSearch("");
                          }}
                          className="w-full text-left p-1.5 hover:bg-[#000080] hover:text-white rounded text-xs flex items-center gap-2 cursor-default"
                        >
                          {item.icon}
                          <span className="font-semibold truncate">{item.label}</span>
                        </button>
                      ));
                    })()}
                  </div>

                  <div className="h-[1px] bg-gray-400 my-1 justify-center shrink-0" />

                  <button
                    onClick={() => {
                      setStartMenuOpen(false);
                      setStartMenuSearch("");
                      setRunDialogOpen(true);
                    }}
                    className="w-full text-left p-1.5 hover:bg-[#000080] hover:text-white rounded text-xs flex items-center gap-2 cursor-default shrink-0"
                  >
                    <Terminal size={13} className="text-gray-800" />
                    <span className="font-semibold">Run Command...</span>
                  </button>

                  <div className="h-[1px] bg-gray-400 my-1 shrink-0" />

                  <button
                    onClick={() => {
                      playShutdown();
                      setStartMenuOpen(false);
                      setStartMenuSearch("");
                      setSettings({ ...settings, isShutDown: true });
                    }}
                    className="w-full text-left p-1.5 hover:!bg-red-700 hover:text-white rounded text-xs flex items-center gap-2 cursor-default shrink-0"
                  >
                    <Power size={13} className="text-red-700" />
                    <span className="font-bold text-red-700 hover:text-white">Shutdown Thread OS</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block h-[20px] w-[1px] bg-gray-400 mx-1" />

          {/* Quick Launch Short-cuts */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => launchApp("gemmy")}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredTaskbarRect({ left: rect.left, top: rect.top });
                setHoveredTaskbarInfo({
                  title: "Gemmy Assistant",
                  desc: "Instant AI assistant interface for gemstone miners",
                });
              }}
              onMouseLeave={() => {
                setHoveredTaskbarInfo(null);
                setHoveredTaskbarRect(null);
              }}
              className="retro-button !p-1 flex items-center justify-center rounded-sm shrink-0"
              title="Speak with Gemmy Assistant"
            >
              <Bot size={13} className="text-amber-800" />
            </button>
            <button
              onClick={() => launchApp("internet")}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredTaskbarRect({ left: rect.left, top: rect.top });
                setHoveredTaskbarInfo({
                  title: "Internet Surfer",
                  desc: "Connect to the Svalbard satellite network and outer web nodes",
                });
              }}
              onMouseLeave={() => {
                setHoveredTaskbarInfo(null);
                setHoveredTaskbarRect(null);
              }}
              className="retro-button !p-1 flex items-center justify-center rounded-sm shrink-0"
              title="Surfer Internet Explorer"
            >
              <Globe size={13} className="text-cyan-800" />
            </button>
            <button
              onClick={() => launchApp("paint")}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredTaskbarRect({ left: rect.left, top: rect.top });
                setHoveredTaskbarInfo({
                  title: "Paintbrush Studio",
                  desc: "Draw raster graphics and blueprint vectors with high performance",
                });
              }}
              onMouseLeave={() => {
                setHoveredTaskbarInfo(null);
                setHoveredTaskbarRect(null);
              }}
              className="retro-button !p-1 flex items-center justify-center rounded-sm shrink-0"
              title="Draw Paint masterworks"
            >
              <Paintbrush size={13} className="text-purple-700" />
            </button>
          </div>
        </div>

        {/* Dynamic Taskbar Center: Lists all running programs nicely */}
        <div className="flex-1 flex gap-1 items-center px-4 overflow-x-auto min-w-0 max-w-[50%] justify-start select-none">
          {(Object.values(windows) as (WindowItem | undefined)[]).map((win) => {
            if (!win || !win.isOpen) return null;
            const isActive = activeWindowId === win.id;
            return (
              <button
                key={win.id}
                onClick={() => {
                  if (isActive) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                  // Dimiss tooltip when clicking to avoid sticky hovers
                  setHoveredTaskbarInfo(null);
                  setHoveredTaskbarRect(null);
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredTaskbarRect({ left: rect.left, top: rect.top });
                  setHoveredTaskbarInfo({
                    title: win.title.split("-")[0],
                    status: win.isMinimized ? "MINIMIZED" : "ACTIVE RUNNING",
                    isMinimized: win.isMinimized,
                    desc: win.isMinimized ? "Click button to restore application workspace to main desktop tray." : "Click button to minimize this window panel back into the tray.",
                    appId: win.id,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredTaskbarInfo(null);
                  setHoveredTaskbarRect(null);
                }}
                className={`retro-button select-none shrink-0 text-left truncate font-medium text-[10px] uppercase max-w-[120px] flex items-center gap-1.5 ${
                  isActive ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white !font-bold" : ""
                }`}
              >
                <span className="text-[10px] select-none">🗖</span>
                <span className="truncate">{win.title.split("-")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Right Notification Tray */}
        <div className="retro-border-inset bg-[#c0c0c0] px-2 h-[28px] flex items-center gap-2.5 shrink-0 text-[11px] font-mono select-none">
          {/* Quick status beep toggle icon */}
          <button
            onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredTaskbarRect({ left: rect.left - 50, top: rect.top });
              setHoveredTaskbarInfo({
                title: "Driver Beep Settings",
                desc: settings.soundEnabled ? "Mutes chassis sound alerts and hardware interface ticks" : "Enables digital buzzer alerts on boot cycles and click actions",
              });
            }}
            onMouseLeave={() => {
              setHoveredTaskbarInfo(null);
              setHoveredTaskbarRect(null);
            }}
            className="hover:bg-gray-100 flex items-center justify-center p-[2px] rounded h-[20px] transition-colors"
            title={settings.soundEnabled ? "Mute Speaker driver beeps" : "Enable Driver beeps"}
          >
            {settings.soundEnabled ? <Volume2 size={13} className="text-emerald-800" /> : <VolumeX size={13} className="text-red-700" />}
          </button>

          <div
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredTaskbarRect({ left: rect.left - 80, top: rect.top });
              setHoveredTaskbarInfo({
                title: "System Clock Driver",
                desc: "Accurate real-time workstation clock synchronized to Longyearbyen NTP servers",
              });
            }}
            onMouseLeave={() => {
              setHoveredTaskbarInfo(null);
              setHoveredTaskbarRect(null);
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-gray-800 cursor-default"
          >
            <Clock size={11.5} className="text-indigo-850 shrink-0" />
            <span>{currentTime || "09:00:00"}</span>
          </div>
        </div>

      </footer>

      {/* Retro yellow Taskbar Hover Tips */}
      {hoveredTaskbarInfo && hoveredTaskbarRect && (
        <div
          style={{
            left: `${Math.max(12, Math.min(window.innerWidth - 212, hoveredTaskbarRect.left))}px`,
            bottom: "44px",
          }}
          className="fixed bg-[#ffffe1] text-black border border-black p-2 shadow-md text-[10px] font-sans z-[1000] pointer-events-none flex flex-col gap-0.5 rounded-sm select-none max-w-[200px]"
        >
          <div className="flex items-center gap-1.5 border-b border-gray-300 pb-1 mb-1">
            <span className="font-extrabold text-[#000080] tracking-wide uppercase truncate">
              {hoveredTaskbarInfo.title}
            </span>
            {hoveredTaskbarInfo.status && (
              <span className={`w-2 h-2 rounded-full ring-1 ring-white shrink-0 ${hoveredTaskbarInfo.isMinimized ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`} />
            )}
          </div>
          {hoveredTaskbarInfo.status && (
            <div className="text-[9px] font-mono font-bold text-gray-700 uppercase mb-0.5">
              STATUS: <span className={hoveredTaskbarInfo.isMinimized ? "text-amber-800" : "text-emerald-800"}>{hoveredTaskbarInfo.status}</span>
            </div>
          )}
          <div className="text-slate-700 leading-tight">
            {hoveredTaskbarInfo.desc}
          </div>
          
          {hoveredTaskbarInfo.appId && (
            <div className="text-[8px] text-indigo-900 mt-1 font-mono uppercase bg-blue-50 px-1 py-0.5 rounded border border-blue-200 w-fit shrink-0">
              {hoveredTaskbarInfo.appId === "minesweeper" && "🎮 C-MOS Miner Strategy Code"}
              {hoveredTaskbarInfo.appId === "gemmy" && "💎 GemCore Neural Brain AI"}
              {hoveredTaskbarInfo.appId === "notepad" && "📝 Plaintext Text Editor v1.00"}
              {hoveredTaskbarInfo.appId === "paint" && "🎨 Paintbrush Vector Board"}
              {hoveredTaskbarInfo.appId === "media_player" && "🎵 Arctic FM wave Media Deck"}
              {hoveredTaskbarInfo.appId === "clicker" && "⭐ Diamond Miner Industrial Operator"}
              {hoveredTaskbarInfo.appId === "control_panel" && "⚙️ Bios Host Registry Overrides"}
              {hoveredTaskbarInfo.appId === "file_explorer" && "📁 Directory Resource Explorer"}
              {hoveredTaskbarInfo.appId === "terminal" && "⌨️ 16-Bit Shell Emulator"}
              {hoveredTaskbarInfo.appId === "calculator" && "🧮 ALU Hex Arithmetic Processor"}
              {hoveredTaskbarInfo.appId === "sys_info" && "📊 Hardware & Environment Telemetry"}
              {!["minesweeper", "gemmy", "notepad", "paint", "media_player", "clicker", "control_panel", "file_explorer", "terminal", "calculator", "sys_info"].includes(hoveredTaskbarInfo.appId) && "📦 General System Core Module"}
            </div>
          )}
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onLaunchApp={launchApp}
          onSetWallpaper={handleSetWallpaper}
          currentWallpaper={settings.wallpaper}
          onActivateScreensaver={handleActivateScreensaver}
          onCrash={handleCrashSystem}
          onRefresh={handleRefresh}
          onAddFolder={handleAddFolder}
          onAddTextFile={handleAddTextFile}
          onReboot={rebootSystem}
          playClick={playClick}
        />
      )}
    </div>
  );
}
