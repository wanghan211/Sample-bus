import React, { useState } from 'react';
import { BUS_STOPS_DATA, BUS_SERVICES_DATA } from '../data/transitData';

interface RouteMapViewProps {
  initialStopCode?: string;
  onSelectBus: (serviceNo: string) => void;
  onViewServiceDetails: (serviceNo: string) => void;
}

export const RouteMapView: React.FC<RouteMapViewProps> = ({
  initialStopCode,
  onSelectBus,
  onViewServiceDetails
}) => {
  const [selectedRoute, setSelectedRoute] = useState<'all' | '14' | '65' | '174'>('65');
  const [selectedStopCode, setSelectedStopCode] = useState<string | null>(initialStopCode || 'B09022');
  const [showMrtOverlay, setShowMrtOverlay] = useState(true);

  const stops = [
    { code: 'B08031', name: 'Dhoby Ghaut Stn', x: 280, y: 190, road: 'Penang Rd', mrt: 'NS24/NE6/CC1' },
    { code: 'B08121', name: 'Somerset Stn', x: 210, y: 170, road: 'Somerset Rd', mrt: 'NS23' },
    { code: 'B09022', name: 'Opp Orchard Stn', x: 130, y: 150, road: 'Orchard Blvd', mrt: 'NS22/TE14' },
    { code: 'B09048', name: 'Lucky Plaza', x: 155, y: 140, road: 'Orchard Rd', mrt: 'NS22' },
    { code: 'B09011', name: 'Bef Orchard Blvd', x: 75, y: 165, road: 'Paterson Rd' },
    { code: 'B08111', name: 'Concorde Hotel', x: 245, y: 180, road: 'Orchard Rd' },
    { code: 'B05019', name: 'Clarke Quay Stn', x: 295, y: 245, road: 'Eu Tong Sen St', mrt: 'NE5' }
  ];

  const currentStop = stops.find(s => s.code === selectedStopCode) || stops[2];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-[calc(100vh-128px)] relative overflow-hidden bg-slate-900 text-white">
      {/* Top Filter and Controls Bar */}
      <div className="absolute top-2 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-700/80 shadow-lg flex items-center gap-1 pointer-events-auto">
          {(['65', '14', '174', 'all'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRoute(r)}
              className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                selectedRoute === r
                  ? 'bg-[#97001d] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {r === 'all' ? 'All Lines' : `Bus ${r}`}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowMrtOverlay(!showMrtOverlay)}
          className={`pointer-events-auto px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1 shadow-lg ${
            showMrtOverlay
              ? 'bg-[#0061a5] border-[#66afff] text-white'
              : 'bg-slate-800/90 border-slate-700 text-slate-300'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">train</span>
          MRT
        </button>
      </div>

      {/* Interactive Vector Transit Map Canvas */}
      <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          viewBox="0 0 380 340"
          className="w-full h-full bg-[#171a26]"
          style={{ touchAction: 'none' }}
        >
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#25293a" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="busGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c0142c" />
              <stop offset="100%" stopColor="#97001d" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="#161824" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Green Parks / Urban Zones */}
          <path
            d="M 20 40 Q 60 20 100 50 T 120 100 T 50 120 Z"
            fill="#128848"
            opacity="0.12"
          />
          <text x="50" y="70" fill="#128848" opacity="0.4" fontSize="9" fontFamily="sans-serif">
            Botanic / Tanglin
          </text>

          <path
            d="M 250 80 Q 290 60 340 70 T 360 140 T 300 130 Z"
            fill="#128848"
            opacity="0.12"
          />
          <text x="280" y="105" fill="#128848" opacity="0.4" fontSize="9" fontFamily="sans-serif">
            Fort Canning Park
          </text>

          {/* MRT Lines (Red NS Line & Blue Downtown Line) */}
          {showMrtOverlay && (
            <g opacity="0.7">
              {/* North-South Line (Red) */}
              <path
                d="M 40 180 L 130 150 L 210 170 L 280 190 L 310 240 L 330 300"
                fill="none"
                stroke="#d42e12"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 3"
              />
              {/* Downtown Line (Blue) */}
              <path
                d="M 130 150 L 170 190 L 240 220 L 295 245"
                fill="none"
                stroke="#0056b3"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 3"
              />
            </g>
          )}

          {/* Major Urban Arterial Roads */}
          {/* Orchard Boulevard / Road Corridor */}
          <path
            d="M 30 180 L 75 165 L 130 150 L 155 140 L 210 170 L 245 180 L 280 190 L 350 210"
            fill="none"
            stroke="#33394f"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 30 180 L 75 165 L 130 150 L 155 140 L 210 170 L 245 180 L 280 190 L 350 210"
            fill="none"
            stroke="#474f6d"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Eu Tong Sen / Clarke Quay link */}
          <path
            d="M 280 190 L 295 245 L 320 310"
            fill="none"
            stroke="#33394f"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Active Bus Route Polylines */}
          {(selectedRoute === '65' || selectedRoute === 'all') && (
            <g>
              <path
                d="M 50 175 L 75 165 L 130 150 L 210 170 L 245 180 L 280 190 L 350 200"
                fill="none"
                stroke="#c0142c"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </g>
          )}

          {(selectedRoute === '14' || selectedRoute === 'all') && (
            <path
              d="M 30 180 L 75 165 L 130 150 L 210 170 L 280 190 L 295 245 L 340 280"
              fill="none"
              stroke="#D96623"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Live Moving Buses */}
          {/* Bus 65 moving toward Orchard */}
          <g transform="translate(100, 157)">
            <circle r="12" fill="#c0142c" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" />
            <text x="0" y="3.5" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
              65
            </text>
            <circle r="14" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
          </g>

          {/* Bus 14 at Somerset */}
          <g transform="translate(230, 176)">
            <circle r="12" fill="#c0142c" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" />
            <text x="0" y="3.5" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
              14
            </text>
          </g>

          {/* User Location Pulse (GPS) */}
          <g transform="translate(125, 160)">
            <circle r="16" fill="#0061a5" opacity="0.3" className="animate-ping" />
            <circle r="8" fill="#0061a5" stroke="#fff" strokeWidth="2.5" />
            <text x="12" y="4" fill="#9fcaff" fontSize="9" fontWeight="bold">
              You (ION)
            </text>
          </g>

          {/* Bus Stops Nodes */}
          {stops.map((stop) => {
            const isSelected = stop.code === selectedStopCode;
            return (
              <g
                key={stop.code}
                transform={`translate(${stop.x}, ${stop.y})`}
                onClick={() => setSelectedStopCode(stop.code)}
                className="cursor-pointer group"
              >
                <circle
                  r={isSelected ? 9 : 6}
                  fill={isSelected ? '#c0142c' : '#ffffff'}
                  stroke={isSelected ? '#ffffff' : '#474f6d'}
                  strokeWidth={isSelected ? 2.5 : 2}
                  className="transition-all duration-200"
                />
                {isSelected && (
                  <circle r="13" fill="none" stroke="#c0142c" strokeWidth="1.5" opacity="0.8" />
                )}
                <text
                  x="0"
                  y={isSelected ? -14 : -10}
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize={isSelected ? '9.5' : '8'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="bg-black/50"
                >
                  {stop.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Recenter & Map Tools Floating Buttons */}
        <div className="absolute right-3 top-14 flex flex-col gap-2 z-20">
          <button
            type="button"
            onClick={() => setSelectedStopCode('B09022')}
            aria-label="Center on GPS location"
            className="w-10 h-10 rounded-full bg-slate-800/90 text-white border border-slate-700 shadow-md flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-[#38bdf8]">my_location</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoute('all')}
            aria-label="Show all routes"
            className="w-10 h-10 rounded-full bg-slate-800/90 text-white border border-slate-700 shadow-md flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Inspector Sheet for Selected Stop */}
      <div className="absolute bottom-2 inset-x-3 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#97001d] text-white font-mono text-[11px] font-bold">
              {currentStop.code}
            </span>
            <h3 className="font-bold text-[16px] text-white truncate max-w-[180px]">
              {currentStop.name}
            </h3>
          </div>
          {currentStop.mrt && (
            <span className="px-2 py-0.5 rounded-full bg-[#0061a5]/30 text-[#9fcaff] text-[10px] font-mono font-bold border border-[#0061a5]/50">
              MRT {currentStop.mrt}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-slate-400 text-[12px]">
          <span>{currentStop.road}</span>
          <span className="text-[#38bdf8] font-medium">Next bus approaching in 2 min</span>
        </div>

        {/* Live Arrivals Pills inside Bottom Sheet */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => {
              onSelectBus('14');
              onViewServiceDetails('14');
            }}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-7 rounded bg-[#c0142c] text-white font-extrabold text-[14px] flex items-center justify-center">
                14
              </span>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-white">Bedok</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Arr • Seats</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectBus('65');
              onViewServiceDetails('65');
            }}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-7 rounded bg-[#c0142c] text-white font-extrabold text-[14px] flex items-center justify-center">
                65
              </span>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-white">Tampines</span>
                <span className="text-[10px] text-amber-400 font-semibold">3m • Stand</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
