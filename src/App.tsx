import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { StoreSelection } from './screens/SpainMap';
import { Home } from './screens/Home';
import { ListDetail } from './screens/ListDetail';
import { LayoutOrganization } from './screens/LayoutOrganization';
import { ActiveNavigation } from './screens/ActiveNavigation';
import { MapDemo } from './screens/MapDemo';
import { AppProvider, useAppContext } from './context/AppContext';
import { APP_VERSION } from './version';
import { LogViewer } from './components/LogViewer';

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [showLogs, setShowLogs] = useState(false);
  const { setActiveListId, lists } = useAppContext();

  useEffect(() => {
    // Simulate splash screen delay
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        // Skip onboarding directly to store selection as requested
        const hasStore = localStorage.getItem('selectedStore');
        if (hasStore) {
          setCurrentScreen('home');
        } else {
          setCurrentScreen('store_selection'); // Used to be onboarding
        }
      }, 2000); // match progress bar time approx
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigate = (screen: Screen, params?: any) => {
    if (params?.listId) {
      setActiveListId(params.listId);
    }
    setCurrentScreen(screen);
  };

  const [clickCount, setClickCount] = useState(0);
  const handleVersionClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowLogs(true);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden relative shadow-2xl">
      {currentScreen === 'splash' && <Splash />}
      {currentScreen === 'onboarding' && <Onboarding onNext={() => navigate('store_selection')} />}
      {currentScreen === 'store_selection' && <StoreSelection onNext={() => navigate('home')} />}
      {currentScreen === 'home' && <Home onNavigate={navigate} />}
      {currentScreen === 'list_detail' && <ListDetail onBack={() => navigate('home')} onNavigate={navigate} />}
      {currentScreen === 'layout_organization' && <LayoutOrganization onBack={() => navigate('list_detail')} onNext={() => navigate('active_navigation')} />}
      {currentScreen === 'active_navigation' && <ActiveNavigation onBack={() => navigate('list_detail')} />}
      {currentScreen === 'map_demo' && <MapDemo onBack={() => navigate('home')} />}

      {/* Global version tag */}
      <div
        className="absolute bottom-2 left-4 z-50 cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
        onClick={handleVersionClick}
      >
        <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 select-none">
          v{APP_VERSION}
        </span>
      </div>

      {showLogs && <LogViewer onClose={() => setShowLogs(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
