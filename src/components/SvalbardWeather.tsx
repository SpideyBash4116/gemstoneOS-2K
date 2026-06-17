import React, { useState, useEffect } from "react";
import { CloudSnow, Thermometer, Wind, AlertTriangle, RefreshCw } from "lucide-react";

export default function SvalbardWeather() {
  const [temperature, setTemperature] = useState(-14);
  const [windSpeed, setWindSpeed] = useState(38);
  const [pressure, setPressure] = useState(992);
  const [statusText, setStatusText] = useState("Glacial gusts with crystal precipitation flakes.");
  const [radarPulse, setRadarPulse] = useState(true);

  const triggerDiagnostic = () => {
    // Randomize arctic telemetry
    const newTemp = Math.floor(Math.random() * 12) - 22;
    const newWind = Math.floor(Math.random() * 45) + 15;
    const newPressure = Math.floor(Math.random() * 40) + 970;
    
    setTemperature(newTemp);
    setWindSpeed(newWind);
    setPressure(newPressure);

    const metrics = [
      "Heavy sub-zero gemstone blizzard alert in Mining Section 4.",
      "Clear polar skies over Svalbard base camp with light ice glitter.",
      "Thick glacial fog forming near frozen bay. Navigate with extreme watchfulness.",
      "Severe solar geomagnetic storm. Peak chiptune synthesis distortion expected."
    ];
    setStatusText(metrics[Math.floor(Math.random() * metrics.length)]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarPulse(p => !p);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-svalbard-weather">
      {/* Visual Header Grid layout */}
      <div className="p-4 bg-slate-900 text-white flex flex-row items-center justify-between border-b-2 border-stone-800 shrink-0 select-none">
        <div>
          <h2 className="text-sm font-extrabold tracking-wider text-cyan-300">SVALBARD OUTPOST METEOROLOGY</h2>
          <span className="text-[10px] font-mono text-gray-400">Station ID: SV_80_NOR (Live Telemetry System)</span>
        </div>
        <button
          onClick={triggerDiagnostic}
          className="retro-button !py-1 !px-2 flex items-center gap-1.5 hover:!bg-white hover:text-black shrink-0"
        >
          <RefreshCw size={11} className="animate-spin text-cyan-600" />
          <span>Ping Weather Rig</span>
        </button>
      </div>

      {/* Main Stats Widgets */}
      <div className="flex-1 min-h-0 p-3 flex flex-col md:flex-row gap-3 overflow-y-auto">
        <div className="flex-1 flex flex-col gap-2.5">
          {/* Card 1: Temp */}
          <div className="retro-border-inset bg-slate-100 p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-8 h-8 text-blue-800 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-600">OUTSIDE AIR TEMP</p>
                <p className="text-lg font-mono font-bold">{temperature}°C <span className="text-xs text-blue-600 font-sans">({(temperature * 9/5 + 32).toFixed(0)}°F)</span></p>
              </div>
            </div>
            <span className="text-[10px] bg-blue-900 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase">Subzero</span>
          </div>

          {/* Card 2: Wind */}
          <div className="retro-border-inset bg-slate-100 p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Wind className="w-8 h-8 text-cyan-700 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-600">CRYSTALLINE GUSTS</p>
                <p className="text-lg font-mono font-bold">{windSpeed} km/h</p>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-700 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase">Gale</span>
          </div>

          {/* Card 3: Barometer */}
          <div className="retro-border-inset bg-slate-100 p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CloudSnow className="w-8 h-8 text-indigo-800 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-600">BAROMETRIC PRESSURE</p>
                <p className="text-lg font-mono font-bold">{pressure} hPa</p>
              </div>
            </div>
            <span className="text-[10px] bg-neutral-800 text-stone-200 font-mono px-1.5 py-0.5 rounded font-bold uppercase">Glacial</span>
          </div>
        </div>

        {/* Right Radar Simulator */}
        <div className="w-full md:w-48 retro-border-inset bg-neutral-950 p-2.5 flex flex-col justify-between text-[#38bdf8] font-mono text-[10px] relative shrink-0 min-h-[140px]">
          <div>
            <span className="text-white font-bold block border-b border-sky-900 pb-0.5 text-center text-[9px] uppercase tracking-wider">Arctic Radar Sweep</span>
            
            {/* Visual radar circular shape with glowing pulse */}
            <div className="w-24 h-24 mx-auto rounded-full border border-sky-850 my-2.5 relative flex items-center justify-center overflow-hidden">
              <div className={`absolute w-full h-full border border-dashed border-sky-900/40 rounded-full transition-transform duration-[4000ms] ${radarPulse ? "scale-100 rotate-180" : "scale-50 rotate-0"}`} />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
              <div className="w-1 h-1 bg-red-500 rounded-full absolute top-6 right-8 animate-pulse" />
              <div className="w-1 h-1 bg-cyan-400 rounded-full absolute bottom-8 left-10 animate-ping" />
            </div>
          </div>

          <div className="text-gray-400 text-[8px] text-center italic">Radar Sweeper: ONLINE</div>
        </div>
      </div>

      {/* Warning Bulletin Footer */}
      <div className="p-3 bg-yellow-50 border-t border-[#808080] shrink-0">
        <div className="flex items-start gap-2 text-stone-900">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs block text-stone-950 uppercase">Arctic Advisory:</span>
            <p className="text-[11px] leading-tight text-gray-800">{statusText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
