import React, { useState } from 'react';
import { Bell, MapPin, Search, ChevronRight, Plus, Calendar, ShoppingBag, Globe, Trash2, Edit2, Check, X as CloseIcon, Map, Sun, Moon, Monitor } from 'lucide-react';
import { Screen, ShoppingList } from '../types';
import { useAppContext } from '../context/AppContext';
import { AddProductModal } from '../components/AddProductModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useTranslation } from '../i18n';

interface Props {
  onNavigate: (screen: Screen, params?: any) => void;
}

export function Home({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'pendientes' | 'realizadas'>('pendientes');
  const { lists, selectedStore, addList, deleteList, updateList, setActiveListId, userProfile, setUserProfile, setTheme } = useAppContext();
  const { t } = useTranslation();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const isSpanish = userProfile?.language === 'es';
  const name = userProfile?.name || 'User';

  const toggleLanguage = () => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        language: isSpanish ? 'en' : 'es'
      });
    }
  };

  const pendingLists = lists.filter(l => l.status === 'pending');
  const completedLists = lists.filter(l => l.status === 'completed');


  const handleToggleTheme = () => {
    const currentTheme = userProfile?.theme || 'system';
    const nextTheme = currentTheme === 'system' ? 'light' : currentTheme === 'light' ? 'dark' : 'system';
    setTheme(nextTheme);
  };

  const createNewList = () => {
    const newList: ShoppingList = {
      id: Math.random().toString(36).substring(7),
      name: t.home_new_list_name(new Date().toLocaleDateString()),
      storeName: selectedStore?.name || 'Mercadona',
      date: new Date().toLocaleDateString(),
      items: [],
      status: 'pending'
    };
    addList(newList);
    setActiveListId(newList.id);
    onNavigate('list_detail');
  };

  const handleRename = (id: string) => {
    if (renameValue.trim()) {
      updateList(id, { name: renameValue.trim() });
    }
    setEditingListId(null);
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-7 mb-4">
              {t.home_welcome(name)}
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-500 transition-all flex items-center justify-center gap-1.5 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              title={t.home_switch_theme || 'Change theme'}
            >
              {(!userProfile?.theme || userProfile.theme === 'system') ? <Monitor className="w-5 h-5" /> : userProfile.theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-500 transition-all flex items-center justify-center gap-1.5 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              title={t.home_switch_language}
            >
              <span className="text-lg">{isSpanish ? '🇪🇸' : '🇺🇸'}</span>
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 bg-primary/5 dark:bg-primary/10 p-2 rounded-lg cursor-pointer" onClick={() => onNavigate('store_selection')}>
          <MapPin className="text-primary w-4 h-4" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary truncate">
              {selectedStore?.name || t.home_select_store}
            </p>
            {selectedStore?.address && (
              <p className="text-[10px] text-primary/70 truncate -mt-0.5">
                {selectedStore.address}
              </p>
            )}
          </div>
          <ChevronRight className="text-primary w-4 h-4 ml-auto" />
        </div>

        <div className="relative group cursor-text" onClick={() => setShowAddProductModal(true)}>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={t.home_search_placeholder}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary text-sm placeholder:text-slate-400 transition-all pointer-events-none"
            readOnly
          />
        </div>

        <div className="flex items-center justify-between mt-6 px-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.home_my_lists}</h2>
        </div>

        <div className="flex gap-8 px-4 mt-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('pendientes')}
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'pendientes'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-500 dark:text-slate-400 hover:text-primary font-medium'
              }`}
          >
            {t.home_pending}
          </button>
          <button
            onClick={() => setActiveTab('realizadas')}
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'realizadas'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-500 dark:text-slate-400 hover:text-primary font-medium'
              }`}
          >
            {t.home_completed}
          </button>
        </div>
      </header>

      <main className="px-4 pb-10">
        <section className="mt-4">

          {activeTab === 'pendientes' ? (
            <div className="space-y-4">
              {pendingLists.length === 0 ? (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">
                    {t.home_no_pending}
                  </p>
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
                    <div className="flex justify-between items-start mb-2 pr-20">
                      <div className="flex-1 mr-2">
                        {editingListId === list.id ? (
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 p-1 rounded-xl border border-primary/30">
                            <input
                              type="text"
                              autoFocus
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename(list.id);
                                if (e.key === 'Escape') setEditingListId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-transparent border-none outline-none text-lg font-bold p-1"
                            />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRename(list.id); }}
                              className="p-1.5 bg-primary text-white rounded-lg shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingListId(null); }}
                              className="p-1.5 bg-slate-200 dark:bg-slate-600 rounded-lg"
                            >
                              <CloseIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setRenameValue(list.name);
                              setEditingListId(list.id);
                            }}
                          >
                            <h3 className="font-bold text-lg truncate">{list.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{list.items.length} {t.home_products}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{getListTotal(list)} €</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{t.home_estimated_total}</p>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenameValue(list.name);
                          setEditingListId(list.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setListToDelete(list);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                      <div className="flex -space-x-2">
                        {list.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden">
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                        ))}
                      </div>
                      {list.items.length > 3 && <span className="text-xs text-slate-400 ml-1">+{list.items.length - 3} {t.home_more}</span>}
                      <ChevronRight className="ml-auto text-slate-300 w-5 h-5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {completedLists.length === 0 ? (
                <div className="text-center p-8 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">
                    {t.home_no_completed}
                  </p>
                </div>
              ) : (
                completedLists.map(list => (
                  <div
                    key={list.id}
                    onClick={() => {
                      setActiveListId(list.id);
                      onNavigate('list_detail');
                    }}
                    className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden grayscale opacity-70 group active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2 pr-10">
                      <div>
                        <h3 className="font-bold text-lg text-slate-500 line-through truncate">{list.name}</h3>
                        <p className="text-xs text-slate-400">{list.items.length} {t.home_products} • {list.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-400">{getListTotal(list)} €</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Total</p>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setListToDelete(list);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-700/50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                      <div className="flex -space-x-2">
                        {list.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800 bg-slate-200 overflow-hidden grayscale">
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                        ))}
                      </div>
                      {list.items.length > 3 && <span className="text-xs text-slate-300 ml-1">+{list.items.length - 3}</span>}
                      <ChevronRight className="ml-auto text-slate-300 w-5 h-5" />
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

      {listToDelete && (
        <ConfirmationModal
          title={t.home_delete_list_title}
          message={t.home_delete_list_message(listToDelete.name)}
          confirmText={t.home_delete}
          cancelText={t.home_cancel}
          onConfirm={() => {
            deleteList(listToDelete.id);
            setListToDelete(null);
          }}
          onCancel={() => setListToDelete(null)}
        />
      )}
    </div>
  );
}
