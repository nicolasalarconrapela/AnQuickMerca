import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Edit2, Search, Minus, Plus, Trash2, ShoppingBasket, Route } from 'lucide-react';
import { Screen } from '../types';
import { useAppContext } from '../context/AppContext';

interface Props {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export function ListDetail({ onBack, onNavigate }: Props) {
  const { lists, activeListId, updateItemInList, removeItemFromList } = useAppContext();
  const list = lists.find(l => l.id === activeListId);

  if (!list) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Lista no encontrada</p>
        <button onClick={onBack} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg">Volver</button>
      </div>
    );
  }

  const items = list.items;

  const toggleCheck = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateItemInList(list.id, id, { checked: !item.checked });
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateItemInList(list.id, id, { quantity: newQuantity });
    }
  };

  const removeItem = (id: string) => {
    removeItemFromList(list.id, id);
  };

  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const totalEstimated = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-32 font-display">
      <header className="sticky top-0 z-30 bg-background-light dark:bg-background-dark px-4 pt-4 pb-2 border-b border-primary/10">
        <div className="flex items-center justify-between h-12">
          <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors">
            <MoreVertical className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center gap-2 group cursor-pointer">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{list.name}</h1>
            <Edit2 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-primary font-medium text-sm mt-0.5">{list.storeName}</p>
        </div>
      </header>

      <section className="px-4 py-4">
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm border border-primary/5">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Progreso de la lista</span>
            <span className="text-sm font-bold text-primary">{checkedCount} de {totalCount} productos</span>
          </div>
          <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </section>

      <section className="px-4 py-2">
        <div className="relative flex items-center cursor-text" onClick={() => onNavigate('product_search')}>
          <Search className="absolute left-4 text-primary w-5 h-5 pointer-events-none" />
          <input 
            type="text" 
            className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400 pointer-events-none"
            placeholder="Añadir producto a esta lista..." 
            readOnly
          />
        </div>
      </section>

      <main className="px-4 mt-4 space-y-3">
        {items.filter(i => !i.checked).map(item => (
          <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 group">
            <input 
              type="checkbox" 
              checked={item.checked}
              onChange={() => toggleCheck(item.id)}
              className="size-6 rounded border-2 border-primary/30 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer" 
            />
            <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-100 dark:border-slate-700">
              {item.image ? (
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/30">
                  <ShoppingBasket className="w-6 h-6" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{item.brand}</span>
                <span className="text-slate-300">•</span>
                {item.unit && <span>{item.unit}</span>}
                {item.unit && <span className="text-slate-300">•</span>}
                <span className="font-medium text-slate-600 dark:text-slate-300">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
              </div>
              <p className="text-[10px] font-medium text-primary/70 uppercase tracking-tight mt-0.5">{item.category}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-primary/5 dark:bg-primary/10 rounded-lg px-2 py-1">
                <button onClick={() => updateQuantity(item.id, -1)} className="text-primary font-bold px-1 hover:bg-primary/10 rounded">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mx-2 font-semibold text-slate-700 dark:text-slate-200">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="text-primary font-bold px-1 hover:bg-primary/10 rounded">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {items.filter(i => i.checked).map(item => (
          <div key={item.id} className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/30 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 opacity-60">
            <input 
              type="checkbox" 
              checked={item.checked}
              onChange={() => toggleCheck(item.id)}
              className="size-6 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-offset-0 bg-primary cursor-pointer" 
            />
            <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
               {item.image ? (
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-60" />
               ) : (
                  <ShoppingBasket className="w-6 h-6" />
               )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-slate-500 line-through">{item.name}</h3>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400">
                <span>{item.brand}</span>
                <span className="text-slate-300">•</span>
                {item.unit && <span>{item.unit}</span>}
                {item.unit && <span className="text-slate-300">•</span>}
                <span className="font-medium text-slate-400">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400/70 uppercase tracking-tight mt-0.5">{item.category}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-400">{item.quantity}x</span>
              <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <ShoppingBasket className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">Tu lista está vacía</p>
            <button
              onClick={() => onNavigate('product_search')}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Añadir productos
            </button>
          </div>
        )}
      </main>

      <button
        onClick={() => onNavigate('product_search')}
        className="fixed right-6 size-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 bottom-36"
      >
        <Plus className="w-8 h-8" />
      </button>

      <div className="fixed bottom-[88px] inset-x-0 max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3 z-40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total estimado</span>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-primary">{totalEstimated.toFixed(2).replace('.', ',')} €</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">IVA incluido</span>
        </div>
      </div>
      
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 pb-8 z-50 border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => onNavigate('layout_organization')}
          disabled={items.filter(i => !i.checked).length === 0}
          className="w-full bg-primary disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Route className="w-6 h-6" />
          {items.filter(i => !i.checked).length === 0 ? 'Lista completada' : 'Iniciar recorrido'}
        </button>
      </div>
    </div>
  );
}
