import React, { useState, useMemo } from 'react';
import { X, Search, Package, Plus, Minus, ChevronDown, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ListItem, ShoppingList, Product } from '../types';

interface Props {
  onClose: () => void;
  onAdded: (listId: string) => void;
  preselectedListId?: string; // If provided (from ListDetail), it will hide the dropdown
}

export function AddProductModal({ onClose, onAdded, preselectedListId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const { lists, addList, addItemToList, updateItemInList, removeItemFromList, selectedStore } = useAppContext();

  // For the dropdown (only if no preselectedListId)
  const pendingLists = lists.filter(l => l.status === 'pending');
  // 'new' represents creating a new list
  const [targetListId, setTargetListId] = useState<string>(
    preselectedListId || (pendingLists.length > 0 ? pendingLists[0].id : 'new')
  );

  const activeList = targetListId !== 'new' ? pendingLists.find(l => l.id === targetListId) : null;
  // Create a map of product id to quantity in the currently selected list
  const existingItemsMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (activeList) {
      activeList.items.forEach(item => {
        map[item.id] = item.quantity;
      });
    }
    return map;
  }, [activeList]);

  // If we are creating a new list, we manage a local set of added items until we close/confirm
  const [localNewListItems, setLocalNewListItems] = useState<Record<string, number>>({});

  const allProducts: Product[] = [
    { id: 'p1', name: 'Hélices con vegetales', brand: 'Hacendado', category: 'Despensa', price: 1.60, unit: 'Paquete 500g', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop' },
    { id: 'p2', name: 'Macarrones integrales', brand: 'Hacendado', category: 'Despensa', price: 0.85, unit: 'Paquete 500g', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=200&h=200&fit=crop' },
    { id: 'p3', name: 'Espaguetis pasta fina', brand: 'Hacendado', category: 'Despensa', price: 1.25, unit: 'Paquete 1kg', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=200&h=200&fit=crop' },
    { id: 'p4', name: 'Hélices sin gluten', brand: 'Hacendado', category: 'Despensa', price: 2.10, unit: 'Paquete 500g', image: '' },
    { id: 'p5', name: 'Tomates Pera', brand: 'Hacendado', unit: '1kg', price: 1.60, category: 'Fresco', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop' },
    { id: 'p6', name: 'Plátanos de Canarias', brand: 'Fresco', unit: '1kg', price: 1.99, category: 'Fresco', image: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=200&h=200&fit=crop' },
    { id: 'p7', name: 'Leche semidesnatada', brand: 'Hacendado', unit: '1L', price: 0.90, category: 'Despensa', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop' },
    { id: 'p8', name: 'Huevos clase L', brand: 'Hacendado', unit: 'Docena', price: 2.15, category: 'Fresco', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop' }
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddOne = (product: Product) => {
    if (targetListId === 'new') {
      setLocalNewListItems(prev => ({ ...prev, [product.id]: 1 }));
    } else {
      const newItem: ListItem = { ...product, quantity: 1, checked: false };
      addItemToList(targetListId, newItem);
    }
  };

  const handleUpdateQuantity = (product: Product, delta: number) => {
    if (targetListId === 'new') {
      setLocalNewListItems(prev => {
        const current = prev[product.id] || 0;
        const next = current + delta;
        if (next <= 0) {
          const newMap = { ...prev };
          delete newMap[product.id];
          return newMap;
        }
        return { ...prev, [product.id]: next };
      });
    } else {
       const currentQty = existingItemsMap[product.id] || 0;
       const nextQty = currentQty + delta;
       if (nextQty <= 0) {
         removeItemFromList(targetListId, product.id);
       } else {
         updateItemInList(targetListId, product.id, { quantity: nextQty });
       }
    }
  };

  const handleDone = () => {
    if (targetListId === 'new') {
      const idsToAdd = Object.keys(localNewListItems);
      if (idsToAdd.length > 0) {
         const newList: ShoppingList = {
          id: Math.random().toString(36).substring(7),
          name: `Lista ${new Date().toLocaleDateString()}`,
          storeName: selectedStore?.name || 'Mercadona',
          date: new Date().toLocaleDateString(),
          items: [],
          status: 'pending'
        };
        addList(newList);

        idsToAdd.forEach(id => {
          const p = allProducts.find(p => p.id === id);
          if (p) {
            addItemToList(newList.id, { ...p, quantity: localNewListItems[id], checked: false });
          }
        });
        onAdded(newList.id);
      } else {
        onClose();
      }
    } else {
      // Direct edits are already saved to context.
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
            Añadir Productos
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
                Añadir a la lista
              </label>
              <div className="relative">
                <select
                  value={targetListId}
                  onChange={(e) => {
                    setTargetListId(e.target.value);
                    setLocalNewListItems({}); // clear local temp items if switching
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl p-3 pr-10 appearance-none focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="new">+ Crear lista nueva</option>
                  {pendingLists.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.items.length} prod.)</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar tomate, pan, leche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-transparent rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0 bg-slate-50 dark:bg-slate-900/50">
          <div className="space-y-2">
            {filteredProducts.map(product => {
              // Determine quantity based on if we are creating new or editing existing
              const quantity = targetListId === 'new'
                 ? (localNewListItems[product.id] || 0)
                 : (existingItemsMap[product.id] || 0);

              const isAdded = quantity > 0;

              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all bg-white dark:bg-slate-900 ${
                    isAdded
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-none'
                      : 'border-transparent shadow-sm'
                  }`}
                >
                  <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-slate-900 dark:text-slate-100 text-sm font-bold truncate leading-tight mb-0.5">{product.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
                      {product.brand} • <span className="font-medium text-slate-700 dark:text-slate-300">{product.price.toFixed(2).replace('.', ',')} €</span>
                    </p>
                  </div>

                  {isAdded ? (
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-full p-1 border border-slate-200 dark:border-slate-700 shrink-0">
                      <button onClick={() => handleUpdateQuantity(product, -1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-full transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-slate-800 dark:text-slate-200 text-sm">{quantity}</span>
                      <button onClick={() => handleUpdateQuantity(product, 1)} className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddOne(product)}
                      className="flex items-center justify-center size-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-primary dark:bg-slate-800 dark:hover:bg-primary transition-colors shrink-0"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
               <div className="text-center py-10">
                 <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                 <p className="text-slate-500 text-sm">No se encontraron productos</p>
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
               className="w-full bg-primary disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
             >
               Crear lista y añadir
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
