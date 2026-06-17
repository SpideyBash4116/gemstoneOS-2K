import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send } from "lucide-react";

interface GemTerminalProps {
  onCrash: (msg: string) => void;
  onLaunchApp: (id: any) => void;
}

export default function GemTerminal({ onCrash, onLaunchApp }: GemTerminalProps) {
  const [history, setHistory] = useState<string[]>([
    "gemstoneOS [Version 2000.7.26a Svalbard]",
    "Copyright (C) 1985-2000 gemstone Systems. All rights reserved.",
    "",
    "Type 'help' to view available system terminal executables.",
    ""
  ]);
  const [inputValue, setInputValue] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdText = inputValue.trim();
    if (!cmdText) return;

    const lowerCmd = cmdText.toLowerCase();
    const args = lowerCmd.split(" ");
    const primaryCmd = args[0];

    const newLogs = [...history, `C:\\WINDOWS>${cmdText}`];

    let result: string[] = [];

    switch (primaryCmd) {
      case "help":
        result = [
          "Registered gemstoneOS system commands:",
          "  help         Display this diagnostic index",
          "  dir | list   Index virtual hard drive files & nodes",
          "  ver          Show operating system version",
          "  color <val>  Change text color (green, yellow, amber, cyan, white)",
          "  fortune      Retrieve retro fortune-cookie insight",
          "  gemmy <msg>  Query Assistant Core with standard echo",
          "  launch <app> Launch system window (calc, paint, miner, sweep, notes)",
          "  cls          Clear terminal log",
          "  matrix | hack Run secret green telemetry matrix sequence",
          "  crash        Initiate fatal memory dump Blue Screen simulation"
        ];
        break;
      case "dir":
      case "list":
        result = [
          " Directory of C:\\WINDOWS",
          "",
          "06/17/2000  03:00 PM    <DIR>          SYSTEM",
          "06/17/2000  03:00 PM    <DIR>          DESKTOP",
          "05/12/1999  11:24 AM            54,233 GEMPAINT.EXE",
          "11/04/1998  08:12 PM            24,190 SWEEPER.EXE",
          "09/19/1999  01:45 AM             9,820 NOTEPAD.EXE",
          "02/21/2000  10:11 AM             1,402 CONFIG.SYS",
          "06/17/2000  03:59 PM               319 SYSTEM.INI",
          "               5 File(s)         89,964 bytes",
          "               2 Dir(s)     1,438,202,112 bytes free"
        ];
        break;
      case "ver":
        result = [
          "gemstoneOS 2000 [Svalbard Mining Edition - Build 2600.3204]",
          "Enhanced with 16-Bit high precision clock cycles."
        ];
        break;
      case "color":
        const colorName = args[1];
        if (["green", "yellow", "amber", "cyan", "white"].includes(colorName)) {
          // Handled via state trigger or container class
          result = [`Color schema adjusted to: ${colorName}`];
        } else {
          result = ["Invalid color parameter. Try: color green|yellow|amber|cyan|white"];
        }
        break;
      case "fortune":
        const fortunes = [
          "You will discover a rare crystalline sapphire in your next clicker mining cycle.",
          "Beware of polar bear roaming on Svalbard desktop directories.",
          "A fast Pentium II processor is in your near visual future.",
          "Good design doesn't require 100 modules. But 10 more apps is incredibly fun!",
          "Gemmy Core says: Keep smiling, your mineral investments are climbing!"
        ];
        result = [fortunes[Math.floor(Math.random() * fortunes.length)]];
        break;
      case "gemmy":
        const echoMsg = cmdText.substring(primaryCmd.length + 1).trim();
        result = [
          "Gemmy Assistant Core responds:",
          `  "Golly! You asked me '${echoMsg || "nothing"}'. I believe we should mine more gemstones! 💎"`
        ];
        break;
      case "cls":
        setHistory([]);
        setInputValue("");
        return;
      case "launch":
        const appToOpen = args[1];
        if (!appToOpen) {
          result = ["Usage: launch calc|paint|miner|sweep|notes"];
        } else if (["calc", "calculator"].includes(appToOpen)) {
          onLaunchApp("calculator");
          result = ["Launching space-calc..."];
        } else if (["paint", "draw"].includes(appToOpen)) {
          onLaunchApp("paint");
          result = ["Opening GemPaint Canvas Studio..."];
        } else if (["miner", "clicker", "gems"].includes(appToOpen)) {
          onLaunchApp("clicker");
          result = ["Initiating Micro-Mine Clicker Rig v2.4..."];
        } else if (["sweep", "minesweeper", "sweeper"].includes(appToOpen)) {
          onLaunchApp("minesweeper");
          result = ["Opening GemSweeper 3D..."];
        } else if (["notes", "notepad", "text"].includes(appToOpen)) {
          onLaunchApp("notepad");
          result = ["Opening Diary editor..."];
        } else {
          result = [`App name '${appToOpen}' was not spotted. Try 'launch calc'.`];
        }
        break;
      case "matrix":
      case "hack":
        result = [
          "ACCESSING SECURE MAINFRAME... OK",
          "OVERLOADING MEMORY STACKS... OK",
          "1001011110100110001010010101110101010011",
          "0110101001101101100101010110101100111010",
          "98% MINERAL HARDNESS THRESHOLD EXCEEDED",
          "SYS_KEY: Svalbard_Glacier_Under_Lock"
        ];
        break;
      case "crash":
        onCrash("FATAL EXCEPTION 03: Direct Terminal triggered heap corrupt error.");
        return;
      default:
        result = [
          `'${primaryCmd}' is not recognized as an internal or external command,`,
          "operable program or batch file. Type 'help' to see list."
        ];
    }

    setHistory([...newLogs, ...result, ""]);
    setInputValue("");
  };

  const getTerminalColorClass = () => {
    const lastColorLog = history.find(log => log.includes("Color schema adjusted to:"));
    if (!lastColorLog) return "text-emerald-400";
    if (lastColorLog.includes("green")) return "text-[#39ff14]";
    if (lastColorLog.includes("yellow")) return "text-yellow-300";
    if (lastColorLog.includes("amber")) return "text-amber-500";
    if (lastColorLog.includes("cyan")) return "text-cyan-400";
    if (lastColorLog.includes("white")) return "text-white";
    return "text-emerald-400";
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-gem-terminal">
      {/* Top Menu Row */}
      <div className="flex gap-2.5 px-3 py-1 bg-[#dfdfdf] border-b border-[#808080] text-[11px] shrink-0 select-none">
        <span className="cursor-default hover:underline">File</span>
        <span className="cursor-default hover:underline" onClick={() => setHistory([])}>Clear</span>
        <span className="cursor-default hover:underline" onClick={() => setInputValue("help")}>Help</span>
      </div>

      {/* Terminal Screen Console */}
      <div className="flex-1 min-h-0 bg-black p-3 overflow-y-auto font-mono text-xs select-text leading-tight custom-scrollbar">
        <div className={`space-y-1 ${getTerminalColorClass()}`}>
          {history.map((line, idx) => (
            <p key={idx} className="whitespace-pre-wrap">{line}</p>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Input row */}
      <form onSubmit={handleCommandSubmit} className="flex bg-[#c0c0c0] p-1 border-t border-[#808080] shrink-0 select-none items-center">
        <span className="font-mono text-xs text-stone-900 px-1 shrink-0">C:\WINDOWS&gt;</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 retro-input !bg-black !text-white !font-mono text-xs py-0.5 mx-1"
          autoFocus
          placeholder="Type clean retro commands here..."
        />
        <button type="submit" className="retro-button !py-0.5 !px-2 flex items-center gap-1">
          <Send size={10} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
