import React, { useState } from 'react';
import { BUS_SERVICES_DATA, RouteStop } from '../data/transitData';

interface ServiceDetailsViewProps {
  serviceNo: string;
  onBack: () => void;
  onTrackOnLiveMap: (serviceNo: string) => void;
  isFavoriteService: boolean;
  onToggleFavoriteService: () => void;
}

export const ServiceDetailsView: React.FC<ServiceDetailsViewProps> = ({
  serviceNo,
  onBack,
  onTrackOnLiveMap,
  isFavoriteService,
  onToggleFavoriteService
}) => {
  const [activeDirection, setActiveDirection] = useState<1 | 2>(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [countdownMinutes, setCountdownMinutes] = useState(3);

  const service = BUS_SERVICES_DATA[serviceNo] || BUS_SERVICES_DATA['65'];

  const dir1Label = serviceNo === '65' ? 'To Tampines' : `To ${service.destination}`;
  const dir2Label = serviceNo === '65' ? 'To HarbourFront' : `To ${service.origin}`;

  const terminusOrigin = activeDirection === 1 ? service.origin : service.destination;
  const terminusDest = activeDirection === 1 ? service.destination : service.origin;

  const stopsList: RouteStop[] = service.stops || [];
  const visibleStops = isExpanded ? stopsList : stopsList.slice(0, 6);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-28 pt-2">
      {/* Top Service Identification Panel */}
      <div className="px-3 sm:px-4 pt-1 pb-2">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#97001d] text-white font-extrabold text-[26px] px-3.5 py-1.5 rounded-lg flex items-center justify-center shadow-xs">
                {service.serviceNo}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-[#97001d] uppercase tracking-wider">
                  {service.category} Service
                </span>
                <h2 className="text-[18px] font-semibold text-slate-900 truncate">
                  Towards {activeDirection === 1 ? service.destination : service.origin}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleFavoriteService}
              aria-label="Toggle favourite"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ededf9] active:scale-90 transition-transform cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-colors ${
                  isFavoriteService ? 'filled text-[#D96623]' : 'text-slate-400'
                }`}
              >
                star
              </span>
            </button>
          </div>

          {/* Direction Switcher Pill Bar */}
          <div className="bg-[#e7e7f3] p-1 rounded-xl flex items-center mt-1">
            <button
              type="button"
              onClick={() => setActiveDirection(1)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeDirection === 1
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  activeDirection === 1 ? 'bg-[#97001d]' : 'bg-transparent'
                }`}
              ></span>
              <span className="truncate">{dir1Label}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveDirection(2)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeDirection === 2
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  activeDirection === 2 ? 'bg-[#97001d]' : 'bg-transparent'
                }`}
              ></span>
              <span className="truncate">{dir2Label}</span>
            </button>
          </div>

          {/* Route Terminus Breadcrumbs */}
          <div className="flex items-center justify-between text-slate-600 text-[12px] px-1 pt-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-[#97001d] shrink-0">
                trip_origin
              </span>
              <span className="truncate font-semibold text-slate-900">{terminusOrigin}</span>
            </div>
            <span className="material-symbols-outlined text-[14px] shrink-0 text-slate-400 mx-2">
              arrow_forward
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-[#8C1D40] shrink-0">
                pin_drop
              </span>
              <span className="truncate font-semibold text-slate-900">{terminusDest}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational & Frequency Bar */}
      <div className="px-3 sm:px-4 py-1">
        <div className="bg-[#f3f3ff] rounded-xl px-3 py-2 flex items-center justify-between border border-slate-200/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#0061a5]">schedule</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">First / Last Bus</span>
              <span className="font-mono text-[11px] font-semibold text-slate-900">
                {service.firstBus} • {service.lastBus}
              </span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#0061a5]">timelapse</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Current Frequency</span>
              <span className="font-mono text-[11px] font-semibold text-slate-900">
                {service.frequency}
              </span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#128848]">verified</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Status</span>
              <span className="text-[11px] text-[#128848] font-bold">{service.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nearest Stop Spotlight Card */}
      <div className="px-3 sm:px-4 pt-2">
        <div className="bg-gradient-to-br from-white to-[#f3f3ff] rounded-xl p-3.5 shadow-sm border border-slate-200/60 relative overflow-hidden">
          {/* Accent vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#97001d]"></div>

          <div className="flex items-center justify-between mb-1 pl-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad8] text-[#410007] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#97001d] animate-ping"></span>
                Nearest Stop
              </span>
              <span className="font-mono text-[11px] text-slate-600 bg-[#EBF0F5] px-1.5 py-0.5 rounded font-medium">
                B09022
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#97001d] font-semibold text-[12px]">
              <span className="material-symbols-outlined text-[15px]">near_me</span>
              <span>45m away</span>
            </div>
          </div>

          <h3 className="text-[18px] font-semibold text-slate-900 mb-2 pl-1 truncate">
            Opp Orchard Stn
          </h3>

          {/* Dual ETA Live Display */}
          <div className="grid grid-cols-2 gap-2.5 mt-1 pl-1">
            {/* 1st Approaching Bus */}
            <div className="bg-[#97001d]/5 rounded-xl p-2.5 border border-[#97001d]/15 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#97001d] uppercase tracking-wide">
                  Next Arrival
                </span>
                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-2xs border border-slate-200/60">
                  <span className="material-symbols-outlined text-[13px] text-slate-600" title="Double Decker Bus">
                    directions_bus
                  </span>
                  <span className="material-symbols-outlined text-[13px] text-[#0061a5]" title="Wheelchair Accessible">
                    accessible
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-[26px] font-extrabold text-[#97001d] leading-none">
                  {countdownMinutes <= 0 ? 'Arr' : countdownMinutes}
                </span>
                <span className="text-[12px] font-bold text-[#97001d]">mins</span>
              </div>
              <div className="flex items-center gap-1 mt-1 pt-1 border-t border-slate-200/40">
                <span className="w-2 h-2 rounded-full bg-[#128848] shrink-0"></span>
                <span className="text-[11px] font-bold text-[#128848]">Seats Available</span>
              </div>
            </div>

            {/* 2nd Approaching Bus */}
            <div className="bg-white rounded-xl p-2.5 shadow-2xs border border-slate-200/60 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                  Subsequent
                </span>
                <div className="flex items-center gap-1 bg-[#ededf9] px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px] text-slate-600" title="Single Deck Bus">
                    airport_shuttle
                  </span>
                  <span className="material-symbols-outlined text-[13px] text-[#0061a5]" title="Wheelchair Accessible">
                    accessible
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-[22px] font-extrabold text-slate-900 leading-none">14</span>
                <span className="text-[12px] font-medium text-slate-600">mins</span>
              </div>
              <div className="flex items-center gap-1 mt-1 pt-1 border-t border-slate-200/40">
                <span className="w-2 h-2 rounded-full bg-[#D96623] shrink-0"></span>
                <span className="text-[11px] font-semibold text-[#D96623]">Standing Avail.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity Legend Strip */}
      <div className="px-3 sm:px-4 pt-3 pb-1">
        <div className="bg-[#EBF0F5] rounded-lg px-3 py-1.5 flex items-center justify-between text-slate-700">
          <span className="text-[11px] font-medium text-slate-600">Capacity Indicator:</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#128848]"></span>
              <span className="text-[11px] font-medium">Seats</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D96623]"></span>
              <span className="text-[11px] font-medium">Standing</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#C0142C]"></span>
              <span className="text-[11px] font-medium">Limited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Section Title */}
      <div className="px-3 sm:px-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] text-[#97001d]">alt_route</span>
          <h3 className="text-[17px] font-semibold text-slate-900">Route Progression</h3>
        </div>
        <span className="font-mono text-[11px] text-slate-600 font-medium">
          Stop {service.currentStopIndex} of {service.totalStops}
        </span>
      </div>

      {/* Interactive Route Stop Timeline */}
      <div className="px-3 sm:px-4 pt-2 flex flex-col">
        {visibleStops.map((stop, idx) => {
          const isDeparted = stop.status === 'departed';
          const isCurrent = stop.status === 'current';
          const isUpcoming = stop.status === 'upcoming';

          return (
            <div key={stop.code} className="flex items-start gap-3 relative pb-5 group">
              {/* Connecting line */}
              {idx < visibleStops.length - 1 && (
                <div
                  className={`absolute left-[19px] top-6 bottom-0 w-0.5 ${
                    isDeparted ? 'bg-slate-300' : isCurrent ? 'bg-[#97001d]' : 'bg-slate-200'
                  }`}
                ></div>
              )}

              {/* Node Icon */}
              {isDeparted && (
                <div className="w-10 h-10 rounded-full bg-[#e7e7f3] flex items-center justify-center shrink-0 z-10 text-slate-600 shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
              )}

              {isCurrent && (
                <div className="w-10 h-10 rounded-full bg-[#97001d] flex items-center justify-center shrink-0 z-10 text-white shadow-md ring-4 ring-[#97001d]/20 animate-bounce">
                  <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                </div>
              )}

              {isUpcoming && (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 z-10 text-slate-700 shadow-xs border-2 border-slate-200 font-mono text-[12px] font-bold">
                  {stop.seq}
                </div>
              )}

              {/* Stop card body */}
              {isCurrent ? (
                <div className="flex-1 bg-white rounded-xl p-3 shadow-md border-2 border-[#97001d]/40 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] bg-[#97001d] text-white px-1.5 py-0.5 rounded font-bold">
                        {stop.code}
                      </span>
                      <span className="text-[11px] text-[#97001d] font-bold uppercase tracking-wider">
                        Your Location
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#128848]/15 text-[#128848] text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#128848]"></span>
                      Arriving
                    </span>
                  </div>
                  <h4 className="text-[16px] font-bold text-slate-900">{stop.name}</h4>
                  <span className="text-[12px] text-slate-500">{stop.road}</span>

                  {/* Arrival highlight bar inside active stop */}
                  <div className="bg-[#f3f3ff] rounded-lg p-2 flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-2xs">
                        <span className="material-symbols-outlined text-[16px] text-[#97001d]">
                          schedule
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-medium">ETA</span>
                        <span className="font-mono text-[11px] text-[#97001d] font-bold">
                          {stop.etaText || `~ ${countdownMinutes} min (11:42)`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#0061a5]" title="Double Decker Bus">
                        directions_bus
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#0061a5]" title="Wheelchair Accessible">
                        accessible
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[#128848]" title="Seats Available"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex-1 bg-white rounded-xl p-3 shadow-xs border border-slate-200/60 flex items-center justify-between hover:bg-[#f3f3ff] transition-colors ${
                    isDeparted ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-[10px] text-slate-600 bg-[#ededf9] px-1.5 py-0.5 rounded">
                        {stop.code}
                      </span>
                      {stop.isMrt ? (
                        <span className="text-[10px] text-[#0061a5] font-bold uppercase tracking-wider">
                          MRT Transfer
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 uppercase">
                          {isDeparted ? 'Departed' : 'Upcoming'}
                        </span>
                      )}
                    </div>
                    <h4 className="text-[15px] font-semibold text-slate-900 truncate">
                      {stop.name}
                    </h4>
                    <span className="text-[12px] text-slate-500 truncate">{stop.road}</span>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span className="font-mono text-[12px] font-bold text-slate-800">
                      {isDeparted ? stop.departedAgo : stop.etaText}
                    </span>
                    {stop.crowd && (
                      <span
                        className={`text-[10px] font-semibold ${
                          stop.crowd === 'seats'
                            ? 'text-[#128848]'
                            : stop.crowd === 'standing'
                            ? 'text-[#D96623]'
                            : 'text-[#C0142C]'
                        }`}
                      >
                        {stop.crowd === 'seats'
                          ? 'Seats'
                          : stop.crowd === 'standing'
                          ? 'Standing'
                          : 'Limited'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expand Full Route Trigger */}
      <div className="px-3 sm:px-4 pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2.5 bg-[#e7e7f3] hover:bg-[#d9d9e5] rounded-xl text-slate-900 font-semibold text-[13px] flex items-center justify-center gap-1 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
          <span>
            {isExpanded
              ? 'Collapse to key stops'
              : `View all ${service.totalStops} stops to ${service.destination}`}
          </span>
        </button>
      </div>

      {/* Floating Action Dock */}
      <div className="fixed bottom-6 inset-x-0 px-4 flex justify-center z-40 pointer-events-none">
        <button
          type="button"
          onClick={() => onTrackOnLiveMap(service.serviceNo)}
          className="pointer-events-auto bg-[#97001d] hover:bg-[#800018] text-white rounded-full px-6 py-3.5 shadow-xl flex items-center gap-2.5 font-bold text-[15px] active:scale-95 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">map</span>
          <span>Track on Live Map</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
