import React, { useState } from 'react';
import { ArrowLeft, Edit2, Minus, Plus, Trash2, ShoppingBasket, Route, CalendarClock, Store, ChevronDown, Check, X } from 'lucide-react';
import { Screen, AVAILABLE_STORES } from '../types';
import { useAppContext } from '../context/AppContext';
import { ProductSearch } from '../components/ProductSearch';

interface Props {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export function ListDetail({ onBack, onNavigate }: Props) {
  const { lists, activeListId, updateItemInList, removeItemFromList, updateList, deleteList, addItemToList, selectedStore, userProfile } = useAppContext();
  const list = lists.find(l => l.id === activeListId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  // Search state managed by ProductSearch, but we need local query for UI toggles
  const [searchQuery, setSearchQuery] = useState('');

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500 mb-4">Lista no encontrada</p>
        <button onClick={onBack} className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-sm">Volver</button>
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

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateList(list.id, { storeName: e.target.value });
  };

  const toggleWeekly = () => {
    updateList(list.id, { repeatWeekly: !list.repeatWeekly });
  };

  const handleDeleteList = () => {
    if (window.confirm('¿Seguro que quieres eliminar esta lista?')) {
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

  const handleNameClear = () => {
    setEditNameValue('');
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSave();
    if (e.key === 'Escape') setIsEditingName(false);
  };



  const handleClearList = () => {
    if (list && window.confirm('¿Quieres vaciar todos los elementos de esta lista?')) {
      list.items.forEach(item => removeItemFromList(list.id, item.id));
    }
  };



  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const totalEstimated = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Status Label
  let statusLabel = 'Pdte';
  let statusColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';

  if (totalCount > 0 && checkedCount > 0 && checkedCount < totalCount) {
    statusLabel = `Proceso (${checkedCount}/${totalCount})`;
    statusColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  } else if (totalCount > 0 && checkedCount === totalCount) {
    statusLabel = 'Hecho';
    statusColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
  } else if (list.status === 'completed') {
    statusLabel = 'Hecho';
    statusColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen pb-44 font-display">
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center justify-between h-10 mb-2">
          <button onClick={onBack} className="flex items-center justify-center -ml-2 size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
          <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColor}`}>
            {statusLabel}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 group min-h-[40px]">
            {isEditingName ? (
              <div className="flex items-center w-full gap-2 border-b-2 border-primary pb-1">
                <input
                  type="text"
                  autoFocus
                  value={editNameValue}
                  onChange={e => setEditNameValue(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  className="flex-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 bg-transparent outline-none p-0 focus:ring-0 min-w-0"
                />
                <button onClick={handleNameClear} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={handleNameSave} className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 shrink-0">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 cursor-pointer truncate" onClick={() => { setEditNameValue(list.name); setIsEditingName(true); }}>
                  {list.name}
                </h1>
                <button onClick={() => { setEditNameValue(list.name); setIsEditingName(true); }} className="p-1.5 rounded-full text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors shrink-0">
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mt-1 text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{totalCount} productos · <span className="text-slate-800 dark:text-slate-200 font-bold">{totalEstimated.toFixed(2).replace('.', ',')} €</span></span>
          </div>

          <div className="relative mt-3 inline-flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full">
              <Store className="w-4 h-4 text-slate-400" />
              <select
                value={list.storeName}
                onChange={handleStoreChange}
                className="bg-transparent border-none p-0 focus:ring-0 text-slate-700 dark:text-slate-200 w-full appearance-none pr-6 cursor-pointer"
              >
                <option value="Mercadona">Seleccionar tienda...</option>
                {AVAILABLE_STORES.map(store => (
                  <option key={store.id} value={store.name}>{store.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            </div>

            <div className="flex flex-col gap-2">
              <ProductSearch
                listId={list.id}
                placeholder={userProfile?.language === 'es' ? "Añadir productos..." : "Add products..."}
                onSearchChange={setSearchQuery} // We'll need to add this prop to ProductSearch
              />

              {!searchQuery && (
                <button
                  onClick={handleClearList}
                  className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {userProfile?.language === 'es' ? 'Vaciar lista' : 'Clear list'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="px-5 py-4 flex gap-3">
        <button
          onClick={toggleWeekly}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-colors shadow-sm ${list.repeatWeekly ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
        >
          <CalendarClock className="w-4 h-4" />
          {list.repeatWeekly ? 'Semanal' : 'Programar'}
        </button>
        <button
          onClick={handleDeleteList}
          className="flex-none flex items-center justify-center size-[46px] rounded-2xl border border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 shadow-sm"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </section>

      {totalCount > 0 && !searchQuery && (
        <section className="px-5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completado</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </section>
      )}

      <main className="px-5 space-y-3 pb-8 mt-4">

        <>
          {items.filter(i => !i.checked).map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
                className="size-6 rounded border-2 border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer transition-all hover:border-primary shrink-0"
              />

              <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-100 dark:border-slate-700 flex items-center justify-center relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ShoppingBasket className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">{item.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {item.brand} • <span className="font-medium text-slate-700 dark:text-slate-300">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
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
            <div key={item.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 opacity-60">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
                className="size-6 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-offset-0 bg-primary cursor-pointer shrink-0"
              />

              <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden relative">
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
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">Lista vacía</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Busca y añade productos a tu compra.</p>
            </div>
          )}
        </>
      </main>

      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white dark:bg-slate-900 px-5 py-4 z-50 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total estimado</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalEstimated.toFixed(2).replace('.', ',')}</span>
            <span className="font-bold text-slate-500">€</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('layout_organization')}
          disabled={totalCount === 0 || checkedCount === totalCount}
          className="w-full bg-slate-900 dark:bg-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Route className="w-6 h-6" />
          {totalCount === 0
            ? 'Añade productos'
            : checkedCount === totalCount
              ? 'Lista completada'
              : 'Iniciar recorrido'
          }
        </button>
      </div>
    </div>
  );
}
