import React, { useState, useMemo } from 'react';
import { ArrowLeft, ShoppingCart, Search, Plus, Package, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ListItem, Screen } from '../types';

interface Props {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export function ProductSearch({ onBack, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'todo' | 'fresco' | 'despensa'>('todo');
  const [searchQuery, setSearchQuery] = useState('');

  const { addItemToList, activeListId } = useAppContext();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

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
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'todo' || p.category.toLowerCase() === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const handleAdd = (product: any) => {
    if (!activeListId) {
       alert("No hay una lista activa. Crea una desde Home.");
       return;
    }

    const newItem: ListItem = {
      ...product,
      quantity: 1,
      checked: false
    };

    addItemToList(activeListId, newItem);

    // Visual feedback
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-slate-900 shadow-xl overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 gap-2">
          <button 
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1">Buscador de Productos</h1>
          <button
             onClick={() => onNavigate('list_detail')}
             className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-primary transition-colors bg-primary/10 relative"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 pb-4">
          <label className="relative flex items-center w-full group">
            <div className="absolute left-4 text-primary pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              className="form-input flex w-full h-12 pl-12 pr-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 text-base font-normal placeholder:text-slate-500 dark:placeholder:text-slate-400" 
              placeholder="Buscar en AnQuickMerca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 gap-8">
          <button 
            onClick={() => setActiveTab('todo')}
            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
              activeTab === 'todo' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
            }`}
          >
            <span className={`text-sm ${activeTab === 'todo' ? 'font-bold' : 'font-medium'}`}>Todo</span>
          </button>
          <button 
            onClick={() => setActiveTab('fresco')}
            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
              activeTab === 'fresco' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
            }`}
          >
            <span className={`text-sm ${activeTab === 'fresco' ? 'font-bold' : 'font-medium'}`}>Fresco</span>
          </button>
          <button 
            onClick={() => setActiveTab('despensa')}
            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
              activeTab === 'despensa' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'
            }`}
          >
            <span className={`text-sm ${activeTab === 'despensa' ? 'font-bold' : 'font-medium'}`}>Despensa</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-4">
          {searchQuery && (
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Resultados para "{searchQuery}"
            </p>
          )}

          <div className="flex flex-col gap-1">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-lg px-2 -mx-2">
                <div className="shrink-0">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="size-20 rounded-lg object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="size-20 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Package className="w-10 h-10 text-primary/30" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-1 flex-col">
                  <h3 className="text-slate-900 dark:text-slate-100 text-base font-semibold leading-tight">{product.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {product.brand} • {product.category}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-primary text-lg font-bold">{product.price.toFixed(2).replace('.', ',')} €</span> 
                    <span className="text-slate-400 text-xs">/ {product.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(product)}
                  className={`flex items-center justify-center size-10 rounded-full transition-all active:scale-95 ${
                    addedItems[product.id]
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {addedItems[product.id] ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </button>
              </div>
            ))}

            {filteredProducts.length === 0 && (
               <div className="text-center py-10">
                 <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                 <p className="text-slate-500">No se encontraron productos</p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
