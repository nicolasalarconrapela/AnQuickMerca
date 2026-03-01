import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ShoppingBasket, Plus, Minus, Check, Package } from 'lucide-react';
import { Product, ListItem } from '../types';
import { useAppContext } from '../context/AppContext';

// Mock data
import aguaData from '../../in/data/algolia/algolia_agua_all.json';
import cepilloData from '../../in/data/algolia/algolia_cepillo_one.json';
import pizzaData from '../../in/data/algolia/algolia_pizzapeperroni_two.json';
import tData from '../../in/data/algolia/algolia_t_all.json';

interface Props {
    placeholder?: string;
    listId?: string; // If provided, it will work with this specific list.
    onProductSelect?: (product: Product) => void;
    onSearchChange?: (query: string) => void;
    autoFocus?: boolean;
}

export function ProductSearch({ placeholder = "Busca productos...", listId, onProductSelect, onSearchChange, autoFocus = false }: Props) {
    const { lists, updateItemInList, removeItemFromList, addItemToList, selectedStore, userProfile } = useAppContext();

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (onSearchChange) onSearchChange(searchQuery);
    }, [searchQuery, onSearchChange]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(true);

    const list = useMemo(() => lists.find(l => l.id === listId), [lists, listId]);

    useEffect(() => {
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
                    if (query.includes('agua')) data = aguaData;
                    else if (query.includes('cepillo')) data = cepilloData;
                    else if (query.includes('pizza') || query.includes('peperoni')) data = pizzaData;
                    else if (query.includes('t')) data = tData;
                } else {
                    const colmena = selectedStore?.colmena || 'mad1';
                    const lang = userProfile?.language || 'es';
                    const indexName = `products_prod_${colmena}_${lang}`;
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
    }, [searchQuery, useMockData, selectedStore, userProfile?.language]);

    const handleAdd = (product: Product) => {
        if (onProductSelect) {
            onProductSelect(product);
            return;
        }

        if (!listId) return;

        const existing = list?.items.find(i => i.id === product.id);
        if (existing) {
            updateItemInList(listId, product.id, { quantity: existing.quantity + 1 });
        } else {
            addItemToList(listId, { ...product, quantity: 1, checked: false });
        }
    };

    const handleUpdateQuantity = (productId: string, delta: number) => {
        if (!listId || !list) return;
        const item = list.items.find(i => i.id === productId);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) {
                removeItemFromList(listId, productId);
            } else {
                updateItemInList(listId, productId, { quantity: newQuantity });
            }
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 group flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus-within:border-primary/50 p-2.5 rounded-2xl shadow-sm transition-all duration-300">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary" />
                    <input
                        type="text"
                        autoFocus={autoFocus}
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 text-sm font-medium placeholder:text-slate-400"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <label className="flex-none flex items-center gap-1.5 cursor-pointer px-3 py-2.5 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                    <input
                        type="checkbox"
                        checked={useMockData}
                        onChange={(e) => setUseMockData(e.target.checked)}
                        className="w-3.5 h-3.5 accent-orange-600 rounded cursor-pointer"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Demo</span>
                </label>
            </div>

            {searchQuery && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Resultados</h3>
                    {isLoading ? (
                        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map(product => {
                            const inList = list?.items.find(i => i.id === product.id);
                            return (
                                <div key={product.id} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                        {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-slate-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{product.name}</h3>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{product.price.toFixed(2)} €/ud</p>
                                    </div>

                                    {inList ? (
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700/50">
                                                <button onClick={() => handleUpdateQuantity(product.id, -1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-full transition-colors">
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-6 text-center font-bold text-slate-800 dark:text-slate-200 text-sm">{inList.quantity}</span>
                                                <button onClick={() => handleAdd(product)} className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItemFromList(listId!, product.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAdd(product)}
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
            )}
        </div>
    );
}
