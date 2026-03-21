import React, { useState, useMemo } from 'react';
import {
  ArrowRight, X, Map as MapIcon, List as ListIcon, ChevronDown
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AVAILABLE_STORES } from '../types';
import { useTranslation } from '../i18n';

// Importaciones del nuevo engine 3D
import { StoreLayout } from '../domain/store-layout/types';
import { generateStoreLayout } from '../domain/store-layout/generators';
import { StoreScene } from '../components/store/StoreScene';
import { StoreInspectorPanel } from '../components/store-ui/StoreInspectorPanel';
import { StoreDepartmentList } from '../components/store-ui/StoreDepartmentList';
import { StoreToolbar } from '../components/store-ui/StoreToolbar';
import { StoreDepartment } from '../domain/store-catalog/types';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

// Datos Mock generados para probar UI independiente del API
const MOCK_DEPARTMENTS: StoreDepartment[] = [
  { id: 1, name: 'Fruits & vegetables', zoneType: 'produce', order: 1, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 2, name: 'Bread & bakery', zoneType: 'bakery', order: 2, layout: 1, published: true, isExtended: false, categories: [{ id: 201, name: 'Pan fresco', order: 1, layout: 1, published: true, isExtended: false }] },
  { id: 3, name: 'Pizza & ready meals', zoneType: 'ready-meals', order: 3, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 4, name: 'Meat', zoneType: 'refrigerated', order: 4, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 5, name: 'Seafood & fish', zoneType: 'refrigerated', order: 5, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 6, name: 'Frozen food', zoneType: 'frozen', order: 6, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 7, name: 'Oils, spices & sauces', zoneType: 'ambient', order: 7, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 8, name: 'Water & soft drinks', zoneType: 'ambient', order: 8, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 9, name: 'Cereal & biscuits', zoneType: 'ambient', order: 9, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 10, name: 'Cleaning & household', zoneType: 'household', order: 10, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 11, name: 'Facial & body care', zoneType: 'perfume', order: 11, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 12, name: 'Pet', zoneType: 'pet', order: 12, layout: 1, published: true, isExtended: false, categories: [] },
];


export function LayoutOrganization({ onBack, onNext }: Props) {
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');
  const { lists, activeListId, updateList } = useAppContext();
  const { t } = useTranslation();
  const list = lists.find(l => l.id === activeListId);
  const items = list?.items || [];

  const layout = useMemo<StoreLayout>(() => {
    return generateStoreLayout(MOCK_DEPARTMENTS, { width: 30, depth: 40 });
  }, []);

  // removed list requirement

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-slate-900 font-[Inter,system-ui,sans-serif] text-slate-900 overflow-hidden relative">
      {/* Cabecera Blanca */}
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-200 dark:border-slate-800 flex flex-col relative z-20">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">{t.layout_route_map}</h1>
            <div className="relative inline-flex items-center w-full">
              <select
                value={list?.storeName}
                onChange={(e) => {
                  if (list) updateList(list.id, { storeName: e.target.value });
                }}
                className="bg-transparent pl-0 pr-6 py-1 text-xl font-bold text-slate-900 appearance-none border-none focus:ring-0 cursor-pointer w-full truncate"
              >
                {AVAILABLE_STORES.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-0 pointer-events-none" />
            </div>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {items ? t.layout_pending_products(items.filter(i => !i.checked).length) : ""}
            </p>
          </div>
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full border border-slate-200 dark:border-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900">
        {viewMode === 'visual' ? (
          <div className="h-full w-full relative">
            {/* Componentes UI 3D Map */}
            <StoreDepartmentList layout={layout} />
            <StoreInspectorPanel layout={layout} />
            <StoreToolbar layout={layout} />

            {/* Engine Visual 3D */}
            <StoreScene layout={layout} />
          </div>
        ) : (
          <div className="h-full w-full overflow-y-auto px-6 py-2 bg-white m-4 mt-4 mr-4 mb-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm" style={{ height: 'calc(100% - 2rem)', width: 'calc(100% - 3rem)' }}>
            <div className="flex flex-col">
              {items.filter(i => !i.checked).map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center flex-shrink-0 bg-slate-50">
                    <span className="text-xs font-semibold text-slate-500">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-slate-900 truncate text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.category}</p>
                  </div>
                </div>
              ))}
              {items.filter(i => !i.checked).length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm">
                  {t.layout_all_collected}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom CTA */}
      <footer className="p-4 bg-white border-t border-slate-200 dark:border-slate-800 shadow-sm z-20 relative">
        <button
          onClick={onNext}
          className="w-full h-[48px] bg-primary hover:bg-primary-dark text-white font-semibold text-base rounded border-none flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          {t.layout_start_navigation}
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
