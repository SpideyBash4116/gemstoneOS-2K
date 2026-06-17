import React, { useState, useEffect, useRef } from "react";
import { Mic, Play, Square, Circle, Sliders, Volume2 } from "lucide-react";

export default function SoundRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0.0);
  const [pitch, setPitch] = useState(1.0);
  const [waveform, setWaveform] = useState<number[]>(Array(40).fill(10));
  const waveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      waveTimer.current = setInterval(() => {
        setSeconds(prev => parseFloat((prev + 0.1).toFixed(1)));
        setWaveform(() => Array.from({ length: 40 }, () => Math.floor(Math.random() * 26) + 4));
      }, 100);
    } else if (isPlaying) {
      waveTimer.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 0.1) {
            setIsPlaying(false);
            return 0.0;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
        setWaveform(() => Array.from({ length: 40 }, () => Math.floor(Math.random() * 18) + 2));
      }, 100);
    } else {
      if (waveTimer.current) clearInterval(waveTimer.current);
      setWaveform(Array(40).fill(2));
    }

    return () => {
      if (waveTimer.current) clearInterval(waveTimer.current);
    };
  }, [isRecording, isPlaying]);

  const handleRecord = () => {
    setIsPlaying(false);
    setSeconds(0.0);
    setIsRecording(true);
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (seconds <= 0) return;
    setIsRecording(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-sound-recorder">
      {/* Top cassette graphic banner */}
      <div className="p-3 bg-neutral-950 text-[#39ff14] border-b-2 border-stone-800 flex flex-col items-center justify-between shrink-0 select-none">
        <div className="w-full flex justify-between text-[10px] items-center font-mono text-gray-500 mb-2">
          <span>TAPE DECK RECORDER - DRIVE C:</span>
          <span>Sample Pitch: {pitch.toFixed(1)}x</span>
        </div>

        {/* Cassette cassette rolling holes */}
        <div className="w-48 h-12 bg-neutral-900 border border-neutral-700 mx-auto rounded p-2 flex items-center justify-around">
          <div className={`w-8 h-8 rounded-full border-4 border-double border-neutral-600 flex items-center justify-center text-[8px] text-gray-550 ${isRecording || isPlaying ? "animate-spin" : ""}`}>
            🌀
          </div>
          <div className="w-16 h-4 bg-yellow-50 border border-gray-700 rounded text-center text-black font-bold font-mono text-[9px] flex items-center justify-center">
            {seconds.toFixed(1)} sec
          </div>
          <div className={`w-8 h-8 rounded-full border-4 border-double border-neutral-600 flex items-center justify-center text-[8px] text-gray-550 ${isRecording || isPlaying ? "animate-spin" : ""}`}>
            🌀
          </div>
        </div>
      </div>

      {/* Waveform Visualization area */}
      <div className="flex-1 min-h-0 p-3 flex flex-col justify-between">
        <div className="p-3 bg-black border border-neutral-800 rounded flex flex-col gap-1 select-none shrink-0">
          <p className="text-[10px] font-mono text-gray-500 flex justify-between">
            <span>Spectrum Waveform: SOUND_IN_RAM</span>
            <span className="flex items-center gap-1">
              <Mic size={9} className="text-red-650 animate-pulse" />
              Mic Driver Connected
            </span>
          </p>
          
          <div className="h-14 bg-neutral-950 rounded border border-[#004d00] flex items-center justify-center gap-[1px] px-1 overflow-hidden">
            {waveform.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-[#39ff14]"
                style={{ height: `${height * 1.5}px` }}
              />
            ))}
          </div>
        </div>

        {/* Audio control deck buttons */}
        <div className="p-3 retro-border-inset bg-[#dfdfdf] space-y-3.5 shrink-0 select-none">
          <div className="flex justify-around items-center gap-1.5">
            <button
              onClick={handlePlay}
              disabled={isRecording || isPlaying || seconds <= 0}
              className="retro-button flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold font-sans text-blue-950"
              title="Play Recorded Buffers"
            >
              <Play size={11} />
              <span>Play</span>
            </button>
            <button
              onClick={handleStop}
              disabled={!isRecording && !isPlaying}
              className="retro-button flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold font-sans"
              title="Stop Recording"
            >
              <Square size={11} />
              <span>Stop</span>
            </button>
            <button
              onClick={handleRecord}
              disabled={isRecording || isPlaying}
              className="retro-button flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold font-sans text-red-750"
              title="Record from virtual microphone"
            >
              <Circle size={10} className="fill-red-650 text-red-650" />
              <span>Record</span>
            </button>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-400 pt-2 text-[10.5px]">
            <Sliders size={12} className="text-gray-655 shrink-0" />
            <span className="font-semibold text-gray-700 shrink-0">Tape Pitch:</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="flex-1 accent-indigo-900 cursor-pointer h-1"
            />
          </div>
        </div>

        {/* Audio Card specifications line */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-600 px-1 font-mono select-none">
          <span className="flex items-center gap-1">
            <Volume2 size={11} className="text-emerald-800" />
            <span>Driver: Realtek 16-Bit Synth</span>
          </span>
          <span>Buffer: (11.0 kHz, Mono, 8-bit)</span>
        </div>
      </div>
    </div>
  );
}
