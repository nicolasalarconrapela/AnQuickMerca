import React, { useState, useEffect } from 'react';
import { Screen, ShoppingList } from './types';
import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { StoreSelection } from './screens/StoreSelection';
import { Home } from './screens/Home';
import { ProductSearch } from './screens/ProductSearch';
import { ListDetail } from './screens/ListDetail';
import { LayoutOrganization } from './screens/LayoutOrganization';
import { ActiveNavigation } from './screens/ActiveNavigation';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  useTheme(); // Inicializa el hook y lo mantiene sincronizado

  useEffect(() => {
    // Simulate splash screen delay
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigate = (screen: Screen, params?: any) => {
    if (params?.listId) {
      setSelectedListId(params.listId);
    }
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden relative shadow-2xl">
      {currentScreen === 'splash' && <Splash />}
      {currentScreen === 'onboarding' && <Onboarding onNext={() => navigate('store_selection')} />}
      {currentScreen === 'store_selection' && <StoreSelection onNext={() => navigate('home')} />}
      {currentScreen === 'home' && <Home onNavigate={navigate} />}
      {currentScreen === 'product_search' && <ProductSearch onBack={() => navigate('home')} />}
      {currentScreen === 'list_detail' && <ListDetail listId={selectedListId} onBack={() => navigate('home')} onNavigate={navigate} />}
      {currentScreen === 'layout_organization' && <LayoutOrganization onBack={() => navigate('list_detail')} onNext={() => navigate('active_navigation')} />}
      {currentScreen === 'active_navigation' && <ActiveNavigation onBack={() => navigate('list_detail')} />}
    </div>
  );
}

