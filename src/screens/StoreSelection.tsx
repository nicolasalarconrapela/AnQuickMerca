import React, { useState } from 'react';
import { ArrowLeft, MapPin, Search, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Props {
  onNext: () => void;
}

export function StoreSelection({ onNext }: Props) {
  const { selectedStore, setSelectedStore } = useAppContext();
  const [selectedId, setSelectedId] = useState<string | null>(selectedStore?.id || null);

  const stores = [
    { id: '1', name: 'Mercadona Sevilla Centro', address: 'Calle San Eloy, 15, 41001 Sevilla', favorite: false },
    { id: '2', name: 'Mercadona Nervión', address: 'Av. de Eduardo Dato, 64, 41005 Sevilla', favorite: true },
    { id: '3', name: 'Mercadona Los Remedios', address: 'Calle Arcos, 14, 41011 Sevilla', favorite: false },
  ];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const store = stores.find(s => s.id === id);
    if (store) {
      setSelectedStore(store);
    }
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-slate-900">
      <header className="flex items-center p-4 gap-4">
        <button 
          onClick={onNext}
          className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 text-slate-900 dark:text-slate-100">
          Selecciona tu Mercadona
        </h1>
      </header>

      <main className="flex-1 px-4 py-2">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Elige tu tienda principal y guarda hasta 5 favoritos para acceder rápido.
        </p>

        <div className="flex items-center gap-2 text-primary font-medium mb-4">
          <MapPin className="w-5 h-5" />
          <span>Sevilla, España</span>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className="w-5 h-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Introduce código postal..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <button className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Buscar
          </button>
        </div>

        <div className="space-y-3">
          {stores.map(store => (
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
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
              </div>

              <button className={`p-2 rounded-full ${store.favorite ? 'text-amber-400' : 'text-slate-300'}`}>
                <Star className="w-5 h-5" fill={store.favorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
