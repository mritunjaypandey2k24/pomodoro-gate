import React, { useState } from 'react';
import { Smartphone, Download, QrCode, Check, Copy, ExternalLink, X, ShieldAlert, Cpu } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenComposeCode: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onOpenComposeCode
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'phone' | 'apk'>('phone');

  if (!isOpen) return null;

  const appUrl =
    typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://ais-dev-2eohdd4e3mulplnkxvr77h-722468330463.asia-northeast1.run.app';

  const handleCopyUrl = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleNativeInstall = async () => {
    soundManager.playClick();
    await install();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Install on Android Phone</h3>
              <p className="text-[11px] text-zinc-500">Standalone App & APK Options</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-0.5 rounded-lg bg-zinc-900/80 border border-zinc-900 text-xs">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('phone');
            }}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'phone'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Instant Install (WebAPK)
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('apk');
            }}
            className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'apk'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Compile .APK (Android Studio)
          </button>
        </div>

        {activeTab === 'phone' ? (
          <div className="space-y-3.5 text-xs">
            {/* Step 1: Open on phone */}
            {/* Step 1: Open on phone */}
            <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-2.5">
              <div className="flex items-center justify-between text-zinc-300 font-medium">
                <span>1. Open on Android Phone</span>
                <span className="text-[10px] text-zinc-500 font-mono">Chrome / Edge / Samsung</span>
              </div>

              {/* QR Code for instant phone camera scanning */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-950 border border-zinc-900">
                <div className="w-24 h-24 rounded-lg bg-black border border-zinc-800 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(appUrl)}&bgcolor=000000&color=ffffff&margin=1`}
                    alt="Scan with Android Phone"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-white flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Scan with Phone Camera</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight">
                    Point your Android camera at the QR code to open the app on your phone immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 bg-zinc-950 rounded-lg border border-zinc-850 font-mono text-[10px] text-zinc-400">
                <span className="truncate flex-1 select-all">{appUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-200 shrink-0 transition-colors flex items-center gap-1"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* In-browser instant install trigger if available */}
            {isInstallable && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-750 space-y-2">
                <div className="text-zinc-200 font-medium">Device Ready for Direct Install</div>
                <p className="text-[11px] text-zinc-400">
                  Your browser supports direct WebAPK installation right now:
                </p>
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install GATE Chrono App Now</span>
                </button>
              </div>
            )}

            {/* How WebAPK works */}
            <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-1.5">
              <div className="text-zinc-300 font-medium">2. Tap "Install App" or "Add to Home Screen"</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                In Chrome on Android, tap the three dots <span className="text-zinc-200 font-bold">⋮</span> at the top right and select <strong className="text-zinc-200">"Install app"</strong> (or "Add to Home screen").
              </p>
              <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-900">
                ✓ Android generates a native WebAPK with its own launcher icon, splash screen, offline caching, and full-screen window with zero address bar.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-medium">
                <Cpu className="w-4 h-4 text-zinc-400" />
                <span>Build Native .APK with Android Studio</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                This applet contains the complete, production-ready Kotlin Jetpack Compose source code matching this app:
              </p>

              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-zinc-400 pt-1">
                <li>
                  Open <strong className="text-zinc-200">Android Studio</strong> and select <em className="text-zinc-350">New Project &gt; Empty Activity (Compose)</em>.
                </li>
                <li>
                  Inspect and copy our Jetpack Compose files (<code className="text-zinc-300">TimerScreen.kt</code>, <code className="text-zinc-300">HeroProfileScreen.kt</code>, <code className="text-zinc-300">AchievementsScreen.kt</code>).
                </li>
                <li>
                  Click <strong className="text-zinc-200">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.
                </li>
                <li>
                  Your signed <code className="text-zinc-300">app-debug.apk</code> is created in <code className="text-zinc-400">app/build/outputs/apk/debug/</code> ready for sideloading to your phone!
                </li>
              </ol>

              <div className="pt-1 flex flex-col gap-2">
                <a
                  href="/gate-chrono-compose-project.zip"
                  download="gate-chrono-compose-project.zip"
                  className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Android Project (.ZIP)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenComposeCode();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Compose Kotlin Code</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
