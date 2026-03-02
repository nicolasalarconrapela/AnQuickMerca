import React, { useState, useMemo, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ShoppingList, Product } from '../types';
import { ProductSearch } from './ProductSearch';
import { ProductDetailModal } from './ProductDetailModal';

interface Props {
  onClose: () => void;
  onAdded: (listId: string) => void;
  preselectedListId?: string; // If provided (from ListDetail), it will hide the dropdown
}

export function AddProductModal({ onClose, onAdded, preselectedListId }: Props) {
  const { lists, addList, addItemToList, selectedStore, userProfile } = useAppContext();
  const isSpanish = userProfile?.language === 'es';

  // For the dropdown (only if no preselectedListId)
  const pendingLists = lists.filter(l => l.status === 'pending');
  // 'new' represents creating a new list
  const [targetListId, setTargetListId] = useState<string>(
    preselectedListId || (pendingLists.length > 0 ? pendingLists[0].id : 'new')
  );

  const [localNewListItems, setLocalNewListItems] = useState<Record<string, number>>({});
  const [productCache, setProductCache] = useState<Record<string, Product>>({});
  const [selectedDetail, setSelectedDetail] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    setProductCache(prev => ({ ...prev, [product.id]: product }));

    if (targetListId === 'new') {
      setLocalNewListItems(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
    } else {
      addItemToList(targetListId, { ...product, quantity: 1, checked: false });
    }
  };

  const handleDone = () => {
    if (targetListId === 'new') {
      const idsToAdd = Object.keys(localNewListItems);
      if (idsToAdd.length > 0) {
        // Crear los items mapeando el cache
        const items = idsToAdd.map(id => {
          const p = productCache[id];
          return p ? { ...p, quantity: localNewListItems[id], checked: false } : null;
        }).filter((item): item is any => item !== null);

        const newList: ShoppingList = {
          id: Math.random().toString(36).substring(7),
          name: isSpanish ? `Lista ${new Date().toLocaleDateString()}` : `List ${new Date().toLocaleDateString()}`,
          storeName: selectedStore?.name || 'Mercadona',
          date: new Date().toLocaleDateString(),
          items: items,
          status: 'pending'
        };

        addList(newList);
        onAdded(newList.id);
      } else {
        onClose();
      }
    } else {
      onAdded(targetListId);
    }
    onClose();
  };

  // Determine total products selected (only used for UI feedback when creating new list)
  const newItemsCount = Object.keys(localNewListItems).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleDone}>
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md mx-auto rounded-t-[2rem] shadow-2xl flex flex-col h-[85vh] animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header Section */}
        <div className="shrink-0 flex items-center justify-between p-5 pb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isSpanish ? 'Añadir Productos' : 'Add Products'}
          </h3>
          <button
            onClick={handleDone}
            className="bg-slate-100 dark:bg-slate-800 text-slate-500 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticky Controls Section */}
        <div className="shrink-0 px-5 pb-3 border-b border-slate-100 dark:border-slate-800 space-y-4">

          {/* List Selection (Only if not preselected) */}
          {!preselectedListId && (
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                {isSpanish ? 'Añadir a la lista' : 'Add to list'}
              </label>
              <div className="relative">
                <select
                  value={targetListId}
                  onChange={(e) => {
                    setTargetListId(e.target.value);
                    setLocalNewListItems({}); // clear local temp items if switching
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium rounded-2xl p-3 pr-10 appearance-none focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="new">+ {isSpanish ? 'Crear lista nueva' : 'Create new list'}</option>
                  {pendingLists.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.items.length} prod.)</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          <ProductSearch
            listId={targetListId === 'new' ? undefined : targetListId}
            onProductSelect={targetListId === 'new' ? handleProductSelect : undefined}
            placeholder={isSpanish ? "Busca alimentos..." : "Search food..."}
            autoFocus
          />
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0 bg-slate-50 dark:bg-slate-900/50">
          <div className="space-y-4">
            {targetListId === 'new' && newItemsCount > 0 && (
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Prod. seleccionados ({newItemsCount})</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(localNewListItems).map(id => (
                    <div key={id} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-primary/20 text-xs font-bold shadow-sm animate-in zoom-in-50">
                      <span
                        onClick={() => setSelectedDetail(productCache[id])}
                        className="cursor-pointer hover:text-primary transition-colors"
                      >
                        {productCache[id]?.name}
                      </span>
                      <span className="bg-primary text-white size-5 flex items-center justify-center rounded-full text-[10px]">{localNewListItems[id]}</span>
                      <button onClick={() => setLocalNewListItems(prev => { const n = { ...prev }; delete n[id]; return n; })} className="text-slate-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer (Only really needed if creating a new list, but keeping consistent is good. If modifying existing, changes are immediate) */}
        {targetListId === 'new' && (
          <div className="shrink-0 p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-[2rem] pb-safe">
            <button
              onClick={handleDone}
              disabled={newItemsCount === 0}
              className="w-full bg-primary disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              {isSpanish ? 'Crear lista y añadir' : 'Create list and add'}
            </button>
          </div>
        )}
      </div>

      {selectedDetail && (
        <ProductDetailModal
          product={selectedDetail}
          onClose={() => setSelectedDetail(null)}
          lang={userProfile?.language}
        />
      )}
    </div>
  );
}
