import React from 'react';
import { useTranslation } from '../i18n';
import { ArrowRight, X, MapPin, Apple, Coffee, Snowflake, Droplets, Lock, Menu, ShoppingBasket } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

export function LayoutOrganization({ onBack, onNext }: Props) {
  const { lists, activeListId } = useAppContext();
  const list = lists.find(l => l.id === activeListId);
  const items = list?.items || [];

  const categories = {
    'Fruta y Verdura': items.filter(i => i.category === 'Fruta y Verdura' && !i.checked).length,
    'Secos': items.filter(i => i.category === 'Secos' && !i.checked).length,
    'Refrigerados': items.filter(i => i.category === 'Refrigerados' && !i.checked).length,
    'Congelados': items.filter(i => i.category === 'Congelados' && !i.checked).length,
    'Limpieza': items.filter(i => i.category === 'Limpieza' && !i.checked).length,
    'Panadería': items.filter(i => i.category === 'Panadería' && !i.checked).length
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Organización del Mercadona
          </h1>
          <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors">
            <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Ruta óptima calculada para {list?.name} ({items.filter(i => !i.checked).length} productos)
        </p>
      </div>

      <div className="flex-1 px-4 pb-32 relative">
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 min-h-[400px] relative border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
          
          <div className={`col-span-1 row-span-2 rounded-xl shadow-sm flex flex-col items-center justify-center p-4 relative border ${categories['Fruta y Verdura'] > 0 ? 'bg-primary/10 border-primary shadow-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            <Menu className={`absolute top-3 right-3 w-5 h-5 ${categories['Fruta y Verdura'] > 0 ? 'text-primary' : 'text-slate-300'}`} />
            {categories['Fruta y Verdura'] > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold size-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {categories['Fruta y Verdura']}
              </div>
            )}
            <Apple className={`w-8 h-8 mb-2 ${categories['Fruta y Verdura'] > 0 ? 'text-primary' : 'text-slate-400'}`} />
            <span className={`text-sm font-bold text-center ${categories['Fruta y Verdura'] > 0 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>Fruta y Verdura</span>
          </div>

          <div className={`col-span-1 rounded-xl shadow-sm flex flex-col items-center justify-center p-4 relative border ${categories['Panadería'] > 0 ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
             {categories['Panadería'] > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold size-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {categories['Panadería']}
              </div>
            )}
            <div className={`w-8 h-8 mb-2 flex items-center justify-center ${categories['Panadería'] > 0 ? 'text-primary' : 'text-slate-400'}`}>
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <span className={`text-sm font-bold text-center ${categories['Panadería'] > 0 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>Panadería</span>
          </div>

          <div className={`col-span-1 rounded-xl shadow-sm flex flex-col items-center justify-center p-4 relative border ${categories['Secos'] > 0 ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            {categories['Secos'] > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold size-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {categories['Secos']}
              </div>
            )}
            <Coffee className={`w-8 h-8 mb-2 ${categories['Secos'] > 0 ? 'text-primary' : 'text-slate-400'}`} />
            <span className={`text-sm font-bold text-center ${categories['Secos'] > 0 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>Secos</span>
          </div>

          <div className={`col-span-1 rounded-xl shadow-sm flex flex-col items-center justify-center p-4 relative border ${categories['Refrigerados'] > 0 ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
             {categories['Refrigerados'] > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold size-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {categories['Refrigerados']}
              </div>
            )}
            <div className={`w-8 h-8 mb-2 flex items-center justify-center ${categories['Refrigerados'] > 0 ? 'text-primary' : 'text-slate-400'}`}>
              <Droplets className="w-6 h-6" />
            </div>
            <span className={`text-sm font-bold text-center ${categories['Refrigerados'] > 0 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>Refrigerados</span>
          </div>

          <div className={`col-span-1 rounded-xl shadow-sm flex flex-col items-center justify-center p-4 relative border ${categories['Limpieza'] > 0 ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            {categories['Limpieza'] > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold size-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {categories['Limpieza']}
              </div>
            )}
            <Droplets className={`w-8 h-8 mb-2 ${categories['Limpieza'] > 0 ? 'text-primary' : 'text-slate-400'}`} />
            <span className={`text-sm font-bold text-center ${categories['Limpieza'] > 0 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>Limpieza</span>
          </div>

          <div className={`col-span-2 rounded-xl shadow-sm flex items-center justify-between p-4 relative border ${categories['Congelados'] > 0 ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            <div className="absolute -top-4 left-6 flex flex-col items-center">
              <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1">Estás aquí</div>
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 pl-8">
               {categories['Congelados'] > 0 && (
                <div className="bg-primary text-white text-xs font-bold size-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {categories['Congelados']}
                </div>
              )}
              <Snowflake className={`w-5 h-5 ${categories['Congelados'] > 0 ? 'text-primary' : 'text-slate-400'}`} />
              <span className={`text-sm font-bold ${categories['Congelados'] > 0 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>Congelados</span>
            </div>
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Empezar a comprar</h3>
          <button 
            onClick={onNext}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold text-lg py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            Navegar por la tienda
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
