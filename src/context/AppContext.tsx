import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShoppingList, ListItem, UserProfile, Product } from '../types';

interface AppContextType {
  lists: ShoppingList[];
  activeListId: string | null;
  selectedStore: any | null;
  favoriteStores: string[];
  userProfile: UserProfile | null;
  setLists: (lists: ShoppingList[]) => void;
  setActiveListId: (id: string | null) => void;
  setSelectedStore: (store: any | null) => void;
  setFavoriteStores: (storeIds: string[]) => void;
  setUserProfile: (profile: UserProfile | null) => void;
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
  const [favoriteStores, setFavoriteStores] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load from local storage
  useEffect(() => {
    const initData = async () => {
      const savedLists = localStorage.getItem('lists');
      const savedStore = localStorage.getItem('selectedStore');
      const savedFavorites = localStorage.getItem('favoriteStores');
      const savedProfile = localStorage.getItem('userProfile');

      let currentProfile = null;
      if (savedProfile) {
        currentProfile = JSON.parse(savedProfile);
        setUserProfile(currentProfile);
      }

      if (savedStore) {
        setSelectedStore(JSON.parse(savedStore));
      }

      if (savedFavorites) {
        setFavoriteStores(JSON.parse(savedFavorites));
      }

      // Fetch demo data based on language
      const lang = currentProfile?.language || 'en';
      let gazpachoHits: any[] = [];
      let tortillaHits: any[] = [];
      let tunaHits: any[] = [];

      try {
        const [gzRes, ttRes, tuRes] = await Promise.all([
          fetch(`/data/algolia/demo/${lang}/gazpacho.json`),
          fetch(`/data/algolia/demo/${lang}/tortilla.json`),
          fetch(`/data/algolia/demo/${lang}/tuna.json`)
        ]);
        if (gzRes.ok) gazpachoHits = (await gzRes.json()).hits || [];
        if (ttRes.ok) tortillaHits = (await ttRes.json()).hits || [];
        if (tuRes.ok) tunaHits = (await tuRes.json()).hits || [];
      } catch (error) {
        console.error('Error fetching demo data:', error);
      }

      const mapHits = (hits: any[]) => hits.map((hit: any) => {
        // Log individual hit to diagnose (this is a conceptual note, we'll use more robust logic)
        const name = hit.name || hit.display_name || hit.slug || 'Producto';
        const rawPrice = hit.price !== undefined ? hit.price : (hit.price_instructions?.unit_price || 0);
        const price = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);
        const image = hit.image || hit.thumbnail || '';
        const brand = hit.brand || '';
        const unit = hit.unit || hit.packaging || hit.price_instructions?.unit_name || 'Ud';
        const category = typeof hit.category === 'string' ? hit.category : (hit.categories?.[0]?.name || 'Otros');

        return {
          id: String(hit.id),
          name: String(name),
          brand: String(brand),
          category: String(category),
          price: isNaN(price) ? 0 : price,
          unit: String(unit),
          image: String(image),
          rawHit: hit,
          quantity: 1,
          checked: false
        };
      });

      if (savedLists) {
        let loadedLists = JSON.parse(savedLists);

        // Force update our static demo lists if they exist
        loadedLists = loadedLists.map((l: ShoppingList) => {
          if (l.id === 'gazpacho' && gazpachoHits.length > 0) {
            return { ...l, items: mapHits(gazpachoHits) };
          }
          if (l.id === 'ryan' && (tortillaHits.length > 0 || tunaHits.length > 0)) {
            return { ...l, items: [...mapHits(tortillaHits), ...mapHits(tunaHits)] };
          }
          return l;
        });
        setLists(loadedLists);
      } else {
        // Default lists if none exist
        const defaultLists: ShoppingList[] = [
          {
            id: 'gazpacho',
            name: 'Gazpacho',
            storeName: 'Mercadona Sevilla Centro',
            date: new Date().toLocaleDateString(),
            items: mapHits(gazpachoHits),
            status: 'pending'
          },
          {
            id: 'ryan',
            name: 'Salvar al soldado Ryan',
            storeName: 'Mercadona Sevilla Centro',
            date: new Date().toLocaleDateString(),
            items: [...mapHits(tortillaHits), ...mapHits(tunaHits)],
            status: 'pending'
          }
        ];
        setLists(defaultLists);
      }
    };

    initData();
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

  useEffect(() => {
    localStorage.setItem('favoriteStores', JSON.stringify(favoriteStores));
  }, [favoriteStores]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

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
      favoriteStores,
      userProfile,
      setLists,
      setActiveListId,
      setSelectedStore,
      setFavoriteStores,
      setUserProfile,
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
