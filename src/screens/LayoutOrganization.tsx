import React, { useState } from 'react';
import {
  ArrowRight, X, Map as MapIcon, List as ListIcon, ChevronDown
} from 'lucide-react';
import { SupermarketMap } from '../components/SupermarketMap';
import { useAppContext } from '../context/AppContext';
import { AVAILABLE_STORES } from '../types';
import { useTranslation } from '../i18n';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

export function LayoutOrganization({ onBack, onNext }: Props) {
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');
  const { lists, activeListId, updateList } = useAppContext();
  const { t } = useTranslation();
  const list = lists.find(l => l.id === activeListId);
  const items = list?.items || [];

  if (!list) return null;

  return (
    <div className="flex flex-col h-[844px] w-[390px] mx-auto bg-[#F5F7F6] font-[Inter,system-ui,sans-serif] text-slate-900 overflow-hidden relative border border-[rgba(31,41,55,0.10)] shadow-[0_6px_18px_rgba(0,0,0,0.08)] rounded-[2rem]">
      {/* Cabela Blanca */}
      <header className="px-6 pt-12 pb-4 bg-white border-b border-[rgba(31,41,55,0.10)] flex flex-col relative z-20">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">{t.layout_route_map}</h1>
            <div className="relative inline-flex items-center w-full">
              <select
                value={list.storeName}
                onChange={(e) => {
                  updateList(list.id, { storeName: e.target.value });
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
              {t.layout_pending_products(items.filter(i => !i.checked).length)}
            </p>
          </div>
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full border border-[rgba(31,41,55,0.10)]">
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-[#F5F7F6]">
        {viewMode === 'visual' ? (
          <div className="h-full w-full">
            <SupermarketMap
              className="rounded-none border-none shadow-none bg-transparent"
              showLegend={false}
              showControls={true}
            />
          </div>
        ) : (
          <div className="h-full w-full overflow-y-auto px-6 py-2 bg-white m-4 mt-4 mr-4 mb-4 rounded-xl border border-[rgba(31,41,55,0.10)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]" style={{ height: 'calc(100% - 2rem)', width: 'calc(100% - 3rem)' }}>
            <div className="flex flex-col">
              {items.filter(i => !i.checked).map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[rgba(31,41,55,0.10)] last:border-0 hover:bg-slate-50 transition-colors">
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
      <footer className="p-4 bg-white border-t border-[rgba(31,41,55,0.10)] shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-20 relative">
        <button
          onClick={onNext}
          className="w-full h-[48px] bg-[#00754A] hover:bg-[#00623E] text-white font-semibold text-base rounded border-none flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          {t.layout_start_navigation}
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
