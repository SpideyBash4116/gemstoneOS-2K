import React, { useState, useEffect } from "react";
import {
  Settings,
  Cpu,
  Monitor,
  HardDrive,
  Volume2,
  VolumeX,
  X,
  Save,
  RotateCcw,
  Thermometer,
  Disc,
} from "lucide-react";

export interface BiosConfig {
  cpuSpeed: number; // 266, 333, 400, 450, 1200
  memorySize: number; // 64, 128, 256, 512
  primaryIdeMaster: string; // "FUJITSU MPC3032AT", "SVALBARD SOLIDSTATE", "QUANTUM FIREBALL"
  primaryIdeSlave: string; // "NONE", "SEAGATE MEDALIST 1.2GB", "ZIP-100 ATAPI"
  cpuVolt: number; // 1.8, 2.0, 2.2, 2.4
  quietBoot: boolean; // Fast vs standard steps
  bootBeeps: boolean; // Sound on/off
  glacierHeaterActive: boolean; // Fun svalbard theme setting
  glacierCoolingMode: "PASSIVE" | "ICE_PACK" | "NITROGEN";
}

interface BiosSetupProps {
  config: BiosConfig;
  onSave: (newConfig: BiosConfig) => void;
  onDiscard: () => void;
  playClick: () => void;
}

export default function BiosSetup({ config: initialConfig, onSave, onDiscard, playClick }: BiosSetupProps) {
  const [config, setConfig] = useState<BiosConfig>({ ...initialConfig });
  const [activeMenu, setActiveMenu] = useState<"main" | "cmos" | "cpu" | "features" | "help">("main");
  const [selectedMainIdx, setSelectedMainIdx] = useState(0);

  // Status variables
  const [cpuTemp, setCpuTemp] = useState(24.5);
  const [time, setTime] = useState("");

  // Keep a retro-style ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // CPU Temp fluctuates slightly based on cooling mode
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuTemp((prev) => {
        let base = 35;
        if (config.cpuSpeed === 1200) base += 25;
        else if (config.cpuSpeed === 450) base += 10;

        if (config.glacierCoolingMode === "NITROGEN") base -= 40;
        else if (config.glacierCoolingMode === "ICE_PACK") base -= 15;

        if (config.glacierHeaterActive) base += 20;

        const target = base + (Math.random() - 0.5) * 2;
        return parseFloat(target.toFixed(1));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [config.cpuSpeed, config.glacierCoolingMode, config.glacierHeaterActive]);

  const mainMenuItems = [
    { id: "cmos" as const, name: "STANDARD CMOS FEATURES", desc: "Setup Time, Date, IDE Hard Disk Drives, Floppy units" },
    { id: "cpu" as const, name: "CPU SPEED & OVERCLOCKING CONFIG", desc: "Configure Pentium II frequencies, multiplier, and voltage override" },
    { id: "features" as const, name: "SVALBARD GLACIER HARDWARE MONITOR", desc: "Environmental telemetry, thermal threshold alarms, thermal heaters" },
    { id: "help" as const, name: "BIOS SYSTEM DIAGNOSTICS & HELP", desc: "Information regarding Svalbard workstation bios architecture" },
  ];

  // Key handlers for classic retro navigation
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (activeMenu === "main") {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          playClick();
          setSelectedMainIdx((prev) => (prev + 1) % (mainMenuItems.length + 3));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          playClick();
          setSelectedMainIdx((prev) => (prev - 1 + (mainMenuItems.length + 3)) % (mainMenuItems.length + 3));
        } else if (e.key === "Enter") {
          e.preventDefault();
          playClick();
          if (selectedMainIdx < mainMenuItems.length) {
            setActiveMenu(mainMenuItems[selectedMainIdx].id);
          } else if (selectedMainIdx === mainMenuItems.length) {
            // Restore defaults
            setConfig({
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
          } else if (selectedMainIdx === mainMenuItems.length + 1) {
            // Save & exit
            onSave(config);
          } else {
            // Discard & exit
            onDiscard();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          playClick();
          onDiscard();
        }
      } else {
        if (e.key === "Escape") {
          e.preventDefault();
          playClick();
          setActiveMenu("main");
        }
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [activeMenu, selectedMainIdx, config, onSave, onDiscard]);

  const handleSelectSetting = (key: keyof BiosConfig, value: any) => {
    playClick();
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-[#0000a8] text-[#c0c0c0] font-mono text-[11px] sm:text-xs z-[100000] p-6 flex flex-col justify-between overflow-y-auto select-none">
      
      {/* BIOS HEADER */}
      <div className="border-b-2 border-[#54fc54] pb-2 text-center relative">
        <h1 className="text-[#fcfc54] text-sm sm:text-base font-bold tracking-widest text-[#ffff54]">
          ROM PCI/ISA BIOS (2A69KG0E)
        </h1>
        <h2 className="text-[#ffffff] text-xs font-semibold">
          CMOS CMOS SETUP UTILITY — SVALBARD SCIENTIFIC INC.
        </h2>
        <span className="absolute right-2 top-1 text-[#54ffff] font-bold">
          {time}
        </span>
      </div>

      {activeMenu === "main" && (
        <div className="flex-1 my-4 flex flex-col md:flex-row gap-6">
          {/* Main List */}
          <div className="flex-1 flex flex-col justify-center space-y-1.5 max-w-[500px]">
            {mainMenuItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  playClick();
                  setSelectedMainIdx(idx);
                  setActiveMenu(item.id);
                }}
                className={`w-full text-left px-3 py-1.5 focus:outline-none flex items-center justify-between font-bold ${
                  selectedMainIdx === idx
                    ? "bg-[#ffff54] text-[#0000a8]"
                    : "text-[#ffffff] hover:text-[#ffff54] hover:bg-[#0000ff]/30"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-[10px] opacity-60">▶</span>
              </button>
            ))}

            <div className="h-[2px] bg-[#54fc54]/45 my-2" />

            {/* Special Main Menu actions */}
            <button
              onClick={() => {
                playClick();
                setSelectedMainIdx(mainMenuItems.length);
                setConfig({
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
              }}
              className={`w-full text-left px-3 py-1.5 focus:outline-none flex items-center justify-between font-bold ${
                selectedMainIdx === mainMenuItems.length
                  ? "bg-[#ffff54] text-[#0000a8]"
                  : "text-[#fcfc54] hover:text-[#ffff54] hover:bg-[#0000ff]/30"
              }`}
            >
              <span>LOAD BIOS FAIL-SAFE DEFAULTS</span>
              <RotateCcw size={13} />
            </button>

            <button
              onClick={() => {
                playClick();
                setSelectedMainIdx(mainMenuItems.length + 1);
                onSave(config);
              }}
              className={`w-full text-left px-3 py-1.5 focus:outline-none flex items-center justify-between font-bold ${
                selectedMainIdx === mainMenuItems.length + 1
                  ? "bg-[#ffff54] text-[#0000a8]"
                  : "text-[#fc5454] hover:text-[#ff5454] hover:bg-[#0000ff]/30"
              }`}
            >
              <span>SAVE & EXIT SETUP</span>
              <Save size={13} />
            </button>

            <button
              onClick={() => {
                playClick();
                setSelectedMainIdx(mainMenuItems.length + 2);
                onDiscard();
              }}
              className={`w-full text-left px-3 py-1.5 focus:outline-none flex items-center justify-between font-bold ${
                selectedMainIdx === mainMenuItems.length + 2
                  ? "bg-[#ffff54] text-[#0000a8]"
                  : "text-[#ffffff] hover:text-[#ffff54] hover:bg-[#0000ff]/30"
              }`}
            >
              <span>EXIT WITHOUT SAVING</span>
              <X size={13} />
            </button>
          </div>

          {/* Description & Legend */}
          <div className="w-full md:w-[320px] bg-[#000054] border border-[#545454] p-4 flex flex-col justify-between rounded-sm">
            <div>
              <p className="text-[#54ffff] font-bold border-b border-[#545454] pb-1 mb-2">
                ITEM EXPLANATION
              </p>
              <p className="text-white leading-relaxed text-[11px]">
                {selectedMainIdx < mainMenuItems.length
                  ? mainMenuItems[selectedMainIdx].desc
                  : selectedMainIdx === mainMenuItems.length
                  ? "Resets all config settings to Svalbard Safe Standards. Recommended if unstable overclocks cause cryogenic kernel panics."
                  : selectedMainIdx === mainMenuItems.length + 1
                  ? "Commit your changes to the CMOS EPROM block and proceed with system bootstrap routines."
                  : "Discard all current modifications made during this setup session and launch Svalbard NT kernel immediately."}
              </p>
            </div>

            <div className="mt-4 border-t border-[#545454] pt-2 text-[10px]">
              <p className="text-yellow-400 font-bold mb-1">LEGEND KEYS:</p>
              <div className="grid grid-cols-2 gap-1 text-gray-400">
                <span>↑, ↓ : Select</span>
                <span>Enter : Modify</span>
                <span>ESC : Quit</span>
                <span>F10 : Save & Exit</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMENUS */}

      {activeMenu === "cmos" && (
        <div className="flex-1 my-4 flex flex-col justify-between max-w-[680px] mx-auto w-full">
          <div>
            <div className="flex justify-between items-center text-[#54ffff] font-bold border-b border-gray-600 pb-1 mb-4">
              <span>★ STANDARD CMOS FEATURES</span>
              <button
                onClick={() => {
                  playClick();
                  setActiveMenu("main");
                }}
                className="text-[#ff5454] hover:underline"
              >
                [ESC] Go Back
              </button>
            </div>

            <div className="space-y-3">
              {/* Primary IDE master */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Primary IDE Master (HDD):</span>
                <div className="flex gap-2">
                  {["FUJITSU MPC3032AT", "SVALBARD SSD", "QUANTUM FIREBALL"].map((drive) => (
                    <button
                      key={drive}
                      onClick={() => handleSelectSetting("primaryIdeMaster", drive)}
                      className={`px-2 py-1 text-[10px] font-bold border ${
                        config.primaryIdeMaster === drive
                          ? "bg-[#54fc54] text-black border-[#54fc54]"
                          : "border-[#c0c0c0] hover:bg-[#54ffff]/20"
                      }`}
                    >
                      {drive}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary IDE Slave */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Primary IDE Slave (Aux):</span>
                <div className="flex gap-2">
                  {["NONE", "SEAGATE 1.2GB", "ZIP-100 ATAPI"].map((slave) => (
                    <button
                      key={slave}
                      onClick={() => handleSelectSetting("primaryIdeSlave", slave)}
                      className={`px-2 py-1 text-[10px] font-bold border ${
                        config.primaryIdeSlave === slave
                          ? "bg-[#54fc54] text-black border-[#54fc54]"
                          : "border-[#c0c0c0] hover:bg-[#54ffff]/20"
                      }`}
                    >
                      {slave}
                    </button>
                  ))}
                </div>
              </div>

              {/* Boot Beeps */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Chassis Boot Beep Alert:</span>
                <button
                  onClick={() => handleSelectSetting("bootBeeps", !config.bootBeeps)}
                  className={`px-3 py-1 font-bold rounded flex items-center gap-1.5 ${
                    config.bootBeeps ? "bg-[#54fc54] text-[#0000a8]" : "bg-[#fc5454] text-white"
                  }`}
                >
                  {config.bootBeeps ? (
                    <>
                      <Volume2 size={12} /> ENABLED
                    </>
                  ) : (
                    <>
                      <VolumeX size={12} /> MUTED (QUIET)
                    </>
                  )}
                </button>
              </div>

              {/* Quiet Boot vs Diagnostic */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Quiet Boot (Fast Skip):</span>
                <button
                  onClick={() => handleSelectSetting("quietBoot", !config.quietBoot)}
                  className={`px-3 py-1 font-bold rounded ${
                    config.quietBoot ? "bg-[#54fc54] text-[#0000a8]" : "bg-gray-700 text-[#c0c0c0]"
                  }`}
                >
                  {config.quietBoot ? "FAST BOOT ACTIVE" : "AUTHENTIC VERBOSE MEMTEST"}
                </button>
              </div>

              {/* System Memory Size */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Simulated Board RAM size:</span>
                <div className="flex gap-1.5">
                  {[64, 128, 256, 512].map((mem) => (
                    <button
                      key={mem}
                      onClick={() => handleSelectSetting("memorySize", mem)}
                      className={`px-2 py-0.5 border text-[10px] ${
                        config.memorySize === mem
                          ? "bg-[#ffff54] text-black border-[#ffff54]"
                          : "border-gray-500 hover:text-white"
                      }`}
                    >
                      {mem}MB
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 italic">
            Standard features configure standard IDE pipelines. Unchecking Verbose Memtest speeds up workstation loading screen diagnostics.
          </p>
        </div>
      )}

      {activeMenu === "cpu" && (
        <div className="flex-1 my-4 flex flex-col justify-between max-w-[680px] mx-auto w-full">
          <div>
            <div className="flex justify-between items-center text-[#54ffff] font-bold border-b border-gray-600 pb-1 mb-4">
              <span>⚡ CPU PnP & FREQUENCY OVERCLOCKING</span>
              <button
                onClick={() => {
                  playClick();
                  setActiveMenu("main");
                }}
                className="text-[#ff5454] hover:underline"
              >
                [ESC] Go Back
              </button>
            </div>

            <div className="space-y-4">
              {/* CPU frequency selection */}
              <div>
                <p className="font-bold text-white mb-2">Intel Pentium II Core Target Clock Speed:</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { val: 266, desc: "266 MHz (Stock)" },
                    { val: 333, desc: "333 MHz (Mild OC)" },
                    { val: 400, desc: "400 MHz (Hot Run)" },
                    { val: 450, desc: "450 MHz (Extreme)" },
                    { val: 1200, desc: "1.2 GHz (Sub-Zero Liquid Nitrogen)" },
                  ].map((speed) => (
                    <button
                      key={speed.val}
                      onClick={() => {
                        handleSelectSetting("cpuSpeed", speed.val);
                        // automatically scale voltage and cooling mode for safe overclocks
                        if (speed.val === 1200) {
                          setConfig((prev) => ({
                            ...prev,
                            cpuSpeed: 1200,
                            cpuVolt: 2.4,
                            glacierCoolingMode: "NITROGEN",
                          }));
                        } else if (speed.val === 450) {
                          setConfig((prev) => ({
                            ...prev,
                            cpuSpeed: 450,
                            cpuVolt: 2.0,
                            glacierCoolingMode: "ICE_PACK",
                          }));
                        } else {
                          setConfig((prev) => ({
                            ...prev,
                            cpuSpeed: speed.val,
                          }));
                        }
                      }}
                      className={`p-2 border font-bold flex flex-col items-center justify-between transition-colors ${
                        config.cpuSpeed === speed.val
                          ? "bg-[#54fc54] text-black border-[#54fc54]"
                          : "border-gray-500 hover:bg-[#54ffff]/15 text-white"
                      }`}
                    >
                      <Cpu size={14} />
                      <span className="text-[11px] font-bold mt-1">{speed.val} MHz</span>
                      <span className="text-[8px] opacity-75">{speed.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CPU Voltage */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">VCore Voltage Override:</span>
                <div className="flex gap-2">
                  {[1.8, 2.0, 2.2, 2.4].map((v) => (
                    <button
                      key={v}
                      disabled={config.cpuSpeed === 1200 && v < 2.2}
                      onClick={() => handleSelectSetting("cpuVolt", v)}
                      className={`px-2 py-1 text-[10px] font-bold border disabled:opacity-30 ${
                        config.cpuVolt === v
                          ? "bg-[#ffff54] text-black border-[#ffff54]"
                          : "border-gray-500 hover:text-white"
                      }`}
                    >
                      {v.toFixed(1)}V {v >= 2.2 ? "⚡ (Warn)" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warning box */}
              {config.cpuSpeed >= 450 && (
                <div className="p-3 border border-[#fc5454] bg-red-950/20 text-[#fc5454] text-[10px] font-mono leading-relaxed rounded">
                  <p className="font-bold mb-1">!!! VOLTAGE AND SPEED RADIATION WARNING !!!</p>
                  Setting Pentium II past 400 MHz raises semiconductor temperatures significantly. Please ensure your Svalbard Arctic wind cooling mode is configured appropriately in Hardware Monitor Submenu, otherwise memory allocation panics will occur!
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 italic">
            Speed modification will be visibly reflected in the GemCore ROM BIOS setup and diagnostic bootscreen readout.
          </p>
        </div>
      )}

      {activeMenu === "features" && (
        <div className="flex-1 my-4 flex flex-col justify-between max-w-[680px] mx-auto w-full">
          <div>
            <div className="flex justify-between items-center text-[#54ffff] font-bold border-b border-gray-600 pb-1 mb-4">
              <span>❄ SVALBARD GLACIER TELEMETRY & COOLING</span>
              <button
                onClick={() => {
                  playClick();
                  setActiveMenu("main");
                }}
                className="text-[#ff5454] hover:underline"
              >
                [ESC] Go Back
              </button>
            </div>

            <div className="space-y-4">
              {/* Real time telemetry readout */}
              <div className="grid grid-cols-2 gap-4 bg-[#000054]/60 p-4 border border-[#545454] rounded">
                <div className="space-y-1">
                  <p className="text-gray-400 text-[10px]">PENTIUM II CORE TEMP:</p>
                  <p className={`text-base font-bold ${cpuTemp > 65 ? "text-red-500 animate-pulse" : cpuTemp < 10 ? "text-sky-300" : "text-green-400"}`}>
                    {cpuTemp.toFixed(1)} °C
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-[10px]">SVALBARD GEOTHERMAL GLACIER HUMIDITY:</p>
                  <p className="text-base text-cyan-400 font-bold">
                    0.05% (Extremely Frozen)
                  </p>
                </div>
              </div>

              {/* Thermal fan configuration */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Arctic Cooling Mode:</span>
                <div className="flex gap-2">
                  {[
                    { id: "PASSIVE", label: "PASSIVE (Airflow)" },
                    { id: "ICE_PACK", label: "GLACIER ICE PACK" },
                    { id: "NITROGEN", label: "LIQUID NITROGEN PUMP" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleSelectSetting("glacierCoolingMode", mode.id)}
                      className={`px-2 py-1 text-[10px] font-bold border ${
                        config.glacierCoolingMode === mode.id
                          ? "bg-[#54fc54] text-black border-[#54fc54]"
                          : "border-gray-500 hover:bg-[#54ffff]/15 text-white"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anti-freeze heater toggle */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Chassis Anti-Freeze Heater Loop:</span>
                <button
                  onClick={() => handleSelectSetting("glacierHeaterActive", !config.glacierHeaterActive)}
                  className={`px-3 py-1 font-bold rounded ${
                    config.glacierHeaterActive ? "bg-[#ffff54] text-[#0000a8]" : "bg-gray-700 text-[#c0c0c0]"
                  }`}
                >
                  {config.glacierHeaterActive ? "HEATER ON (PREVENTS FROST DAMAGE)" : "HEATER STANDBY (MAX FROST)"}
                </button>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 italic">
            Overclocking to 1.2 GHz without Liquid Nitrogen mode engaged will cause unstable, chaotic system behaviors. Use carefully.
          </p>
        </div>
      )}

      {activeMenu === "help" && (
        <div className="flex-1 my-4 flex flex-col justify-between max-w-[680px] mx-auto w-full">
          <div>
            <div className="flex justify-between items-center text-[#54ffff] font-bold border-b border-gray-600 pb-1 mb-4">
              <span>📖 SVALBARD WORKSTATION TECHNICAL MANUAL</span>
              <button
                onClick={() => {
                  playClick();
                  setActiveMenu("main");
                }}
                className="text-[#ff5454] hover:underline"
              >
                [ESC] Go Back
              </button>
            </div>

            <div className="space-y-3 text-white text-[11px] leading-relaxed max-h-[300px] overflow-y-auto pr-2">
              <p>
                Welcome to the <strong className="text-yellow-400">GemCore ROM BIOS v2.000</strong> help manual. This workstation is situated at the remote gemstone mining outpost on Spitsbergen Island, Svalbard Archipelago.
              </p>
              <p>
                Due to sub-zero temperatures, the board has been equipped with a physical Arctic anti-freezing heating loop to sustain structural integrity in extreme winters. Overclocking the Intel Pentium II past factory margins requires Liquid Nitrogen thermal mitigation to prevent cryogenic system logic halt faults (BSOD crash).
              </p>
              <p className="text-yellow-300">
                • Standard Boot sequence loads C:\WINDOWS\COMMAND.COM dynamically.
                <br />
                • Fast Boot mode ignores sequential diagnostics, making the boot duration instant!
              </p>
              <p className="text-gray-400">
                Copyright (C) 1985-2000 Gemstone Corporation. All Intel Microcode registries protected under Jan Mayen treaties.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="border-t-2 border-[#54fc54] pt-2 text-center text-[#54ffff] font-bold text-[10px] flex justify-between items-center">
        <span>F10: Save & Exit Setup</span>
        <span className="text-white">gemstoneOS Core BIOS Engine</span>
        <span>ESC: Discard & Boot</span>
      </div>
    </div>
  );
}
