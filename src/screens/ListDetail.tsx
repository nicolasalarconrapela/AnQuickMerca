import React, { useState } from 'react';
import { ArrowLeft, Edit2, Minus, Plus, Trash2, ShoppingBasket, Route, CalendarClock, Store, ChevronDown, Check, X, Search } from 'lucide-react';
import { Screen, AVAILABLE_STORES, Product, ListItem } from '../types';
import { useAppContext } from '../context/AppContext';

// Mock data for search integration
import aguaData from '../../in/data/algolia/algolia_agua_all.json';
import cepilloData from '../../in/data/algolia/algolia_cepillo_one.json';
import pizzaData from '../../in/data/algolia/algolia_pizzapeperroni_two.json';
import tData from '../../in/data/algolia/algolia_t_all.json';

interface Props {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export function ListDetail({ onBack, onNavigate }: Props) {
  const { lists, activeListId, updateItemInList, removeItemFromList, updateList, deleteList, addItemToList, selectedStore } = useAppContext();
  const list = lists.find(l => l.id === activeListId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

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

  // Search Logic (integrated from AddProductModal)
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        let data: any = { hits: [] };
        const query = searchQuery.toLowerCase();

        if (useMockData) {
          // Using Mock Data logic
          if (query.includes('agua')) data = aguaData;
          else if (query.includes('cepillo')) data = cepilloData;
          else if (query.includes('pizza') || query.includes('peperoni')) data = pizzaData;
          else if (query.includes('t')) data = tData;
        } else {
          // LLAMADA API REAL (Algolia)
          const colmena = selectedStore?.colmena || 'mad1';
          const indexName = `products_prod_${colmena}_es`;
          const url = `https://7uzjkl1dj0-dsn.algolia.net/1/indexes/${indexName}/query?x-algolia-agent=Algolia%20for%20JavaScript%20(5.49.1)%3B%20Search%20(5.49.1)%3B%20Browser&x-algolia-api-key=9d8f2e39e90df472b4f2e559a116fe17&x-algolia-application-id=7UZJKL1DJ0`;

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ params: `query=${encodeURIComponent(searchQuery)}&hitsPerPage=20` })
          });
          if (response.ok) data = await response.json();
        }

        const products: Product[] = data.hits.map((hit: any) => ({
          id: hit.id,
          name: hit.display_name || hit.slug || 'Producto sin nombre',
          brand: hit.brand || '',
          category: hit.categories?.[0]?.name || 'Otros',
          price: parseFloat(hit.price_instructions?.unit_price || "0"),
          unit: hit.packaging || hit.price_instructions?.unit_name || 'Ud',
          image: hit.thumbnail || ''
        }));

        setSearchResults(products);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, useMockData, selectedStore]);

  const handleClearList = () => {
    if (list && window.confirm('¿Quieres vaciar todos los elementos de esta lista?')) {
      list.items.forEach(item => removeItemFromList(list.id, item.id));
    }
  };

  const handleAddFromSearch = (product: Product) => {
    if (!list) return;
    const existing = list.items.find(i => i.id === product.id);
    if (existing) {
      updateItemInList(list.id, product.id, { quantity: existing.quantity + 1 });
    } else {
      addItemToList(list.id, { ...product, quantity: 1, checked: false });
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
              <div className="flex items-center justify-between gap-4">
                <div className="group flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus-within:border-primary/50 p-2.5 rounded-2xl shadow-sm transition-all duration-300">
                  <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary" />
                  <input
                    type="text"
                    placeholder="Añadir productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 text-sm font-medium placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>

                <label className="flex-none flex items-center gap-1.5 cursor-pointer px-2 py-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={useMockData}
                    onChange={(e) => setUseMockData(e.target.checked)}
                    className="w-3.5 h-3.5 accent-orange-600 rounded cursor-pointer"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Demo</span>
                </label>
              </div>

              {!searchQuery && (
                <button
                  onClick={handleClearList}
                  className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vaciar lista
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
        {searchQuery ? (
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Resultados</h3>
            {isLoading ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : searchResults.length > 0 ? (
              searchResults.map(product => {
                const inList = list.items.find(i => i.id === product.id);
                return (
                  <div key={product.id} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2">
                    <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-700">
                      {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <ShoppingBasket className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{product.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{product.price.toFixed(2)} €/ud</p>
                    </div>
                    {inList ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700/50">
                          <button onClick={() => updateQuantity(inList.id, -1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-full transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-bold text-slate-800 dark:text-slate-200 text-sm">{inList.quantity}</span>
                          <button onClick={() => handleAddFromSearch(product)} className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(inList.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddFromSearch(product)}
                        className="size-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">No hay resultados para "{searchQuery}"</div>
            )}
          </div>
        ) : (
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
        )}
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
