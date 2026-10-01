/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { TimingsView } from './components/TimingsView';
import { ServiceDetailsView } from './components/ServiceDetailsView';
import { NearbyView } from './components/NearbyView';
import { RouteMapView } from './components/RouteMapView';
import { FavouritesView } from './components/FavouritesView';
import { SettingsModal } from './components/SettingsModal';
import { playTransitChime } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('timings');
  const [currentView, setCurrentView] = useState<'main' | 'serviceDetails'>('main');
  const [selectedBusNo, setSelectedBusNo] = useState<string>('14');
  const [selectedRouteMapStop, setSelectedRouteMapStop] = useState<string>('B09022');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Commuter preferences
  const [alertBuffer, setAlertBuffer] = useState<number>(3);
  const [walkingSpeed, setWalkingSpeed] = useState<string>('normal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Favorites
  const [favoriteStops, setFavoriteStops] = useState<Record<string, boolean>>({
    'B09022': true
  });
  const [favoriteServices, setFavoriteServices] = useState<Record<string, boolean>>({
    '14': true,
    '65': true
  });

  const handleToggleFavoriteStop = (code: string) => {
    setFavoriteStops(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const handleToggleFavoriteService = (serviceNo: string) => {
    setFavoriteServices(prev => ({
      ...prev,
      [serviceNo]: !prev[serviceNo]
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (soundEnabled) {
      playTransitChime();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleSelectBus = (busNo: string) => {
    setSelectedBusNo(busNo);
  };

  const handleViewServiceDetails = (busNo: string) => {
    setSelectedBusNo(busNo);
    setCurrentView('serviceDetails');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleOpenRouteMap = (stopCode?: string) => {
    if (stopCode) {
      setSelectedRouteMapStop(stopCode);
    }
    setCurrentView('main');
    setActiveTab('routeMap');
  };

  const handleTrackOnLiveMap = (busNo: string) => {
    setSelectedBusNo(busNo);
    setCurrentView('main');
    setActiveTab('routeMap');
  };

  // Switch tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Header Title derivation
  const getHeaderTitle = () => {
    if (currentView === 'serviceDetails') return 'Bus Service Details';
    switch (activeTab) {
      case 'timings':
        return 'Bus Timings';
      case 'nearby':
        return 'Nearby Stops';
      case 'routeMap':
        return 'Route Map';
      case 'favourites':
        return 'Favourites';
      default:
        return 'Bus Timings';
    }
  };

  // Count favorites
  const totalFavorites = Object.values(favoriteStops).filter(Boolean).length +
                         Object.values(favoriteServices).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        title={getHeaderTitle()}
        subtitle="SBS Transit"
        showBack={currentView === 'serviceDetails'}
        onBack={handleBackToMain}
        onRefresh={handleRefresh}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isRefreshing={isRefreshing}
        nearestStopCode={activeTab === 'nearby' ? undefined : '09048 Orchard'}
      />

      {/* Main View Port Container */}
      <main className="flex-1 w-full relative">
        {currentView === 'serviceDetails' ? (
          <ServiceDetailsView
            serviceNo={selectedBusNo}
            onBack={handleBackToMain}
            onTrackOnLiveMap={handleTrackOnLiveMap}
            isFavoriteService={!!favoriteServices[selectedBusNo]}
            onToggleFavoriteService={() => handleToggleFavoriteService(selectedBusNo)}
          />
        ) : (
          <>
            {activeTab === 'timings' && (
              <TimingsView
                selectedBusNo={selectedBusNo}
                onSelectBus={handleSelectBus}
                onViewServiceDetails={handleViewServiceDetails}
                isFavoriteStop={!!favoriteStops['B09022']}
                onToggleFavoriteStop={() => handleToggleFavoriteStop('B09022')}
              />
            )}

            {activeTab === 'nearby' && (
              <NearbyView
                onSelectBus={(bus) => {
                  setSelectedBusNo(bus);
                  handleViewServiceDetails(bus);
                }}
                onOpenRouteMap={handleOpenRouteMap}
                favorites={favoriteStops}
                onToggleFavorite={handleToggleFavoriteStop}
              />
            )}

            {activeTab === 'routeMap' && (
              <RouteMapView
                initialStopCode={selectedRouteMapStop}
                onSelectBus={handleSelectBus}
                onViewServiceDetails={handleViewServiceDetails}
              />
            )}

            {activeTab === 'favourites' && (
              <FavouritesView
                onSelectBus={handleSelectBus}
                onViewServiceDetails={handleViewServiceDetails}
                favoriteStops={favoriteStops}
                onToggleFavoriteStop={handleToggleFavoriteStop}
                favoriteServices={favoriteServices}
                onToggleFavoriteService={handleToggleFavoriteService}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Bottom Tab Navigation (Only in Tab views) */}
      {currentView === 'main' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          favoritesCount={totalFavorites}
        />
      )}

      {/* Commuter Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        alertBuffer={alertBuffer}
        onSetAlertBuffer={setAlertBuffer}
        walkingSpeed={walkingSpeed}
        onSetWalkingSpeed={setWalkingSpeed}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />
    </div>
  );
}
