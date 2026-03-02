import React, { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronDown, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ListItem } from '../types';

interface Props {
  onBack: () => void;
}

export function ActiveNavigation({ onBack }: Props) {
  const [swiped, setSwiped] = useState<'left' | 'right' | null>(null);
  const { lists, activeListId, updateItemInList } = useAppContext();

  const list = lists.find(l => l.id === activeListId);
  const [itemsToFind, setItemsToFind] = useState<ListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (list) {
      setItemsToFind(list.items.filter(i => !i.checked));
    }
  }, [list]);

  const currentItem = itemsToFind[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwiped(direction);

    setTimeout(() => {
      if (direction === 'right' && currentItem && list) {
        // Mark as checked
        updateItemInList(list.id, currentItem.id, { checked: true });

        // Move to next item or finish if it was the last one
        const newItemsToFind = itemsToFind.filter((_, idx) => idx !== currentIndex);
        setItemsToFind(newItemsToFind);

        if (newItemsToFind.length === 0) {
           onBack(); // Go back when finished
        } else {
           // We keep the index at 0 or advance depending on how we want to manage it.
           // Since we are filtering the list, the current index might just point to the next one automatically.
           setCurrentIndex(prev => Math.min(prev, newItemsToFind.length - 1));
        }
      } else if (direction === 'left') {
        // Just skip to the next item
        setCurrentIndex(prev => (prev + 1) % itemsToFind.length);
      }
      setSwiped(null);
    }, 500);
  };

  if (!currentItem || itemsToFind.length === 0) {
     return (
        <div className="flex flex-col min-h-screen w-full bg-white dark:bg-slate-900 items-center justify-center p-6 text-center">
           <div className="size-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12" />
           </div>
           <h2 className="text-2xl font-bold mb-2">¡Todo encontrado!</h2>
           <p className="text-slate-500 mb-8">Has completado todos los productos de esta sección.</p>
           <button onClick={onBack} className="w-full bg-primary text-white font-bold py-4 rounded-xl">Volver a la lista</button>
        </div>
     );
  }

  const prevItem = currentIndex > 0 ? itemsToFind[currentIndex - 1] : itemsToFind[itemsToFind.length - 1];
  const nextItem = currentIndex < itemsToFind.length - 1 ? itemsToFind[currentIndex + 1] : itemsToFind[0];

  const totalChecked = list?.items.filter(i => i.checked).length || 0;
  const totalItems = list?.items.length || 0;
  const progressPercent = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex-col px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <span className="text-primary text-xs font-bold uppercase tracking-widest">{totalChecked} de {totalItems} productos</span>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
        
        <button className="flex items-center justify-between w-full bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Pasillo actual</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Zona: {currentItem.category}</span>
          </div>
          <ChevronDown className="text-primary w-5 h-5" />
        </button>
        
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-6 gap-6">
          <div className="relative group">
            <div className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 transition-opacity ${swiped === 'left' ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
              <button 
                onClick={() => handleSwipe('left')}
                className="size-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-bold text-rose-500 uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Saltar</span>
            </div>

            <div className={`relative aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl z-20 mx-4 transition-transform duration-300 ${swiped === 'left' ? '-translate-x-full opacity-0' : swiped === 'right' ? 'translate-x-full opacity-0' : ''}`}>
               {currentItem.image ? (
                  <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    className="w-full h-full object-cover"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                     <span className="text-primary font-bold text-2xl">{currentItem.name.substring(0,2)}</span>
                  </div>
               )}
            </div>

            <div className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 transition-opacity ${swiped === 'right' ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
              <button 
                onClick={() => handleSwipe('right')}
                className="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Check className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-bold text-primary uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>He cogido</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100">{currentItem.name}</h2>
            <p className="text-slate-500 font-medium">Marca: <span className="text-slate-900 dark:text-slate-100 font-bold">{currentItem.brand}</span></p>
          </div>

          <div className="mx-auto bg-primary/10 dark:bg-primary/20 px-6 py-3 rounded-2xl flex items-center gap-4 border border-primary/20">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-black text-primary tracking-widest leading-none mb-1">Necesitas</span>
              <span className="text-4xl font-black text-primary leading-none">{currentItem.quantity}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-6">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 justify-center">
            {itemsToFind.length > 1 && (
               <div className="flex-shrink-0 size-10 rounded-lg bg-slate-100 opacity-40 overflow-hidden">
                  {prevItem.image ? <img src={prevItem.image} alt={prevItem.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200"></div>}
               </div>
            )}

            <div className="flex-shrink-0 size-12 rounded-xl border-2 border-primary ring-4 ring-primary/10 overflow-hidden bg-white">
              {currentItem.image ? <img src={currentItem.image} alt="Current" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{currentItem.name.substring(0,1)}</div>}
            </div>

            {itemsToFind.length > 1 && (
               <div className="flex-shrink-0 size-10 rounded-lg bg-slate-100 opacity-40 overflow-hidden">
                  {nextItem.image ? <img src={nextItem.image} alt={nextItem.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200"></div>}
               </div>
            )}
          </div>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Desliza para confirmar o saltar
          </p>
        </div>
      </main>
    </div>
  );
}
