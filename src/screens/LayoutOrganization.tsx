import React from 'react';
import { ArrowRight, X, MapPin, Apple, Coffee, Snowflake, Droplets, Lock, Menu } from 'lucide-react';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

export function LayoutOrganization({ onBack, onNext }: Props) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      <div className="bg-rose-500 text-white p-4 flex items-center justify-between rounded-b-2xl shadow-md z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white text-rose-500 flex items-center justify-center font-bold text-sm">!</div>
          <span className="font-medium text-sm">Error de ubicación: No se puede colocar aquí</span>
        </div>
        <button onClick={onBack} className="text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">
          Organización del Mercadona
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Selecciona tu lista para optimizar el recorrido
        </p>
      </div>

      <div className="flex-1 px-4 pb-32 relative">
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 min-h-[400px] relative border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
          
          <div className="col-span-1 row-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 relative">
            <Menu className="absolute top-3 right-3 text-slate-300 w-5 h-5" />
            <Apple className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">Fruta y Verdura</span>
          </div>

          <div className="col-span-1 bg-rose-50 dark:bg-rose-900/20 rounded-xl shadow-sm border-2 border-rose-300 dark:border-rose-700 flex flex-col items-center justify-center p-4 relative">
            <Menu className="absolute top-3 right-3 text-rose-400 w-5 h-5" />
            <div className="w-8 h-8 text-rose-500 mb-2 flex items-center justify-center">
              <span className="material-symbols-outlined">bakery_dining</span>
            </div>
            <span className="text-sm font-bold text-rose-700 dark:text-rose-400 text-center">Panadería</span>
          </div>

          <div className="col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 relative">
            <Menu className="absolute top-3 right-3 text-slate-300 w-5 h-5" />
            <Coffee className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">Secos</span>
          </div>

          <div className="col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 relative">
            <Menu className="absolute top-3 right-3 text-slate-300 w-5 h-5" />
            <div className="w-8 h-8 text-slate-400 mb-2 flex items-center justify-center">
              <span className="material-symbols-outlined">kitchen</span>
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">Refrigerados</span>
          </div>

          <div className="col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 relative">
            <Menu className="absolute top-3 right-3 text-slate-300 w-5 h-5" />
            <Droplets className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">Limpieza</span>
          </div>

          <div className="col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between p-4 relative">
            <div className="absolute -top-4 left-6 flex flex-col items-center">
              <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1">Estás aquí</div>
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 pl-8">
              <Snowflake className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Congelados</span>
            </div>
            <Menu className="text-slate-300 w-5 h-5" />
          </div>

          <div className="col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between p-4 opacity-70">
            <div className="flex-1 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Cajas / Salida</span>
            </div>
            <Lock className="text-slate-300 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30">
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Selecciona la lista</h3>
          <button 
            onClick={onNext}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold text-lg py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            Continuar a optimización
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
