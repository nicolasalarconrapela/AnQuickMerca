import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Search, Plus, Package } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function ProductSearch({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'todo' | 'fresco' | 'despensa'>('todo');

  const products = [
    { id: '1', name: 'Hélices con vegetales', brand: 'Hacendado', category: 'Pasta', price: 1.60, unit: 'Paquete 500g', refPrice: '2,10 €', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop' },
    { id: '2', name: 'Macarrones integrales', brand: 'Hacendado', category: 'Pasta', price: 0.85, unit: 'Paquete 500g', refPrice: '2,10 €', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=200&h=200&fit=crop' },
    { id: '3', name: 'Espaguetis pasta fina', brand: 'Hacendado', category: 'Pasta', price: 1.25, unit: 'Paquete 1kg', refPrice: '2,10 €', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=200&h=200&fit=crop' },
    { id: '4', name: 'Hélices sin gluten', brand: 'Hacendado', category: 'Pasta', price: 2.10, unit: 'Paquete 500g', refPrice: '2,10 €', image: null },
  ];

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
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
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
              placeholder="Buscar en AnQuickMerca" 
              defaultValue="Hélices con vegetales"
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
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Hacendado • Pasta <span className="ml-1 font-medium text-slate-400">(2,10 €)</span>
          </p>

          <div className="flex flex-col gap-1">
            {products.map((product, idx) => (
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
                    {product.brand} • {product.category} <span className="ml-1 font-medium text-slate-400">({product.refPrice})</span>
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-primary text-lg font-bold">{product.price.toFixed(2).replace('.', ',')} €</span> 
                    <span className="text-slate-400 text-xs">/ {product.unit}</span>
                  </div>
                </div>

                <button className={`flex items-center justify-center size-10 rounded-full transition-transform active:scale-95 ${
                  idx === 0 ? 'bg-primary text-white shadow-sm hover:bg-primary/90' : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}>
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
