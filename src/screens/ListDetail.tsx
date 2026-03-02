import React, { useState } from 'react';
import {
  ArrowLeft, Edit2, Minus, Plus, Trash2, ShoppingBasket,
  Route, CalendarClock, Store, ChevronDown, Check, X,
  MoreVertical, MapPin, CheckCircle2, Calendar, LayoutGrid
} from 'lucide-react';
import { Screen, AVAILABLE_STORES, ListItem } from '../types';
import { useAppContext } from '../context/AppContext';
import { ProductSearch } from '../components/ProductSearch';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useTranslation } from '../i18n';

interface Props {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export function ListDetail({ onBack, onNavigate }: Props) {
  const { lists, activeListId, updateItemInList, removeItemFromList, updateList, deleteList, addItemToList, completeList, selectedStore, userProfile } = useAppContext();
  const { t, lang } = useTranslation();
  const list = lists.find(l => l.id === activeListId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  // Search state managed by ProductSearch, but we need local query for UI toggles
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCtaMenuOpen, setIsCtaMenuOpen] = useState(false);

  // Selection mode state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500 mb-4">{t.list_not_found}</p>
        <button onClick={onBack} className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-sm">{t.list_back}</button>
      </div>
    );
  }

  const items = list.items;

  const toggleCheck = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newChecked = !item.checked;
      updateItemInList(list.id, id, { checked: newChecked });

      // Si estamos marcando como hecho, comprobamos si es el último
      if (newChecked) {
        const remaining = items.filter(i => i.id !== id && !i.checked);
        if (remaining.length === 0) {
          // Todos marcados!
          setTimeout(() => {
            completeList(list.id);
            if (!list.repetition) {
              onBack(); // Si no es recurrente, volvemos a la home
            }
          }, 600);
        }
      }
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

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateList(list.id, { storeName: e.target.value });
  };

  const toggleRepetition = () => {
    const cycle: (typeof list.repetition)[] = [undefined, 'diaria', 'semanal', 'mensual', 'anual'];
    const currentIndex = cycle.indexOf(list.repetition);
    const nextIndex = (currentIndex + 1) % cycle.length;
    updateList(list.id, { repetition: cycle[nextIndex] });
  };

  const handleDeleteList = () => {
    if (window.confirm(t.list_confirm_delete)) {
      deleteList(list.id);
      onBack();
    }
  };

  const handleNameSave = () => {
    if (editNameValue.trim()) {
      updateList(list.id, { name: editNameValue.trim() });
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSave();
    if (e.key === 'Escape') setIsEditingName(false);
  };

  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const handleClearList = () => {
    if (list && window.confirm(t.list_confirm_clear(totalCount, list.name))) {
      list.items.forEach(item => removeItemFromList(list.id, item.id));
      setIsMenuOpen(false);
    }
  };

  const handleLongPress = (id: string) => {
    setSelectionMode(true);
    const newSelected = new Set(selectedItems);
    newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const handleTouchStart = (id: string) => {
    longPressTimer.current = setTimeout(() => handleLongPress(id), 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      if (newSelected.size === 0) setSelectionMode(false);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const deleteSelected = () => {
    if (window.confirm(t.list_confirm_delete_selected(selectedItems.size))) {
      selectedItems.forEach(id => removeItemFromList(list.id, id));
      setSelectionMode(false);
      setSelectedItems(new Set());
    }
  };

  const markSelectedAsDone = () => {
    selectedItems.forEach(id => updateItemInList(list.id, id, { checked: true }));
    setSelectionMode(false);
    setSelectedItems(new Set());
  };

  const totalEstimated = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Status Label
  let statusLabel: string = t.list_status_pending;
  let statusColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';

  if (totalCount > 0 && checkedCount > 0 && checkedCount < totalCount) {
    statusLabel = t.list_status_in_progress_count(checkedCount, totalCount);
    statusColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  } else if (totalCount > 0 && checkedCount === totalCount) {
    statusLabel = t.list_status_done;
    statusColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
  } else if (list.status === 'completed') {
    statusLabel = t.list_status_done;
    statusColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen pb-44 font-display">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
        {selectionMode ? (
          <div className="flex items-center justify-between px-5 h-[72px] animate-in fade-in slide-in-from-top-2 duration-200 bg-primary/10 dark:bg-primary/20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setSelectionMode(false); setSelectedItems(new Set()); }}
                className="p-2 -ml-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <X className="w-6 h-6 text-primary" />
              </button>
              <span className="font-bold text-lg text-primary">{t.list_selected(selectedItems.size)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={markSelectedAsDone} className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-primary" title={t.list_mark_done}>
                <CheckCircle2 className="w-6 h-6" />
              </button>
              <button onClick={deleteSelected} className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-rose-500" title={t.list_delete}>
                <Trash2 className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-slate-400">
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col px-5 pt-3 pb-2 gap-2">
            <div className="flex items-center justify-between gap-3 h-10">
              <div className="flex items-center flex-1 min-w-0 gap-2">
                <button onClick={onBack} className="p-2 -ml-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">
                  <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </button>

                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  {isEditingName ? (
                    <div className="flex items-center w-full gap-1 border-b-2 border-primary pb-0.5">
                      <input
                        type="text"
                        autoFocus
                        value={editNameValue}
                        onChange={e => setEditNameValue(e.target.value)}
                        onKeyDown={handleNameKeyDown}
                        className="flex-1 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 bg-transparent outline-none p-0 focus:ring-0 min-w-0"
                      />
                      <button onClick={handleNameSave} className="p-1 rounded-full text-primary">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h1
                      className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate cursor-pointer flex items-center gap-1.5"
                      onClick={() => { setEditNameValue(list.name); setIsEditingName(true); }}
                    >
                      {list.name}
                      <Edit2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h1>
                  )}

                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusColor}`}>
                    {statusLabel}
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isMenuOpen ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                >
                  < MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Edit2 className="w-4 h-4 text-slate-400" />
                      {t.list_rename}
                    </button>
                    <button
                      onClick={handleClearList}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.list_clear}
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2" />
                    <button
                      onClick={handleDeleteList}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.list_delete}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <div className="relative inline-flex items-center group text-primary">
                <MapPin className="w-3.5 h-3.5 absolute left-2.5 z-10 pointer-events-none" />
                <select
                  value={list.storeName}
                  onChange={handleStoreChange}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors pl-8 pr-7 py-1.5 rounded-full text-xs font-bold appearance-none border-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[140px]"
                >
                <option value="Mercadona">{t.list_select_store}</option>
                  {AVAILABLE_STORES.map(store => (
                    <option key={store.id} value={store.name}>{store.name}</option>
                  ))}
                </select>
              <button onClick={toggleRepetition} className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all border ${list.repetition ? "bg-primary/10 text-primary border-primary/20" : "bg-white dark:bg-slate-800 text-slate-300 border-slate-100"}`}><Calendar className="w-3.5 h-3.5" />{list.repetition && <span className="text-[10px] font-bold uppercase tracking-tight">{list.repetition}</span>}</button>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none group-focus-within:rotate-180 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {!selectionMode && (
          <div className="px-5 pb-3">
            <div className={`flex gap-2 ${searchQuery ? 'flex-col items-stretch' : 'items-center'}`}>
              <div className="flex-1 min-w-0">
                <ProductSearch
                  listId={list.id}
                  placeholder={t.list_add_product}
                  onSearchChange={setSearchQuery}
                />
              </div>
              {!searchQuery && (
                <button className="flex-none size-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="px-5 space-y-3 pb-8 mt-4">
        {items.filter(i => !i.checked).map(item => (
          <div
            key={item.id}
            onMouseDown={() => handleTouchStart(item.id)}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={() => handleTouchStart(item.id)}
            onTouchEnd={handleTouchEnd}
            className={`flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 border ${selectionMode && selectedItems.has(item.id) ? 'bg-primary/10 border-primary shadow-md scale-[1.02]' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 shadow-sm'}`}
          >
            {(selectionMode || item.checked) ? (
              <input
                type="checkbox"
                checked={selectionMode ? selectedItems.has(item.id) : item.checked}
                onChange={() => selectionMode ? toggleSelection(item.id) : toggleCheck(item.id)}
                className="size-6 rounded-full border-2 border-primary text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer transition-all shrink-0"
              />
            ) : (
              <div
                className="size-6 rounded-full border-2 border-slate-300 dark:border-slate-600 transition-colors hover:border-primary shrink-0"
                onClick={() => toggleCheck(item.id)}
              />
            )}

            <div
              onClick={() => setSelectedDetail(item)}
              className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-100 dark:border-slate-700 flex items-center justify-center relative cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all active:scale-95"
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <ShoppingBasket className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">{item.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {item.brand}
              </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                <span className="font-medium text-slate-700 dark:text-slate-300">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700/50">
                <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-full transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold text-slate-800 dark:text-slate-200 text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-full transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {items.filter(i => i.checked).map(item => (
          <div
            key={item.id}
            onMouseDown={() => handleTouchStart(item.id)}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={() => handleTouchStart(item.id)}
            onTouchEnd={handleTouchEnd}
            className={`flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 border ${selectionMode && selectedItems.has(item.id) ? 'bg-primary/10 border-primary shadow-md' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/50 opacity-60'}`}
          >
            <input
              type="checkbox"
              checked={selectionMode ? selectedItems.has(item.id) : item.checked}
              onChange={() => selectionMode ? toggleSelection(item.id) : toggleCheck(item.id)}
              className="size-6 rounded-full border-2 border-primary text-primary focus:ring-primary focus:ring-offset-0 bg-primary cursor-pointer shrink-0"
            />

            <div
              onClick={() => setSelectedDetail(item)}
              className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden relative cursor-pointer opacity-80"
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-60" />
              ) : (
                <ShoppingBasket className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-500 line-through truncate">{item.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {item.quantity}x • {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
              </p>
            </div>

            <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors shrink-0">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="bg-slate-100 dark:bg-slate-800 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBasket className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">{t.list_empty_title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{t.list_empty_hint}</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-6 py-6 z-50 border-t border-slate-100 dark:border-slate-800 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{t.list_shopping_total}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{totalEstimated.toFixed(2).replace('.', ',')}</span>
              <span className="text-sm font-bold text-slate-400">€</span>
            </div>
          </div>

          <div className="flex items-center shadow-2xl shadow-primary/30 rounded-[2rem] overflow-hidden">
            <button
              onClick={() => onNavigate('layout_organization')}
              disabled={totalCount === 0 || checkedCount === totalCount}
              className="bg-primary disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-black text-[11px] uppercase tracking-[0.15em] py-5 px-8 flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:brightness-110"
            >
              <div className="size-6 bg-white/20 rounded-full flex items-center justify-center">
                <Route size={14} className="animate-pulse" />
              </div>
              <span className="truncate">
                {totalCount === 0
                  ? t.list_empty_cta
                  : checkedCount === totalCount
                    ? t.list_done_cta
                    : t.list_start_shopping(items.filter(i => !i.checked).length)
                }
              </span>
            </button>
            <button
              onClick={() => setIsCtaMenuOpen(!isCtaMenuOpen)}
              disabled={totalCount === 0}
              className="bg-primary-dark/20 dark:bg-black/20 backdrop-blur-md px-3 py-5 border-l border-white/10"
            >
              <ChevronDown size={18} className={`text-white transition-transform duration-300 ${isCtaMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {isCtaMenuOpen && (
          <div className="absolute bottom-full right-6 mb-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button className="w-full px-5 py-3 text-left text-sm flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{t.list_start_now}</span>
                <span className="text-[10px] text-slate-400">{t.list_optimized_route}</span>
              </div>
            </button>
            <button
              onClick={() => { toggleRepetition(); setIsCtaMenuOpen(false); }}
              className="w-full px-5 py-3 text-left text-sm flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className={`size-8 rounded-lg flex items-center justify-center ${list.repetition ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500'}`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{list.repetition ? t.list_change_frequency : t.list_schedule_title}</span>
                <span className="text-[10px] text-slate-400">{list.repetition || t.list_schedule_hint}</span>
              </div>
            </button>
            <button className="w-full px-5 py-3 text-left text-sm flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{t.list_simulate_route}</span>
                <span className="text-[10px] text-slate-400">{t.list_view_map}</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {selectedDetail && (
        <ProductDetailModal
          product={selectedDetail}
          onClose={() => setSelectedDetail(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
