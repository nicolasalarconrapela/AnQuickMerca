import React from 'react';
import { useTranslation } from '../i18n';
import { ArrowLeft, Map, MapPin } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export function Onboarding({ onNext }: Props) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-background-dark">
      <header className="flex items-center p-6 justify-between">
        <button className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-primary">
          AnQuickMerca
        </h2>
      </header>

      <main className="flex-1 flex flex-col px-6">
        <div className="pt-8 pb-12 text-center">
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold leading-tight tracking-tight mb-6">
            Encuentra tu Mercadona más cercano
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-[300px] mx-auto">
            Necesitamos tu ubicación para optimizar tu recorrido en tienda.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center py-4">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full scale-100"></div>
            <div className="relative z-10 bg-white dark:bg-slate-800 p-10 rounded-[2rem] shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Map className="text-primary w-24 h-24" />
              <div className="absolute -top-3 -right-3 bg-primary text-white p-3.5 rounded-full shadow-lg border-4 border-white dark:border-slate-800">
                <MapPin className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12 pb-8 flex flex-col gap-4">
          <button 
            onClick={onNext}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg h-14 rounded-full shadow-md transition-all active:scale-[0.98] mb-2"
          >
            Permitir ubicación
          </button>
          <button 
            onClick={onNext}
            className="w-full py-4 text-primary font-bold text-base hover:underline transition-all"
          >
            Introducir código postal manualmente
          </button>
        </div>
      </main>

      <footer className="px-6 pb-10">
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center leading-normal font-medium">
          Tu ubicación solo se usa para encontrar tiendas cercanas.
        </p>
      </footer>
    </div>
  );
}
