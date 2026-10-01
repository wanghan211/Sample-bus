import React, { useState, useEffect } from 'react';
import { playTransitChime } from '../utils/audio';
import { checkApiHealth, fetchLtaBusArrival } from '../services/ltaService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertBuffer: number;
  onSetAlertBuffer: (min: number) => void;
  walkingSpeed: string;
  onSetWalkingSpeed: (speed: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  alertBuffer,
  onSetAlertBuffer,
  walkingSpeed,
  onSetWalkingSpeed,
  soundEnabled,
  onToggleSound
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'commuter' | 'apiHealth'>('commuter');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeSubTab === 'apiHealth') {
      runHealthCheck();
    }
  }, [isOpen, activeSubTab]);

  const runHealthCheck = async () => {
    setIsCheckingHealth(true);
    const data = await checkApiHealth();
    setHealthStatus(data);
    setIsCheckingHealth(false);
  };

  const runTestBusArrival = async () => {
    setTestLoading(true);
    const data = await fetchLtaBusArrival('83139', '15');
    setTestResult(data);
    setTestLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-4.5 shadow-2xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#97001d] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-slate-900 leading-tight">
                Settings & API Monitor
              </h3>
              <span className="text-[11px] text-slate-500">SBS Transit & LTA DataMall v3</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center bg-[#ededf9] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveSubTab('commuter')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              activeSubTab === 'commuter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Commuter
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('apiHealth')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeSubTab === 'apiHealth' ? 'bg-white text-[#97001d] shadow-xs' : 'text-slate-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            API Health (/api)
          </button>
        </div>

        {activeSubTab === 'commuter' ? (
          <>
            {/* Section 1: Early Alert Lead Time */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#97001d]">alarm</span>
                Bus Arrival Alarm Lead Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 5].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      onSetAlertBuffer(mins);
                      if (soundEnabled) playTransitChime();
                    }}
                    className={`py-2 px-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                      alertBuffer === mins
                        ? 'bg-[#97001d] text-white shadow-xs'
                        : 'bg-[#ededf9] text-slate-700 hover:bg-[#e7e7f3]'
                    }`}
                  >
                    {mins} min before
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Walking Speed */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#0061a5]">directions_walk</span>
                Walking Speed (ETA adjustment)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'leisure', label: 'Leisurely', val: '3.5 km/h' },
                  { id: 'normal', label: 'Normal', val: '4.5 km/h' },
                  { id: 'brisk', label: 'Brisk', val: '5.5 km/h' }
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => onSetWalkingSpeed(sp.id)}
                    className={`p-2 rounded-xl text-center flex flex-col items-center transition-all cursor-pointer ${
                      walkingSpeed === sp.id
                        ? 'bg-[#0061a5] text-white shadow-xs'
                        : 'bg-[#ededf9] text-slate-700 hover:bg-[#e7e7f3]'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{sp.label}</span>
                    <span className="text-[9px] opacity-80">{sp.val}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Sound & Audio Feedback */}
            <div className="flex flex-col gap-2 p-3 bg-[#f3f3ff] rounded-2xl border border-slate-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#97001d]">volume_up</span>
                  <span className="text-[13px] font-bold text-slate-900">Transit Audio Chime</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-[#97001d]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Audio plays when alarm is armed.</span>
                <button
                  type="button"
                  onClick={() => playTransitChime()}
                  className="text-[11px] font-bold text-[#97001d] hover:underline cursor-pointer"
                >
                  Test Chime
                </button>
              </div>
            </div>
          </>
        ) : (
          /* API Health Monitor Tab */
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[12px] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Endpoint Health:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[10px] font-bold">
                  {healthStatus?.status === 'ok' ? 'HEALTHY 200 OK' : 'CHECKING...'}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-slate-600 font-mono">
                <div>• /api/health</div>
                <div>• /api/bus-arrival (v3)</div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-sans">LTA_ACCOUNT_KEY:</span>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      healthStatus?.environment?.ltaAccountKeyConfigured
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {healthStatus?.environment?.ltaAccountKeyConfigured
                      ? 'Detected'
                      : 'Pending in Vercel'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans">
                  {healthStatus?.environment?.ltaAccountKeyConfigured
                    ? 'Official live feed connected directly to LTA DataMall v3.'
                    : 'Add LTA_ACCOUNT_KEY in your Vercel Project Settings -> Environment Variables. The app automatically proxies live data.'}
                </p>
              </div>
            </div>

            {/* Test Call Trigger */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={isCheckingHealth}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                Check /api/health
              </button>
              <button
                type="button"
                onClick={runTestBusArrival}
                disabled={testLoading}
                className="flex-1 py-2 bg-[#97001d] text-white hover:bg-[#800018] rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">directions_bus</span>
                Test 83139 / svc 15
              </button>
            </div>

            {/* Test result preview */}
            {testResult && (
              <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-xl max-h-40 overflow-y-auto no-scrollbar border border-slate-700">
                <div className="text-white font-sans text-[11px] font-bold mb-1">
                  Response preview (Stop {testResult.BusStopCode}):
                </div>
                <pre>{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[14px] hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
