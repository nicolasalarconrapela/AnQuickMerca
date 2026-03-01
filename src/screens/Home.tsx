import React, { useState } from 'react';
import { Bell, MapPin, Search, ChevronRight, Plus, Calendar, ShoppingBag } from 'lucide-react';
import { Screen, ShoppingList } from '../types';
import { useAppContext } from '../context/AppContext';
import { AddProductModal } from '../components/AddProductModal';

interface Props {
  onNavigate: (screen: Screen, params?: any) => void;
}

export function Home({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'pendientes' | 'realizadas'>('pendientes');
  const { lists, selectedStore, addList, setActiveListId } = useAppContext();
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const pendingLists = lists.filter(l => l.status === 'pending');
  const completedLists = lists.filter(l => l.status === 'completed');

  const createNewList = () => {
    const newList: ShoppingList = {
      id: Math.random().toString(36).substring(7),
      name: `Lista ${new Date().toLocaleDateString()}`,
      storeName: selectedStore?.name || 'Mercadona',
      date: new Date().toLocaleDateString(),
      items: [],
      status: 'pending'
    };
    addList(newList);
    setActiveListId(newList.id);
    onNavigate('list_detail');
  };

  const getListTotal = (list: ShoppingList) => {
    return list.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleProductAdded = (listId: string) => {
    setActiveListId(listId);
    setShowAddProductModal(false);
    onNavigate('list_detail');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark font-display pb-24">
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido, Tony.</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Organiza tu compra inteligente</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('map_demo')}
              className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
              title="Demo amCharts"
            >
              <MapPin className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary/10">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tony"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 bg-primary/5 dark:bg-primary/10 p-2 rounded-lg cursor-pointer" onClick={() => onNavigate('store_selection')}>
          <MapPin className="text-primary w-4 h-4" />
          <span className="text-xs font-medium text-primary">{selectedStore?.name || 'Selecciona tienda'}</span>
          <ChevronRight className="text-primary w-4 h-4 ml-auto" />
        </div>

        <div className="relative group cursor-text" onClick={() => setShowAddProductModal(true)}>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar alimentos..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary text-sm placeholder:text-slate-400 transition-all pointer-events-none"
            readOnly
          />
        </div>

        <div className="flex gap-8 px-4 mt-6 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('pendientes')}
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'pendientes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-500 dark:text-slate-400 hover:text-primary font-medium'
              }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setActiveTab('realizadas')}
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'realizadas'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-500 dark:text-slate-400 hover:text-primary font-medium'
              }`}
          >
            Realizadas
          </button>
        </div>
      </header>

      <main className="px-4 pb-10">
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mis listas</h2>
          </div>

          {activeTab === 'pendientes' ? (
            <div className="space-y-4">
              {pendingLists.length === 0 ? (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No tienes listas pendientes.</p>
                </div>
              ) : (
                pendingLists.map(list => (
                  <div
                    key={list.id}
                    onClick={() => {
                      setActiveListId(list.id);
                      onNavigate('list_detail');
                    }}
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{list.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{list.items.length} productos</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{getListTotal(list)} €</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Total estimado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                      <div className="flex -space-x-2">
                        {list.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden">
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                        ))}
                      </div>
                      {list.items.length > 3 && <span className="text-xs text-slate-400 ml-1">+{list.items.length - 3} más</span>}
                      <ChevronRight className="ml-auto text-slate-300 w-5 h-5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {completedLists.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">No tienes listas completadas.</p>
              ) : (
                completedLists.map((list) => (
                  <div key={list.id} className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-semibold">{list.name}</h4>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{getListTotal(list)} €</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{list.date} • {list.items.length} productos</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>

      <button
        onClick={createNewList}
        className="fixed right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center transition-transform active:scale-90 z-40 bottom-6"
      >
        <Plus className="w-8 h-8" />
      </button>

      {showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onAdded={handleProductAdded}
        />
      )}
    </div>
  );
}
