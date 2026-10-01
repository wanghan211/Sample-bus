import React, { useState } from 'react';
import { BUS_SERVICES_DATA, BusService, CrowdDensity } from '../data/transitData';
import { playTransitChime } from '../utils/audio';

interface TimingsViewProps {
  selectedBusNo: string;
  onSelectBus: (serviceNo: string) => void;
  onViewServiceDetails: (serviceNo: string) => void;
  isFavoriteStop: boolean;
  onToggleFavoriteStop: () => void;
}

export const TimingsView: React.FC<TimingsViewProps> = ({
  selectedBusNo,
  onSelectBus,
  onViewServiceDetails,
  isFavoriteStop,
  onToggleFavoriteStop
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedBusNo);
  const [alertArmed, setAlertArmed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const quickChips = ['14', '65', '174', '502', '190', '7'];

  // Current service data or fallback
  const currentService: BusService =
    BUS_SERVICES_DATA[selectedBusNo] ||
    BUS_SERVICES_DATA['14'] || {
      serviceNo: selectedBusNo,
      category: 'Trunk',
      operator: 'SBS Transit',
      origin: 'Loop Ter',
      destination: `Service ${selectedBusNo} Terminus`,
      viaText: 'via City Transit Corridor',
      firstBus: '05:30',
      lastBus: '23:30',
      frequency: '8 - 12 mins',
      status: 'On Time',
      totalStops: 32,
      currentStopIndex: 12,
      arrivals: [
        { etaMinutes: 'Arr', crowd: 'seats', deck: 'DD', wab: true },
        { etaMinutes: 8, crowd: 'standing', deck: 'SD', wab: true },
        { etaMinutes: 19, crowd: 'seats', deck: 'DD', wab: true }
      ],
      approachTracker: {
        stopsAway: 2,
        prevStop: 'Previous Stop',
        busCurrentStop: 'Approaching Station',
        targetStop: 'You are here'
      },
      stops: []
    };

  const handleSelectChip = (bus: string) => {
    onSelectBus(bus);
    setSearchQuery(bus);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toUpperCase();
    setSearchQuery(val);
    if (BUS_SERVICES_DATA[val]) {
      onSelectBus(val);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleArmAlert = () => {
    playTransitChime();
    setAlertArmed(true);
    setToastMessage(`Chime alarm armed for Bus ${selectedBusNo} (Opp Orchard Stn) 3 min before arrival.`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  const otherServices = [
    { serviceNo: '65', dest: 'Tampines Int', deckText: 'Double Decker • WAB', eta: '4 min', isArr: false, crowd: 'seats' as CrowdDensity, crowdText: 'Seats' },
    { serviceNo: '124', dest: 'Telok Blangah Heights', deckText: 'Single Deck • WAB', eta: 'Arr', isArr: true, crowd: 'standing' as CrowdDensity, crowdText: 'Standing' },
    { serviceNo: '143', dest: 'Jurong East Temp Int', deckText: 'Double Decker • WAB', eta: '7 min', isArr: false, crowd: 'seats' as CrowdDensity, crowdText: 'Seats' },
    { serviceNo: '167', dest: 'Bukit Merah Int', deckText: 'Single Deck • WAB', eta: '12 min', isArr: false, crowd: 'crowded' as CrowdDensity, crowdText: 'Crowded' },
    { serviceNo: '174', dest: 'Boon Lay Int', deckText: 'Double Decker • WAB', eta: '15 min', isArr: false, crowd: 'seats' as CrowdDensity, crowdText: 'Seats' }
  ];

  return (
    <div className="flex flex-col w-full px-3 sm:px-4 max-w-md mx-auto pb-24 pt-2 gap-3">
      {/* Interactive Search & Service Input Section */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="relative flex items-center bg-[#ededf9] rounded-xl px-3 py-2 shadow-xs border border-slate-200/50">
          <span className="material-symbols-outlined text-[#97001d] text-[22px] shrink-0 mr-2 select-none">
            directions_bus
          </span>
          <input
            id="busInput"
            type="search"
            inputMode="numeric"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter Bus Service No. e.g. 14, 65, 190"
            className="w-full bg-transparent text-[18px] font-semibold text-slate-900 placeholder:text-slate-500/70 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear bus number"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-[#97001d] active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Quick Bus Number Chips Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Quick:
          </span>
          {quickChips.map((bus) => {
            const isSelected = selectedBusNo === bus;
            return (
              <button
                key={bus}
                type="button"
                onClick={() => handleSelectChip(bus)}
                className={`px-3 py-1 rounded-full font-mono text-[12px] font-semibold shadow-xs active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#97001d] text-white shadow-sm'
                    : 'bg-[#ededf9] text-slate-800 hover:bg-[#e7e7f3]'
                }`}
              >
                {bus}
              </button>
            );
          })}
        </div>
      </section>

      {/* Detected Nearest Bus Stop Card */}
      <section className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200/60 flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d2e4ff] text-[#001d37] text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[13px] filled">near_me</span>
                Nearest Stop
              </span>
              <span className="font-mono text-[11px] text-slate-600 bg-[#ededf9] px-2 py-0.5 rounded">
                B09022
              </span>
            </div>
            <h2 className="text-[17px] font-semibold text-slate-900 truncate">
              Opp Orchard Stn / ION Orchard
            </h2>
            <div className="text-[12px] text-slate-600 flex items-center gap-1.5 flex-wrap">
              <span>Orchard Blvd</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[#97001d] font-medium">85m away</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-0.5 text-[#128848] font-medium">
                <span className="material-symbols-outlined text-[13px]">directions_walk</span> 1 min walk
              </span>
            </div>
          </div>

          {/* Favorite Stop Toggle */}
          <button
            type="button"
            onClick={onToggleFavoriteStop}
            aria-label="Add stop to favorites"
            className="w-10 h-10 shrink-0 rounded-full bg-[#f3f3ff] flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-colors ${
                isFavoriteStop ? 'filled text-[#D96623]' : 'text-slate-400'
              }`}
            >
              star
            </span>
          </button>
        </div>

        {/* Mini Static Street Visual Accent with Corridor Info */}
        <div className="relative w-full h-16 rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 shadow-inner">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]"></div>
          <div className="absolute inset-0 flex items-center px-3.5">
            <div className="flex items-center gap-2.5 text-white">
              <span className="material-symbols-outlined text-[#9fcaff] text-[22px]">signpost</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#EBF0F5] uppercase tracking-wide">
                  Transit Corridor
                </span>
                <span className="font-mono text-[11px] text-slate-200">
                  Downtown • North-South MRT Link
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Searched Bus Hero Card (e.g. Service 14) */}
      <section className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200/60 flex flex-col gap-3">
        {/* Service Header Banner */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-16 h-12 rounded-lg bg-[#c0142c] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-[26px] font-extrabold tracking-tight">
                {currentService.serviceNo}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#97001d] uppercase font-bold tracking-wide">
                  {currentService.operator}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#ededf9] text-slate-600 font-mono text-[10px]">
                  {currentService.category}
                </span>
              </div>
              <p className="text-[17px] font-semibold text-slate-900 truncate">
                to {currentService.destination}
              </p>
              <span className="text-[12px] text-slate-600 flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[13px] shrink-0">alt_route</span>{' '}
                {currentService.viaText}
              </span>
            </div>
          </div>

          {/* Live Notification Bell */}
          <button
            type="button"
            onClick={handleArmAlert}
            aria-label="Set Arrival Notification"
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all shrink-0 cursor-pointer ${
              alertArmed ? 'bg-[#97001d] text-white shadow-sm' : 'bg-[#ededf9] text-slate-600 hover:text-[#97001d]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {alertArmed ? 'notifications_active' : 'notifications'}
            </span>
          </button>
        </div>

        {/* Arrival Trio (LTA / SBS Transit Layout) */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {/* 1st Bus (Next) */}
          <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-[#ffdad8]/35 border border-[#c0142c]/20 shadow-xs relative">
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-[#97001d] font-bold">NEXT</span>
              <span className="material-symbols-outlined text-[13px] text-slate-500" title="Wheelchair Accessible">
                accessible
              </span>
            </div>
            <div className="py-1 flex flex-col items-center">
              <span className="text-[26px] font-extrabold text-[#97001d] tracking-tight animate-pulse leading-none">
                Arr
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#128848]"></span>
                <span className="text-[11px] font-semibold text-[#128848]">Seats</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-1 text-slate-500 pt-0.5">
              <span className="material-symbols-outlined text-[14px]" title="Double Decker Bus">
                directions_bus
              </span>
              <span className="font-mono text-[10px] text-slate-600 font-bold">DD</span>
            </div>
          </div>

          {/* 2nd Bus */}
          <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-[#ededf9]/70 border border-slate-200/50 shadow-xs">
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-semibold">2ND</span>
              <span className="material-symbols-outlined text-[13px] text-slate-500" title="Wheelchair Accessible">
                accessible
              </span>
            </div>
            <div className="py-1 flex flex-col items-center">
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="text-[22px] font-bold text-slate-900">9</span>
                <span className="text-[11px] text-slate-600">min</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#D96623]"></span>
                <span className="text-[11px] font-semibold text-[#D96623]">Standing</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-1 text-slate-500 pt-0.5">
              <span className="material-symbols-outlined text-[14px]" title="Single Deck Bus">
                airport_shuttle
              </span>
              <span className="font-mono text-[10px] text-slate-600 font-bold">SD</span>
            </div>
          </div>

          {/* 3rd Bus */}
          <div className="flex flex-col items-center justify-between p-2 rounded-lg bg-[#ededf9]/70 border border-slate-200/50 shadow-xs">
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-semibold">3RD</span>
              <span className="material-symbols-outlined text-[13px] text-slate-500" title="Wheelchair Accessible">
                accessible
              </span>
            </div>
            <div className="py-1 flex flex-col items-center">
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="text-[22px] font-bold text-slate-900">18</span>
                <span className="text-[11px] text-slate-600">min</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#128848]"></span>
                <span className="text-[11px] font-semibold text-[#128848]">Seats</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-1 text-slate-500 pt-0.5">
              <span className="material-symbols-outlined text-[14px]" title="Double Decker Bus">
                directions_bus
              </span>
              <span className="font-mono text-[10px] text-slate-600 font-bold">DD</span>
            </div>
          </div>
        </div>

        {/* Live Micro Timeline / Approach Diagram */}
        <div className="bg-[#EBF0F5]/80 rounded-xl p-3 flex flex-col gap-2 border border-slate-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-800 uppercase tracking-wide flex items-center gap-1">
              <span className="material-symbols-outlined text-[#97001d] text-[15px]">radar</span> Live Approach Tracker
            </span>
            <span className="font-mono text-[11px] text-[#97001d] font-bold">
              {currentService.approachTracker.stopsAway} stops away
            </span>
          </div>

          {/* Stepper / Track */}
          <div className="relative flex items-center justify-between w-full pt-2 pb-1 px-3">
            {/* Connecting Line Track */}
            <div className="absolute left-6 right-6 top-5 h-1 bg-[#e7e7f3] rounded-full -translate-y-1/2"></div>
            <div className="absolute left-6 w-2/3 top-5 h-1 bg-[#97001d] rounded-full -translate-y-1/2"></div>

            {/* Stop 1: Delfi Orchard */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-300">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              </div>
              <span className="text-[10px] text-slate-600 text-center max-w-[64px] truncate">
                {currentService.approachTracker.prevStop}
              </span>
            </div>

            {/* Stop 2: Thai Embassy (Bus Icon current position) */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-[#97001d] text-white flex items-center justify-center shadow-md animate-bounce">
                <span className="material-symbols-outlined text-[15px]">directions_bus</span>
              </div>
              <span className="text-[10px] text-[#97001d] font-bold text-center max-w-[70px] truncate">
                {currentService.approachTracker.busCurrentStop}
              </span>
            </div>

            {/* Stop 3: Current Stop (Opp Orchard Stn) */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-[#128848] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[12px]">location_on</span>
              </div>
              <span className="text-[10px] text-slate-900 font-semibold text-center max-w-[70px] truncate">
                {currentService.approachTracker.targetStop}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Tray */}
        <div className="flex flex-col gap-2 pt-0.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleArmAlert}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-semibold text-[13px] active:scale-95 transition-all shadow-xs cursor-pointer ${
                alertArmed
                  ? 'bg-[#0061a5] text-white'
                  : 'bg-[#97001d] hover:bg-[#800018] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {alertArmed ? 'alarm_on' : 'notification_add'}
              </span>
              <span>{alertArmed ? 'Alert Armed' : 'Alert 3m before'}</span>
            </button>
            <button
              type="button"
              onClick={() => onViewServiceDetails(currentService.serviceNo)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#ededf9] text-slate-900 font-semibold text-[13px] hover:bg-[#e7e7f3] active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">route</span>
              <span>View {currentService.totalStops} Stops</span>
            </button>
          </div>

          {/* Toast Notification Box */}
          {showToast && (
            <div className="py-2 px-3 rounded-lg bg-[#d2e4ff] text-[#001d37] text-[12px] flex items-center justify-between border border-[#9fcaff] shadow-xs">
              <span className="flex items-center gap-1.5 min-w-0 pr-1 truncate">
                <span className="material-symbols-outlined text-[16px] text-[#0061a5] shrink-0">check_circle</span>
                <span className="truncate">{toastMessage}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="font-bold uppercase text-[10px] text-[#0061a5] shrink-0 cursor-pointer ml-1"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Other Buses at Same Stop Section */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-semibold text-slate-900">Other Services at This Stop</h3>
            <span className="font-mono text-[11px] bg-[#ededf9] text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              5 more
            </span>
          </div>
          <span className="text-[12px] text-slate-500 font-medium">Live LTA Feed</span>
        </div>

        {/* List of Other Buses */}
        <div className="flex flex-col gap-2">
          {otherServices.map((bus) => (
            <div
              key={bus.serviceNo}
              onClick={() => {
                onSelectBus(bus.serviceNo);
                setSearchQuery(bus.serviceNo);
              }}
              className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/60 flex items-center justify-between hover:bg-[#EBF0F5]/50 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-12 h-10 rounded-lg bg-[#97001d] text-white flex items-center justify-center shrink-0 font-bold text-[18px]">
                  {bus.serviceNo}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[14px] text-slate-900 truncate">
                    {bus.dest}
                  </span>
                  <span className="text-[12px] text-slate-500 truncate">
                    {bus.deckText}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-end">
                  <span
                    className={`text-[17px] font-bold ${
                      bus.isArr ? 'text-[#97001d] animate-pulse' : 'text-slate-900'
                    }`}
                  >
                    {bus.eta}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        bus.crowd === 'seats'
                          ? 'bg-[#128848]'
                          : bus.crowd === 'standing'
                          ? 'bg-[#D96623]'
                          : 'bg-[#C0142C]'
                      }`}
                    ></span>
                    <span
                      className={`text-[10px] font-semibold ${
                        bus.crowd === 'seats'
                          ? 'text-[#128848]'
                          : bus.crowd === 'standing'
                          ? 'text-[#D96623]'
                          : 'text-[#C0142C]'
                      }`}
                    >
                      {bus.crowdText}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commuter Info Banner & Legend */}
      <footer className="bg-[#EBF0F5] rounded-xl p-3 flex flex-col gap-2 mt-1 border border-slate-200/50">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Crowd Density Key</span>
          <span className="font-mono text-[10px]">LTA DataMall API 2.0</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#128848] shrink-0"></span>
            <span className="text-[11px] text-slate-800 font-medium">Seats Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D96623] shrink-0"></span>
            <span className="text-[11px] text-slate-800 font-medium">Standing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C0142C] shrink-0"></span>
            <span className="text-[11px] text-slate-800 font-medium">Limited / Full</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
