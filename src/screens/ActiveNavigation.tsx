import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function ActiveNavigation({ onBack }: Props) {
  const [swiped, setSwiped] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwiped(direction);
    setTimeout(() => {
      setSwiped(null);
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex-col px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <span className="text-primary text-xs font-bold uppercase tracking-widest">3 de 8 productos</span>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
        
        <button className="flex items-center justify-between w-full bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Pasillo actual</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Zona: Secos</span>
          </div>
          <ChevronDown className="text-primary w-5 h-5" />
        </button>
        
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: '37.5%' }}></div>
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
              <span className="text-[10px] font-bold text-rose-500 uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>No lo encuentro</span>
            </div>

            <div className={`relative aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl z-20 mx-4 transition-transform duration-300 ${swiped === 'left' ? '-translate-x-full opacity-0' : swiped === 'right' ? 'translate-x-full opacity-0' : ''}`}>
              <img 
                src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop" 
                alt="Tomate pera" 
                className="w-full h-full object-cover"
              />
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
            <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100">Tomate pera</h2>
            <p className="text-slate-500 font-medium">Marca: <span className="text-slate-900 dark:text-slate-100 font-bold">Hacendado</span></p>
          </div>

          <div className="mx-auto bg-primary/10 dark:bg-primary/20 px-6 py-3 rounded-2xl flex items-center gap-4 border border-primary/20">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-black text-primary tracking-widest leading-none mb-1">Necesitas</span>
              <span className="text-4xl font-black text-primary leading-none">6</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-6">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 justify-center">
            <div className="flex-shrink-0 size-10 rounded-lg bg-slate-100 opacity-40 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1587049352847-4d4b12405451?w=100&h=100&fit=crop" alt="Previous" className="w-full h-full object-cover" />
            </div>
            <div className="flex-shrink-0 size-12 rounded-xl border-2 border-primary ring-4 ring-primary/10 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop" alt="Current" className="w-full h-full object-cover" />
            </div>
            <div className="flex-shrink-0 size-10 rounded-lg bg-slate-100 opacity-40 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=100&h=100&fit=crop" alt="Next" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Desliza para confirmar o descartar
          </p>
        </div>
      </main>
    </div>
  );
}
