import React, { useState, useMemo } from 'react';
import { X, Search, Package, Plus, ChevronDown, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ListItem, ShoppingList } from '../types';

interface Props {
  onClose: () => void;
  onAdded: (listId: string) => void;
  preselectedListId?: string; // If provided (from ListDetail), it will hide the dropdown
}

export function AddProductModal({ onClose, onAdded, preselectedListId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const { lists, addList, addItemToList, selectedStore } = useAppContext();

  // Track selected product IDs
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // For the dropdown (only if no preselectedListId)
  const pendingLists = lists.filter(l => l.status === 'pending');
  // 'new' represents creating a new list
  const [targetListId, setTargetListId] = useState<string>(
    preselectedListId || (pendingLists.length > 0 ? pendingLists[0].id : 'new')
  );

  const allProducts = [
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

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleAddProducts = () => {
    if (selectedProductIds.length === 0) return;

    const productsToAdd = allProducts.filter(p => selectedProductIds.includes(p.id));

    let listIdToUse = targetListId;

    if (targetListId === 'new') {
      const newList: ShoppingList = {
        id: Math.random().toString(36).substring(7),
        name: `Lista ${new Date().toLocaleDateString()}`,
        storeName: selectedStore?.name || 'Mercadona',
        date: new Date().toLocaleDateString(),
        items: [],
        status: 'pending'
      };
      addList(newList);
      listIdToUse = newList.id;
    }

    productsToAdd.forEach(p => {
      const newItem: ListItem = { ...p, quantity: 1, checked: false };
      addItemToList(listIdToUse, newItem);
    });

    onAdded(listIdToUse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md mx-auto rounded-t-[2rem] shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Añadir Productos
          </h3>
          <button
            onClick={onClose}
            className="bg-slate-100 dark:bg-slate-800 text-slate-500 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* List Selection (Only if not preselected) */}
          {!preselectedListId && (
            <div className="mb-5 relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Añadir a la lista
              </label>
              <div className="relative">
                <select
                  value={targetListId}
                  onChange={(e) => setTargetListId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium rounded-xl p-3.5 pr-10 appearance-none focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="new">+ Crear lista nueva</option>
                  {pendingLists.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.items.length} prod.)</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="relative mb-4 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar tomate, pan, leche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-transparent rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none"
            />
          </div>

          {/* Product Results */}
          <div className="space-y-2 pb-20">
            {filteredProducts.map(product => {
              const isSelected = selectedProductIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-100 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Checkbox circle */}
                  <div className={`shrink-0 flex items-center justify-center size-6 rounded-full border-2 transition-colors ${
                    isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 dark:text-slate-100 text-sm font-bold truncate">{product.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
                      {product.brand} • <span className="font-medium text-slate-700 dark:text-slate-300">{product.price.toFixed(2).replace('.', ',')} €</span>
                    </p>
                  </div>
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

        {/* Footer Add Button */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-[2rem]">
           <button
             onClick={handleAddProducts}
             disabled={selectedProductIds.length === 0}
             className="w-full bg-primary disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
           >
             <Plus className="w-5 h-5" />
             Añadir {selectedProductIds.length > 0 ? `${selectedProductIds.length} producto${selectedProductIds.length > 1 ? 's' : ''}` : ''}
           </button>
        </div>
      </div>
    </div>
  );
}
