import React from 'react';
import { BUS_SERVICES_DATA, BUS_STOPS_DATA } from '../data/transitData';

interface FavouritesViewProps {
  onSelectBus: (serviceNo: string) => void;
  onViewServiceDetails: (serviceNo: string) => void;
  favoriteStops: Record<string, boolean>;
  onToggleFavoriteStop: (code: string) => void;
  favoriteServices: Record<string, boolean>;
  onToggleFavoriteService: (serviceNo: string) => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  onSelectBus,
  onViewServiceDetails,
  favoriteStops,
  onToggleFavoriteStop,
  favoriteServices,
  onToggleFavoriteService
}) => {
  const starredStops = BUS_STOPS_DATA.filter((s) => favoriteStops[s.code] ?? s.isFavorite);
  const starredServices = Object.keys(BUS_SERVICES_DATA).filter(
    (key) => favoriteServices[key] || key === '14' || key === '65'
  );

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-3 sm:px-4 py-3 pb-24 gap-3.5">
      {/* Smart Commute Quick Cards */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
            Daily Commute Presets
          </span>
          <span className="text-[11px] text-[#97001d] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#128848] animate-pulse"></span>
            Live Timings
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Preset 1: Morning to Tampines */}
          <div
            onClick={() => {
              onSelectBus('65');
              onViewServiceDetails('65');
            }}
            className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/60 flex flex-col justify-between hover:bg-[#f3f3ff] transition-colors cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Morning Commute
                </span>
                <span className="material-symbols-outlined text-[15px] text-[#97001d]">
                  wb_sunny
                </span>
              </div>
              <div className="flex items-center gap-1.5 my-1">
                <span className="w-7 h-6 rounded bg-[#c0142c] text-white font-extrabold text-[13px] flex items-center justify-center">
                  65
                </span>
                <span className="text-[13px] font-bold text-slate-900 truncate">To Tampines</span>
              </div>
              <span className="text-[11px] text-slate-500 truncate block">Opp Orchard Stn</span>
            </div>
            <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#128848]">Arr in 3m</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Preset 2: Evening to Bedok */}
          <div
            onClick={() => {
              onSelectBus('14');
              onViewServiceDetails('14');
            }}
            className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/60 flex flex-col justify-between hover:bg-[#f3f3ff] transition-colors cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Evening Return
                </span>
                <span className="material-symbols-outlined text-[15px] text-[#0061a5]">
                  nights_stay
                </span>
              </div>
              <div className="flex items-center gap-1.5 my-1">
                <span className="w-7 h-6 rounded bg-[#c0142c] text-white font-extrabold text-[13px] flex items-center justify-center">
                  14
                </span>
                <span className="text-[13px] font-bold text-slate-900 truncate">To Bedok</span>
              </div>
              <span className="text-[11px] text-slate-500 truncate block">Somerset Stn</span>
            </div>
            <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#128848]">Arr Now</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Starred Bus Stops */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-slate-900">Starred Bus Stops</h3>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#ededf9] text-slate-700 font-semibold">
              {starredStops.length}
            </span>
          </div>
        </div>

        {starredStops.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-dashed border-slate-300 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-slate-400">star_outline</span>
            <p className="text-[13px] text-slate-600">No starred bus stops yet. Tap the star icon on any bus stop to save it here for fast access.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {starredStops.map((stop) => (
              <div
                key={stop.code}
                className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/60 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[#ededf9] text-slate-900 font-bold">
                        {stop.code}
                      </span>
                      <span className="text-[12px] text-slate-500 font-medium">
                        {stop.distanceMeters}m away
                      </span>
                    </div>
                    <h4 className="text-[16px] font-semibold text-slate-900 truncate">
                      {stop.name}
                    </h4>
                    <span className="text-[12px] text-slate-500 truncate">{stop.road}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavoriteStop(stop.code)}
                    className="w-9 h-9 rounded-full bg-[#ededf9] flex items-center justify-center text-[#D96623] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px] filled">star</span>
                  </button>
                </div>

                {/* Quick services badge strip */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto no-scrollbar">
                  {stop.services.map((s) => (
                    <button
                      key={s.serviceNo}
                      type="button"
                      onClick={() => {
                        onSelectBus(s.serviceNo);
                        onViewServiceDetails(s.serviceNo);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#f3f3ff] hover:bg-[#ededf9] text-slate-900 font-mono text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border border-slate-200/40"
                    >
                      <span className="w-5 h-5 rounded bg-[#97001d] text-white flex items-center justify-center text-[10px]">
                        {s.serviceNo}
                      </span>
                      <span className="text-[11px] font-bold text-[#128848]">
                        {s.arrivals[0]?.etaMinutes === 'Arr' ? 'Arr' : `${s.arrivals[0]?.etaMinutes}m`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Starred Bus Routes */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-slate-900">Starred Bus Routes</h3>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#ededf9] text-slate-700 font-semibold">
              {starredServices.length}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {starredServices.map((busNo) => {
            const svc = BUS_SERVICES_DATA[busNo];
            if (!svc) return null;
            return (
              <div
                key={busNo}
                onClick={() => {
                  onSelectBus(busNo);
                  onViewServiceDetails(busNo);
                }}
                className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/60 flex items-center justify-between hover:bg-[#f3f3ff] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-10 rounded-lg bg-[#97001d] text-white flex items-center justify-center font-extrabold text-[18px] shrink-0 shadow-2xs">
                    {svc.serviceNo}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[14px] text-slate-900 truncate">
                      Towards {svc.destination}
                    </span>
                    <span className="text-[12px] text-slate-500 truncate">
                      {svc.operator} • Frequency {svc.frequency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#128848] font-bold bg-[#128848]/10 px-2 py-0.5 rounded-full">
                    {svc.status}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    chevron_right
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
