import React from 'react';
import { SBS_TRANSIT_LOGO_URL } from '../data/transitData';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onRefresh?: () => void;
  onOpenSettings?: () => void;
  isRefreshing?: boolean;
  nearestStopCode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = 'SBS Transit',
  showBack = false,
  onBack,
  onRefresh,
  onOpenSettings,
  isRefreshing = false,
  nearestStopCode = '09048 Orchard'
}) => {
  return (
    <header className="sticky top-0 w-full z-50 bg-[#faf8ff]/92 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-3 sm:px-4 max-w-md mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/60 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          {/* Logo with 3 red slashes or hotlinked image */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-auto flex items-center">
              <img
                src={SBS_TRANSIT_LOGO_URL}
                alt="SBS Transit"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  // Fallback to stylized SVG SBS logo if image link ever fails
                  (e.target as HTMLElement).style.display = 'none';
                  const fb = (e.target as HTMLElement).nextElementSibling;
                  if (fb) fb.classList.remove('hidden');
                }}
              />
              <div className="hidden items-center gap-1">
                <div className="flex items-center space-x-0.5">
                  <span className="w-1.5 h-6 bg-[#97001d] -skew-x-12 inline-block rounded-xs"></span>
                  <span className="w-1.5 h-6 bg-[#97001d] -skew-x-12 inline-block rounded-xs"></span>
                  <span className="w-1.5 h-6 bg-[#97001d] -skew-x-12 inline-block rounded-xs"></span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-[#97001d] uppercase tracking-wider leading-none">
                {subtitle}
              </span>
              <h1 className="text-[18px] font-semibold text-slate-900 leading-tight truncate">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 shrink-0">
          {nearestStopCode && !showBack && (
            <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
              <span className="material-symbols-outlined text-[14px] text-[#97001d]">near_me</span>
              <span className="font-mono text-[11px] font-medium truncate max-w-[100px]">
                {nearestStopCode}
              </span>
            </div>
          )}

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh arrival timings"
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:text-[#97001d] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-transform duration-500 ${
                isRefreshing ? 'rotate-180 text-[#97001d]' : ''
              }`}
            >
              sync
            </span>
          </button>

          {/* User profile / Settings button */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Commuter settings"
            className="w-8 h-8 rounded-full bg-[#97001d] text-white flex items-center justify-center shrink-0 hover:bg-[#800018] active:scale-95 transition-transform shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
