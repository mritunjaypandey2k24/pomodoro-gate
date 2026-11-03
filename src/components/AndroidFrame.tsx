import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Code, RotateCcw, Download } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AndroidFrameProps {
  children: React.ReactNode;
  onOpenComposeModal: () => void;
  onOpenInstallModal: () => void;
  onResetData: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onOpenComposeModal,
  onOpenInstallModal,
  onResetData
}) => {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-2 sm:p-4 text-zinc-300">
      {/* Top Utility Ribbon */}
      <header className="w-full max-w-4xl flex items-center justify-between gap-4 py-2 px-3 mb-2 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-white tracking-tight">GATE Chrono</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">Deep Focus</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenInstallModal();
            }}
            className="px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-white flex items-center gap-1.5 text-xs transition-colors shadow-sm"
            title="Install App on Phone / APK Guide"
          >
            <Download className="w-3.5 h-3.5 text-zinc-300" />
            <span>Install on Phone</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenComposeModal();
            }}
            className="px-2.5 py-1.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 text-xs transition-colors"
            title="Inspect Jetpack Compose Code"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compose Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsPhoneMode((prev) => !prev);
            }}
            className="px-2.5 py-1.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 text-xs transition-colors"
            title={isPhoneMode ? 'Fullscreen' : 'Phone Frame'}
          >
            {isPhoneMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset local GATE progress & session counts?')) {
                onResetData();
              }
            }}
            className="p-1.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Reset Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container: Pure Pitch-Black Frame */}
      <div
        className={`w-full transition-all duration-200 flex flex-col bg-black ${
          isPhoneMode
            ? 'max-w-[412px] h-[850px] max-h-[92vh] rounded-[40px] border border-zinc-800 shadow-2xl relative overflow-hidden ring-1 ring-zinc-900'
            : 'max-w-xl min-h-[820px] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden'
        }`}
      >
        {/* Minimal Android Status Bar */}
        <div className="w-full h-8 pt-1 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-500 select-none shrink-0 bg-black z-30">
          <span className="font-normal text-zinc-400">{currentTime}</span>

          {isPhoneMode && (
            <div className="w-3 h-3 rounded-full bg-zinc-950 border border-zinc-900" />
          )}

          <div className="flex items-center gap-1.5 text-zinc-500">
            <Wifi className="w-3 h-3" />
            <span className="text-[10px]">5G</span>
            <Battery className="w-3 h-3" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-black">
          {children}
        </div>

        {/* Bottom Android Gesture Pill */}
        {isPhoneMode && (
          <div className="w-full h-4 pb-1 bg-black flex items-center justify-center shrink-0 select-none">
            <div className="w-28 h-0.5 rounded-full bg-zinc-800" />
          </div>
        )}
      </div>
    </div>
  );
};
