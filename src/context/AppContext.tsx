import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShoppingList, Product, ListItem } from '../types';

interface AppContextType {
  lists: ShoppingList[];
  activeListId: string | null;
  selectedStore: any | null;
  setLists: (lists: ShoppingList[]) => void;
  setActiveListId: (id: string | null) => void;
  setSelectedStore: (store: any | null) => void;
  addList: (list: ShoppingList) => void;
  updateList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteList: (id: string) => void;
  addItemToList: (listId: string, item: ListItem) => void;
  updateItemInList: (listId: string, itemId: string, updates: Partial<ListItem>) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedLists = localStorage.getItem('lists');
    const savedStore = localStorage.getItem('selectedStore');

    if (savedStore) {
      setSelectedStore(JSON.parse(savedStore));
    } else {
      setSelectedStore({ id: '1', name: 'Mercadona Sevilla Centro', address: 'Calle San Eloy, 15, 41001 Sevilla' });
    }

    if (savedLists) {
      setLists(JSON.parse(savedLists));
    } else {
      // Default list if none exists
      const defaultList: ShoppingList = {
        id: 'gazpacho',
        name: 'Gazpacho',
        storeName: 'Mercadona Sevilla Centro',
        date: new Date().toLocaleDateString(),
        items: [
          { id: '1', name: 'Tomates Pera', brand: 'Hacendado', unit: '1kg', price: 1.60, category: 'Fruta y Verdura', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop', quantity: 2, checked: false },
          { id: '2', name: 'Pepinos holandeses', brand: 'Fresco', unit: 'Unidad', price: 1.10, category: 'Fruta y Verdura', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop', quantity: 1, checked: false },
          { id: '3', name: 'Pimiento Verde', brand: 'Malla 500g', unit: 'Malla', price: 1.45, category: 'Fruta y Verdura', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&h=500&fit=crop', quantity: 1, checked: false },
          { id: '4', name: 'Aceite de Oliva Virgen Extra', brand: 'Gran Selección', unit: '1L', price: 9.50, category: 'Secos', image: 'https://images.unsplash.com/photo-1474965044331-13683f2da8d4?w=500&h=500&fit=crop', quantity: 1, checked: true },
          { id: '5', name: 'Vinagre de Jerez', brand: 'Hacendado Reserva', unit: '250ml', price: 2.20, category: 'Secos', image: 'https://images.unsplash.com/photo-1588693892706-5b486d389a6d?w=500&h=500&fit=crop', quantity: 1, checked: true },
          { id: '6', name: 'Sal Marina', brand: 'Hacendado Fina', unit: '1kg', price: 0.45, category: 'Secos', image: 'https://images.unsplash.com/photo-1517594422361-5e1f0e47cd2f?w=500&h=500&fit=crop', quantity: 1, checked: true },
        ],
        status: 'pending'
      };
      setLists([defaultList]);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (lists.length > 0) {
      localStorage.setItem('lists', JSON.stringify(lists));
    }
  }, [lists]);

  useEffect(() => {
    if (selectedStore) {
      localStorage.setItem('selectedStore', JSON.stringify(selectedStore));
    }
  }, [selectedStore]);

  const addList = (list: ShoppingList) => setLists([...lists, list]);

  const updateList = (id: string, updates: Partial<ShoppingList>) => {
    setLists(lists.map(list => list.id === id ? { ...list, ...updates } : list));
  };

  const deleteList = (id: string) => {
    setLists(lists.filter(list => list.id !== id));
    if (activeListId === id) setActiveListId(null);
  };

  const addItemToList = (listId: string, item: ListItem) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        // Check if item already exists
        const existingItem = list.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            ...list,
            items: list.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
          };
        }
        return { ...list, items: [...list.items, item] };
      }
      return list;
    }));
  };

  const updateItemInList = (listId: string, itemId: string, updates: Partial<ListItem>) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
        };
      }
      return list;
    }));
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId)
        };
      }
      return list;
    }));
  };

  return (
    <AppContext.Provider value={{
      lists,
      activeListId,
      selectedStore,
      setLists,
      setActiveListId,
      setSelectedStore,
      addList,
      updateList,
      deleteList,
      addItemToList,
      updateItemInList,
      removeItemFromList
    }}>
      {children}
    </AppContext.Provider>
  );
};
