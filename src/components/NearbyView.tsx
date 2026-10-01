import React, { useState } from 'react';
import { BUS_STOPS_DATA, MAP_PREVIEW_URL, BusStop } from '../data/transitData';

interface NearbyViewProps {
  onSelectBus: (serviceNo: string) => void;
  onOpenRouteMap: (stopCode?: string) => void;
  favorites: Record<string, boolean>;
  onToggleFavorite: (stopCode: string) => void;
}

export const NearbyView: React.FC<NearbyViewProps> = ({
  onSelectBus,
  onOpenRouteMap,
  favorites,
  onToggleFavorite
}) => {
  const [filterMode, setFilterMode] = useState<'walking' | 'all'>('walking');
  const [searchFilter, setSearchFilter] = useState('');
  const [showDirectionsModal, setShowDirectionsModal] = useState<BusStop | null>(null);

  const stops = BUS_STOPS_DATA.filter((stop) => {
    if (filterMode === 'walking' && stop.distanceMeters > 300) return false;
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    const hasService = stop.services.some(s => s.serviceNo.toLowerCase().includes(q)) ||
                       stop.alsoServing.some(s => s.toLowerCase().includes(q));
    const hasText = stop.name.toLowerCase().includes(q) || stop.code.toLowerCase().includes(q) || stop.road.toLowerCase().includes(q);
    return hasService || hasText;
  });

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-24">
      {/* Interactive Map Preview with Ambient Overlays */}
      <div className="relative w-full h-56 bg-slate-800 overflow-hidden shadow-sm">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('${MAP_PREVIEW_URL}')`
          }}
        ></div>

        {/* Subtle Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf8ff] via-transparent to-black/30 pointer-events-none"></div>

        {/* Active Map Marker HUD */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 pointer-events-auto border border-slate-200/50">
            <span className="w-2 h-2 rounded-full bg-[#128848] animate-pulse"></span>
            <span className="font-mono text-[11px] font-semibold text-slate-800">
              GPS Locked · ±4m
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenRouteMap()}
            aria-label="Recenter map"
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#97001d] active:scale-90 transition-transform pointer-events-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
        </div>

        {/* Map Pins Overlay representation */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* User Position Pulse */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-[#0061a5]/30 animate-ping"></div>
            <div className="w-5 h-5 rounded-full bg-[#0061a5] flex items-center justify-center shadow-lg border-2 border-white">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Stop 1 Pin (Opp Orchard Stn 09022) */}
          <button
            type="button"
            onClick={() => onOpenRouteMap('09022')}
            className="pointer-events-auto absolute -translate-x-14 -translate-y-9 flex flex-col items-center group cursor-pointer"
          >
            <div className="bg-[#97001d] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[11px]">directions_bus</span>
              09022
            </div>
            <div className="w-2 h-2 bg-[#97001d] rotate-45 -mt-1"></div>
          </button>

          {/* Stop 2 Pin (Lucky Plaza 09048) */}
          <button
            type="button"
            onClick={() => onOpenRouteMap('09048')}
            className="pointer-events-auto absolute translate-x-16 -translate-y-12 flex flex-col items-center group cursor-pointer"
          >
            <div className="bg-white text-slate-900 border border-slate-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[11px] text-[#97001d]">directions_bus</span>
              09048
            </div>
            <div className="w-2 h-2 bg-white border-r border-b border-slate-300 rotate-45 -mt-1"></div>
          </button>

          {/* Stop 3 Pin (Bef Orchard Blvd 09011) */}
          <button
            type="button"
            onClick={() => onOpenRouteMap('09011')}
            className="pointer-events-auto absolute -translate-x-20 translate-y-10 flex flex-col items-center group cursor-pointer"
          >
            <div className="bg-white text-slate-900 border border-slate-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[11px] text-[#97001d]">directions_bus</span>
              09011
            </div>
            <div className="w-2 h-2 bg-white border-r border-b border-slate-300 rotate-45 -mt-1"></div>
          </button>
        </div>

        {/* Map Expand Floating CTA */}
        <div className="absolute bottom-2.5 right-3 pointer-events-auto">
          <button
            type="button"
            onClick={() => onOpenRouteMap()}
            className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-slate-700 hover:text-[#97001d] flex items-center gap-1.5 active:scale-95 transition-all text-[12px] font-semibold cursor-pointer border border-slate-200/60"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_full</span>
            <span>Expand Map</span>
          </button>
        </div>
      </div>

      {/* Main View Container */}
      <div className="px-3 sm:px-4 py-3 flex flex-col gap-3">
        {/* Range Distance Filter Pill-Tabs */}
        <div className="flex items-center justify-between gap-2">
          <div className="bg-[#EBF0F5] p-1 rounded-full flex items-center flex-1 shadow-inner">
            <button
              type="button"
              onClick={() => setFilterMode('walking')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                filterMode === 'walking'
                  ? 'bg-white text-[#97001d] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">directions_walk</span>
              <span>≤ 300m Walk</span>
              <span className="w-4 h-4 rounded-full bg-[#97001d]/10 text-[#97001d] flex items-center justify-center text-[10px] font-bold">
                3
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-[#97001d] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>All Nearby</span>
            </button>
          </div>

          <button
            type="button"
            aria-label="Sort options"
            className="w-10 h-10 rounded-full bg-[#f3f3ff] border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-[#97001d] active:scale-95 shadow-2xs transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">sort</span>
          </button>
        </div>

        {/* Search shortcut bar */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search bus number or route from here..."
            className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-[14px] pl-10 pr-9 py-2.5 rounded-xl shadow-xs border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-[#97001d]/30"
          />
          {searchFilter ? (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute right-3 text-slate-400 hover:text-[#97001d] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          ) : (
            <button
              type="button"
              aria-label="Voice search"
              className="absolute right-3 text-slate-400 hover:text-[#97001d] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
          )}
        </div>

        {/* Section Heading with Live Count */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-semibold text-slate-900">Nearest Stops</h2>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#e7e7f3] text-slate-700 font-semibold">
              {stops.length} found
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#128848] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#128848] animate-ping"></span>
            <span>Real-time LTA feed</span>
          </div>
        </div>

        {/* List of Nearby Stops */}
        <div className="flex flex-col gap-3.5">
          {stops.map((stop) => {
            const isFav = favorites[stop.code] ?? stop.isFavorite;

            return (
              <div
                key={stop.code}
                className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200/60 flex flex-col gap-2.5"
              >
                {/* Stop Meta Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[#EBF0F5] text-slate-900 font-bold tracking-wider">
                        {stop.code}
                      </span>
                      <span className="text-[11px] text-[#97001d] flex items-center gap-0.5 font-bold">
                        <span className="material-symbols-outlined text-[14px]">directions_walk</span>{' '}
                        {stop.distanceMeters}m · {stop.walkMinutes} min
                      </span>
                    </div>
                    <h3 className="text-[17px] font-semibold text-slate-900 truncate">
                      {stop.name}
                    </h3>
                    <span className="text-[12px] text-slate-500 truncate">
                      {stop.road} · {stop.description}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(stop.code)}
                    aria-label="Bookmark stop"
                    className="w-9 h-9 rounded-full bg-[#EBF0F5] flex items-center justify-center text-slate-400 hover:text-[#D96623] active:scale-95 transition-colors cursor-pointer shrink-0"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isFav ? 'filled text-[#D96623]' : ''
                      }`}
                    >
                      star
                    </span>
                  </button>
                </div>

                {/* Quick Action Buttons: Enter Bus # & Directions */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onSelectBus(stop.services[0]?.serviceNo || '14')}
                    className="flex-1 py-1.5 px-3 bg-[#f3f3ff] hover:bg-[#ededf9] text-slate-900 text-[12px] font-semibold rounded-lg flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer border border-slate-200/50"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#97001d]">pin</span>
                    <span>Enter Bus #</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDirectionsModal(stop)}
                    className="flex-1 py-1.5 px-3 bg-[#0061a5] hover:bg-[#004e85] text-white text-[12px] font-semibold rounded-lg flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-2xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">turn_right</span>
                    <span>Directions</span>
                  </button>
                </div>

                {/* Bus Live Grid for Stop */}
                <div className="pt-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Serving Services
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Live Arrivals</span>
                  </div>

                  {stop.services.map((svc) => (
                    <div
                      key={svc.serviceNo}
                      onClick={() => onSelectBus(svc.serviceNo)}
                      className="bg-[#f3f3ff]/70 hover:bg-[#ededf9] rounded-lg p-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer border border-slate-200/40"
                    >
                      <div className="flex items-center gap-2.5 min-w-[76px]">
                        <div className="w-11 h-8 rounded-md bg-[#c0142c] text-white flex items-center justify-center font-bold text-[16px] shadow-xs">
                          {svc.serviceNo}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[10px] text-slate-600 truncate max-w-[80px]">
                            {svc.destination}
                          </span>
                          <span className="material-symbols-outlined text-[13px] text-slate-500">
                            accessible
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-1 justify-end">
                        {svc.arrivals.map((arr, arrIdx) => {
                          const isArr = arr.etaMinutes === 'Arr';
                          return (
                            <div
                              key={arrIdx}
                              className={`flex flex-col items-center px-2 py-1 rounded-md min-w-[46px] ${
                                isArr
                                  ? 'bg-[#97001d]/10 text-[#97001d]'
                                  : 'bg-white shadow-2xs border border-slate-200/50'
                              }`}
                            >
                              <span
                                className={`text-[12px] font-bold leading-none ${
                                  isArr ? 'text-[#97001d] font-extrabold animate-pulse' : 'text-slate-900'
                                }`}
                              >
                                {isArr ? 'Arr' : `${arr.etaMinutes}m`}
                              </span>
                              <span
                                className={`flex items-center gap-0.5 text-[9px] font-semibold mt-0.5 ${
                                  arr.crowd === 'seats'
                                    ? 'text-[#128848]'
                                    : arr.crowd === 'standing'
                                    ? 'text-[#D96623]'
                                    : 'text-[#C0142C]'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    arr.crowd === 'seats'
                                      ? 'bg-[#128848]'
                                      : arr.crowd === 'standing'
                                      ? 'bg-[#D96623]'
                                      : 'bg-[#C0142C]'
                                  }`}
                                ></span>
                                {arr.crowd === 'seats' ? 'Seats' : arr.crowd === 'standing' ? 'Stand' : 'Full'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Horizontal scroll tags for other buses at this stop */}
                  {stop.alsoServing.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                      <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">
                        Also serving:
                      </span>
                      {stop.alsoServing.map((otherBus) => (
                        <button
                          key={otherBus}
                          type="button"
                          onClick={() => onSelectBus(otherBus)}
                          className="px-2 py-0.5 rounded-md bg-[#ededf9] hover:bg-[#e7e7f3] text-slate-800 font-mono text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                        >
                          {otherBus}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Commuter Delight Prompt / Footnote */}
        <div className="p-3.5 rounded-xl bg-[#ededf9] border border-slate-200/60 flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-full bg-[#66afff]/25 text-[#004172] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">info</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-slate-900">
              Heading towards Somerset?
            </span>
            <span className="text-[12px] text-slate-600">
              Stop 09048 (Lucky Plaza) gives you 4 direct routes with lower crowd volume right now.
            </span>
          </div>
        </div>
      </div>

      {/* Walking Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0061a5]">directions_walk</span>
                <h4 className="font-bold text-[16px] text-slate-900">Walking Route</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectionsModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 bg-[#f3f3ff] rounded-xl flex flex-col gap-1">
                <span className="font-mono text-[11px] text-[#0061a5] font-bold">
                  Target Stop: {showDirectionsModal.code}
                </span>
                <span className="font-semibold text-slate-900 text-[14px]">
                  {showDirectionsModal.name}
                </span>
                <span className="text-slate-600 text-[12px]">{showDirectionsModal.road}</span>
              </div>

              <div className="flex items-center justify-between py-1 px-2 text-[13px]">
                <span className="text-slate-600">Estimated Walking Time:</span>
                <span className="font-bold text-[#128848]">
                  {showDirectionsModal.walkMinutes} min ({showDirectionsModal.distanceMeters}m)
                </span>
              </div>

              <p className="text-slate-600 text-[12px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                1. Walk east on Orchard Boulevard towards ION Orchard Exit 1.<br/>
                2. Cross the sheltered pedestrian crossing.<br/>
                3. The bus shelter is directly ahead.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowDirectionsModal(null);
                onOpenRouteMap(showDirectionsModal.code);
              }}
              className="w-full py-2.5 bg-[#0061a5] text-white rounded-xl font-bold text-[13px] active:scale-95 transition-all shadow-xs"
            >
              Open in Live Route Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
