import React, { useState } from 'react';
import { ArrowLeft, MapPin, Search, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AVAILABLE_STORES } from '../types';
import { useTranslation } from '../i18n';

interface Props {
  onNext: () => void;
}

export function StoreSelection({ onNext }: Props) {
  const { selectedStore, setSelectedStore, favoriteStores, setFavoriteStores } = useAppContext();
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(selectedStore?.id || null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const store = AVAILABLE_STORES.find(s => s.id === id);
    if (store) {
      setSelectedStore(store);
    }
    setTimeout(() => {
      onNext();
    }, 300);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (favoriteStores.includes(id)) {
      setFavoriteStores(favoriteStores.filter(storeId => storeId !== id));
    } else {
      if (favoriteStores.length >= 5) {
        alert(t.store_favorites_limit);
        return;
      }
      setFavoriteStores([...favoriteStores, id]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-slate-900">
      <header className="flex items-center p-4 gap-4">
        {selectedStore && (
           <button
             onClick={onNext}
             className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
           >
             <ArrowLeft className="w-6 h-6" />
           </button>
        )}
        <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 text-slate-900 dark:text-slate-100">
          {t.store_select_title}
        </h1>
      </header>

      <main className="flex-1 px-4 py-2">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          {t.store_description}
        </p>

        <div className="flex items-center gap-2 text-primary font-medium mb-4">
          <MapPin className="w-5 h-5" />
          <span>Sevilla, España</span>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder={t.store_postal_placeholder} 
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <button className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl transition-colors">
            {t.store_search_button}
          </button>
        </div>

        <div className="space-y-3">
          {AVAILABLE_STORES.map(store => {
            const isFavorite = favoriteStores.includes(store.id);
            return (
              <div
                key={store.id}
                onClick={() => handleSelect(store.id)}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedId === store.id
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'
                }`}
              >
                <div className="mr-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedId === store.id ? 'border-primary' : 'border-slate-300'
                  }`}>
                    {selectedId === store.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{store.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <span>{store.address}</span>
                  </div>
                </div>

                <button
                   onClick={(e) => toggleFavorite(e, store.id)}
                   className={`p-2 rounded-full ${isFavorite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-200'}`}
                >
                  <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
