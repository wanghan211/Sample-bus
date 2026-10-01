import React from 'react';

export type TabType = 'timings' | 'nearby' | 'routeMap' | 'favourites';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount = 2
}) => {
  const tabs = [
    { id: 'timings' as TabType, label: 'Timings', icon: 'directions_bus' },
    { id: 'nearby' as TabType, label: 'Nearby', icon: 'pin_drop' },
    { id: 'routeMap' as TabType, label: 'Route Map', icon: 'map' },
    { id: 'favourites' as TabType, label: 'Favourites', icon: 'star', badge: favoritesCount > 0 ? favoritesCount : undefined }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#faf8ff]/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 gap-0.5 relative transition-all cursor-pointer ${
                isActive
                  ? 'text-[#97001d] font-bold scale-105'
                  : 'text-slate-500 hover:text-[#97001d]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isActive ? 'filled' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#97001d] text-white text-[10px] font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#97001d] absolute bottom-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
