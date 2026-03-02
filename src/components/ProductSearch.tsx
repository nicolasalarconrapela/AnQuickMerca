import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ShoppingBasket, Plus, Minus, Check, Package, Download } from 'lucide-react';
import { Product, ListItem } from '../types';
import { useAppContext } from '../context/AppContext';
import { ProductDetailModal } from './ProductDetailModal';
import { useTranslation } from '../i18n';

interface Props {
    placeholder?: string;
    listId?: string; // If provided, it will work with this specific list.
    onProductSelect?: (product: Product) => void;
    onSearchChange?: (query: string) => void;
    autoFocus?: boolean;
}

export function ProductSearch({ placeholder, listId, onProductSelect, onSearchChange, autoFocus = false }: Props) {
    const { lists, updateItemInList, removeItemFromList, addItemToList, selectedStore, userProfile } = useAppContext();
    const { t, lang } = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (onSearchChange) onSearchChange(searchQuery);
    }, [searchQuery, onSearchChange]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 3;

    const list = useMemo(() => lists.find(l => l.id === listId), [lists, listId]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setCurrentPage(1);
            return;
        }
        setCurrentPage(1); // Reset page on new search

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                let data: any = { hits: [] };
                const query = searchQuery.toLowerCase();

                if (useMockData) {
                    let mockAssetPath = '';
                    const lang = userProfile?.language || 'en';

                    if (query.includes('tortilla') || query.includes('omelette')) {
                        mockAssetPath = `/data/algolia/demo/${lang}/tortilla.json`;
                    } else if (query.includes('atun') || query.includes('tuna')) {
                        mockAssetPath = `/data/algolia/demo/${lang}/tuna.json`;
                    } else if (query.includes('gazpacho')) {
                        mockAssetPath = `/data/algolia/demo/${lang}/gazpacho.json`;
                    } else if (query.includes('agua')) {
                        mockAssetPath = '/data/algolia/agua.json';
                    } else if (query.includes('cepillo')) {
                        mockAssetPath = '/data/algolia/cepillo.json';
                    } else if (query.includes('pizza') || query.includes('peperoni')) {
                        mockAssetPath = '/data/algolia/pizza.json';
                    } else if (query.includes('t')) {
                        mockAssetPath = '/data/algolia/t.json';
                    }

                    if (mockAssetPath) {
                        const response = await fetch(mockAssetPath);
                        if (response.ok) data = await response.json();
                    }
                } else {
                    const colmena = selectedStore?.colmena || 'mad1';
                    const lang = userProfile?.language || 'en';
                    const indexName = `products_prod_${colmena}_${lang}`;
                    const url = `https://7uzjkl1dj0-dsn.algolia.net/1/indexes/${indexName}/query?x-algolia-agent=Algolia%20for%20JavaScript%20(5.49.1)%3B%20Search%20(5.49.1)%3B%20Browser&x-algolia-api-key=9d8f2e39e90df472b4f2e559a116fe17&x-algolia-application-id=7UZJKL1DJ0`;

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ params: `query=${encodeURIComponent(searchQuery)}&hitsPerPage=20` })
                    });
                    if (response.ok) data = await response.json();
                }

                const products: Product[] = data.hits.map((hit: any) => {
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
                        rawHit: hit
                    };
                });

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

    const handleDownloadJson = (product: Product) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(product, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${product.name.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 group flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 focus-within:border-primary/50 p-2.5 rounded-2xl shadow-sm transition-all duration-300">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary" />
                    <input
                        type="text"
                        autoFocus={autoFocus}
                        placeholder={placeholder || t.search_placeholder}
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
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <input
                        type="checkbox"
                        checked={useMockData}
                        onChange={(e) => setUseMockData(e.target.checked)}
                        className="w-4 h-4 accent-primary border border-slate-300 dark:border-slate-700 rounded"
                    />
                    <span>Usar datos de demo</span>
                </label>
            </div>

            {searchQuery && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 w-full px-0.5">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{t.search_results}</h3>
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-3">
                                {searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage).map(product => {
                                    const inList = list?.items.find(i => i.id === product.id);
                                    return (
                                        <div key={product.id} className="w-full flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                                            <div
                                                onClick={() => setSelectedDetail(product)}
                                                className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all active:scale-95"
                                            >
                                                {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-slate-400" />}
                                            </div>
                                            <div
                                                onClick={() => setSelectedDetail(product)}
                                                className="flex-1 min-w-0 pr-2 cursor-pointer"
                                            >
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{product.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{product.price.toFixed(2)} {t.search_price_unit}</p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDownloadJson(product); }}
                                                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                                                        title={t.search_download_json}
                                                    >
                                                        <Download className="w-3 h-3" />
                                                    </button>
                                                </div>
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
                                })}
                            </div>

                            {searchResults.length > resultsPerPage && (
                                <div className="flex items-center justify-center gap-4 mt-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        {t.search_previous}
                                    </button>
                                    <span className="text-xs font-bold text-slate-400">
                                        {currentPage} / {Math.ceil(searchResults.length / resultsPerPage)}
                                    </span>
                                    <button
                                        disabled={currentPage === Math.ceil(searchResults.length / resultsPerPage)}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        {t.search_next}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-sm">{t.search_no_results(searchQuery)}</div>
                    )}
                </div>
            )}

            {selectedDetail && (
                <ProductDetailModal
                    product={selectedDetail}
                    onClose={() => setSelectedDetail(null)}
                    onAdd={handleAdd}
                    lang={lang}
                />
            )}
        </div>
    );
}
