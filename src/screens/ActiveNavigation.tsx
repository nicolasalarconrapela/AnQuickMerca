import React, { useState, useEffect } from 'react';
import {
  X, Check, MapPin, Clock, ChevronRight, Minus, Plus, Search,
  Map as MapIcon, Apple, ShoppingBasket, Flame, Fish, Database,
  Snowflake, GlassWater, Bath, Sparkles, Baby, Pill, PawPrint, Egg,
  Coffee, Star, Wheat, Menu, Droplets, Archive, Smile, Scissors, Brush, Pizza, IceCream, Wine,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { SupermarketMap } from '../components/SupermarketMap';
import { useAppContext } from '../context/AppContext';
import { AVAILABLE_STORES, ListItem } from '../types';
import { useTranslation } from '../i18n';

interface Props {
  onBack: () => void;
}

export function ActiveNavigation({ onBack }: Props) {
  const [showMap, setShowMap] = useState(false);
  const { lists, activeListId, updateItemInList, completeList, updateList } = useAppContext();
  const { t } = useTranslation();

  const list = lists.find(l => l.id === activeListId);
  const store = AVAILABLE_STORES.find(s => s.name === list?.storeName) || AVAILABLE_STORES[0];
  const [itemsToFind, setItemsToFind] = useState<ListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [pickedQuantities, setPickedQuantities] = useState<Record<string, number>>({});
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [longPressProgress, setLongPressProgress] = useState(0);

  const handleFinish = () => {
    if (list) {
      completeList(list.id);
    }
    onBack();
  };

  useEffect(() => {
    if (list) {
      setItemsToFind(list.items.filter(i => !i.checked));
    }
  }, [list]);

  const currentItem = itemsToFind[currentIndex];

  const getAisleData = (category?: string) => {
    if (!category || !store.layout) return null;
    const aisle = store.layout.find(a =>
      a.sections.some(s => s.categories.some(c => c.toLowerCase() === category.toLowerCase()))
    );
    const section = aisle?.sections.find(s => s.categories.some(c => c.toLowerCase() === category.toLowerCase()));
    return { aisleId: aisle?.id, sectionName: section?.name, side: section?.side };
  };

  const currentAisleData = getAisleData(currentItem?.category);
  const nextItem = currentIndex < itemsToFind.length - 1 ? itemsToFind[currentIndex + 1] : null;





  if (!currentItem || itemsToFind.length === 0) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-background-light items-center justify-center p-8 text-center">
        <div className="size-20 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mb-8 border border-emerald-500/20 shadow-sm">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-slate-900">{t.nav_completed_title}</h2>
        <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-[240px]">
          {t.nav_completed_desc(store.name)}
        </p>
        <button
          onClick={handleFinish}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-sm active:scale-95 transition-all"
        >
          {t.nav_finish}
        </button>
      </div>
    );
  }

  const nextPreviewItem = currentIndex < itemsToFind.length - 1 ? itemsToFind[currentIndex + 1] : null;
  const totalChecked = list?.items.filter(i => i.checked).length || 0;
  const totalItems = list?.items.length || 0;
  const progressPercent = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;
  const listTotal = list?.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  const handleMarkAsPicked = () => {
    if (currentItem && list) {
      updateItemInList(list.id, currentItem.id, { checked: true });

      const remainingItems = itemsToFind.filter(i => i.id !== currentItem.id);

      if (remainingItems.length === 0) {
        handleFinish();
        return;
      }

      // Intentamos encontrar el siguiente elemento en la MISMA sección de los restantes
      const nextInSameSectionIdx = remainingItems.findIndex(i => i.category === currentItem.category);

      if (nextInSameSectionIdx !== -1) {
        setCurrentIndex(nextInSameSectionIdx);
      } else {
        // Si no hay más en esta sección, vamos al primer ítem de la siguiente zona
        setCurrentIndex(0);
      }

      setItemsToFind(remainingItems);

      // Reset picked quantity for next items
      setPickedQuantities(prev => {
        const next = { ...prev };
        delete next[currentItem.id];
        return next;
      });
    }
  };

  const currentPicked = pickedQuantities[currentItem?.id || ''] || 0;

  const handleCheckboxClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!currentItem) return;

    const newPicked = currentPicked + 1;
    if (newPicked >= currentItem.quantity) {
      handleMarkAsPicked();
    } else {
      setPickedQuantities(prev => ({
        ...prev,
        [currentItem.id]: newPicked
      }));
    }
  };

  const startLongPress = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setLongPressProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        handleMarkAsPicked();
        setLongPressProgress(0);
      }
    }, 50);

    const timer = setTimeout(() => {
      clearInterval(interval);
    }, 3100);

    setLongPressTimer(timer);
    // Store interval to clear it too if needed, but for simplicity we'll just use the timer state
    (window as any)._lpInterval = interval;
  };

  const endLongPress = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    if ((window as any)._lpInterval) clearInterval((window as any)._lpInterval);
    setLongPressTimer(null);
    setLongPressProgress(0);
  };

  const updateQuantity = (newQty: number) => {
    if (currentItem && list && newQty > 0) {
      updateItemInList(list.id, currentItem.id, { quantity: newQty });
      const updatedItems = [...itemsToFind];
      updatedItems[currentIndex] = { ...currentItem, quantity: newQty };
      setItemsToFind(updatedItems);
    }
  };

  const CATEGORY_ICONS: Record<string, any> = {
    'fruta': Apple, 'carne': Flame, 'pescado': Fish, 'charcuteria': Database,
    'congelados': Snowflake, 'pizzas': Pizza, 'postres': IceCream,
    'panadería': ShoppingBasket, 'huevos': Egg, 'café': Coffee,
    'azúcar': Star, 'cereales': Wheat, 'aperitivos': Star,
    'arroz': Menu, 'aceite': Droplets, 'conservas': Archive,
    'zumos': Droplets, 'agua': GlassWater, 'bodega': Wine,
    'limpieza': Bath, 'bebé': Baby, 'facial': Smile,
    'cabello': Scissors, 'maquillaje': Brush, 'fitoterapia': Pill, 'mascotas': PawPrint
  };

  const getCategoryIcon = (category: string) => {
    const key = Object.keys(CATEGORY_ICONS).find(k => category.toLowerCase().includes(k));
    return key ? CATEGORY_ICONS[key] : ShoppingBasket;
  };

  const CategoryIcon = getCategoryIcon(currentItem?.category || '');

  const getSectionIdForCategory = (category: string) => {
    const cat = category.toLowerCase();

    // Map Mercadona categories JSON to our map IDs
    if (cat.includes('fruta') || cat.includes('verdura')) return 'fruta-y-verdura';
    if (cat.includes('carne')) return 'carne';
    if (cat.includes('pescado') || cat.includes('marisco')) return 'marisco-y-pescado';
    if (cat.includes('congelado')) return 'congelados';
    if (cat.includes('panadería') || cat.includes('pastelería')) return 'panaderia-y-pasteleria';
    if (cat.includes('huevo') || cat.includes('leche') || cat.includes('mantequilla')) return 'huevos-leche-y-mantequilla';
    if (cat.includes('yogures') || cat.includes('postres')) return 'postres-y-yogures';
    if (cat.includes('aceite') || cat.includes('especia') || cat.includes('salsa')) return 'aceite-especias-y-salsas';
    if (cat.includes('arroz') || cat.includes('legumbre') || cat.includes('pasta')) return 'arroz-legumbres-y-pasta';
    if (cat.includes('conserva') || cat.includes('caldo') || cat.includes('crema')) return 'conservas-caldos-y-cremas';
    if (cat.includes('pizza') || cat.includes('plato preparado')) return 'pizzas-y-platos-preparados';
    if (cat.includes('aperitivo')) return 'aperitivos';
    if (cat.includes('cereal') || cat.includes('galleta')) return 'cereales-y-galletas';
    if (cat.includes('cacao') || cat.includes('café') || cat.includes('infusión')) return 'cacao-cafe-e-infusiones';
    if (cat.includes('azúcar') || cat.includes('caramelo') || cat.includes('chocolate')) return 'azucar-caramelos-y-chocolate';
    if (cat.includes('agua') || cat.includes('refresco')) return 'agua-y-refrescos';
    if (cat.includes('bodega') || cat.includes('vino')) return 'bodega';
    if (cat.includes('zumos')) return 'zumos';
    if (cat.includes('bebé')) return 'bebe';
    if (cat.includes('mascota')) return 'mascotas';
    if (cat.includes('limpieza') || cat.includes('hogar')) return 'limpieza-y-hogar';
    if (cat.includes('higiene corporal')) return 'higiene-corporal';
    if (cat.includes('cabello')) return 'cuidado-del-cabello';
    if (cat.includes('facial') || cat.includes('corporal')) return 'cuidado-facial-y-corporal';
    if (cat.includes('maquillaje')) return 'maquillaje';
    if (cat.includes('parafarmacia') || cat.includes('fito')) return 'fitoterapia-y-parafarmacia';

    return null;
  };

  const currentSectionId = getSectionIdForCategory(currentItem?.category || '');


  const sectionItems = itemsToFind.filter(i => i.category === currentItem?.category);
  const currentInSectionIdx = sectionItems.findIndex(i => i.id === currentItem?.id);

  const handleNext = () => {
    if (sectionItems.length > 1) {
      const nextInSec = sectionItems[(currentInSectionIdx + 1) % sectionItems.length];
      const globalIdx = itemsToFind.findIndex(i => i.id === nextInSec.id);
      setCurrentIndex(globalIdx);
    }
  };

  const handlePrev = () => {
    if (sectionItems.length > 1) {
      const prevInSec = sectionItems[(currentInSectionIdx - 1 + sectionItems.length) % sectionItems.length];
      const globalIdx = itemsToFind.findIndex(i => i.id === prevInSec.id);
      setCurrentIndex(globalIdx);
    }
  };


  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      const currentTouch = e.targetTouches[0].clientX;
      const diff = currentTouch - touchStart;
      if (diff < 0) setSwipeOffset(diff); // Only swipe left
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -100) {
      handleMarkAsPicked();
    }
    setTouchStart(null);
    setSwipeOffset(0);
  };

  const handleSelectItem = (itemId: string) => {
    const index = itemsToFind.findIndex(i => i.id === itemId);
    if (index !== -1) {
      setCurrentIndex(index);
      // Auto-close dropdown if open
    }
  };


  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto overflow-x-hidden bg-background-light font-sans text-slate-900 antialiased">
      {/* Top Bar - Simplified without progress bar */}
      <header className="fixed top-0 inset-x-0 bg-background-light  z-[60] pt-14 px-6 pb-6 max-w-md mx-auto">
        {/* Navigation Row - Google Maps Style */}
        <div className="flex flex-col gap-4">
          <div className="relative flex items-center justify-between min-h-[56px] bg-white rounded-2xl border border-slate-100 shadow-sm px-2">
            {/* Botón de retroceso */}
            <button
              onClick={handlePrev}
              className="p-2.5 text-slate-400 active:scale-90 transition-all disabled:opacity-30"
              disabled={itemsToFind.length <= 1}
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>

            {/* Store Selection Dropdown instead of Categories */}
            <div className="flex-1 min-w-0 flex items-center justify-center gap-2 relative group -ml-1">
              <select
                value={list?.storeName}
                onChange={(e) => {
                  if (list) updateList(list.id, { storeName: e.target.value });
                }}
                className="bg-transparent hover:bg-slate-50 transition-all pl-3 pr-8 py-2 rounded-xl text-base font-black uppercase tracking-tight appearance-none border-none focus:ring-0 cursor-pointer text-slate-900 w-full text-center"
              >
                {AVAILABLE_STORES.map(s => (
                  <option key={s.id} value={s.name} className="text-slate-900">{s.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-300 absolute right-1 pointer-events-none group-focus-within:rotate-180 transition-transform" />
            </div>

            {/* Botón de avance */}
            <button
              onClick={handleNext}
              className="p-2.5 text-slate-400 active:scale-90 transition-all disabled:opacity-30"
              disabled={itemsToFind.length <= 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicación estilo Google Maps */}
          <div className="flex items-center gap-3 bg-primary text-white p-4 rounded-2xl shadow-sm animate-in slide-in-from-left duration-500 relative">
            <div className="bg-white/20 p-2 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t.nav_suggested_route}</span>
              <p className="text-sm font-bold leading-none truncate overflow-hidden whitespace-nowrap">
                {t.nav_aisle_direction(currentAisleData?.aisleId || '01', currentAisleData?.side === 'left' ? t.nav_left : t.nav_right)}
              </p>
            </div>

            {/* Precio Total Compacto */}
            <div className="flex flex-col items-end shrink-0 border-l border-white/20 pl-3">
              <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">{t.nav_total}</span>
              <span className="text-sm font-black tabular-nums">{listTotal.toFixed(2).replace('.', ',')}€</span>
            </div>
          </div>
        </div>

      </header>

      <main className="flex-1 flex flex-col pt-56 px-6 pb-12">
        <div className="relative mb-4">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(${swipeOffset}px)`,
              opacity: 1 + swipeOffset / 400
            }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm shadow-slate-200/40 group relative aspect-square w-full transition-transform active:scale-[0.98] z-10"
          >
            {showMap ? (
              <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
                <SupermarketMap
                  selectedSectionId={currentSectionId || undefined}
                  className="rounded-none border-none shadow-none"
                  showLegend={false}
                  showControls={false}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMap(false); }}
                  className="absolute top-4 left-4 p-3 bg-primary text-white rounded-2xl shadow-lg z-10 active:scale-95 transition-all"
                >
                  <MapIcon className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full animate-in fade-in zoom-in-105 duration-500">
                {currentItem.image ? (
                  <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <Search className="w-16 h-16 text-slate-200" />
                  </div>
                )}
                {/* Icono Mapa a la izquierda - Toggle Manual */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMap(true); }}
                  className="absolute top-4 left-4 p-3 bg-white  rounded-2xl shadow-lg border border-white/50 text-slate-400 z-10 transition-all active:scale-95"
                >
                  <MapIcon className="w-6 h-6" />
                </button>

                {/* Checkbox a la derecha */}
                <div
                  className="absolute top-4 right-4 z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleCheckboxClick}
                    onMouseDown={startLongPress}
                    onMouseUp={endLongPress}
                    onMouseLeave={endLongPress}
                    onTouchStart={startLongPress}
                    onTouchEnd={endLongPress}
                    className={`relative size-14 flex items-center justify-center rounded-2xl shadow-sm transition-all active:scale-90 overflow-hidden
                      ${currentPicked > 0 ? 'bg-primary text-white' : 'bg-white  text-slate-300 border border-white/50'}`}
                  >
                    {/* Ring de progreso para long press */}
                    {longPressProgress > 0 && (
                      <div
                        className="absolute inset-0 bg-primary/20 transition-all duration-75"
                        style={{ height: `${longPressProgress}%`, bottom: 0, top: 'auto' }}
                      />
                    )}

                    <div className="relative z-10 flex flex-col items-center">
                      <Check className={`w-6 h-6 ${currentPicked > 0 ? 'text-white' : 'text-slate-300'}`} />
                      {currentItem.quantity > 1 && (
                        <span className="text-[10px] font-black mt-0.5">
                          {currentPicked}/{currentItem.quantity}
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Overlay gris al deslizar */}
                {swipeOffset < 0 && (
                  <div
                    className="absolute inset-0 bg-slate-900/40  flex items-center justify-center transition-opacity"
                    style={{ opacity: -swipeOffset / 200 }}
                  >
                    <div className="bg-white p-4 rounded-full shadow-md scale-125">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navegación sobre el contenedor (solo si no es el mapa para no interferir con el scroll del mapa) */}
            {!showMap && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white  rounded-2xl shadow-lg border border-white/50 text-slate-600 z-20 active:scale-90 transition-all disabled:opacity-30"
                  disabled={itemsToFind.length <= 1}
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white  rounded-2xl shadow-lg border border-white/50 text-slate-600 z-20 active:scale-90 transition-all disabled:opacity-30"
                  disabled={itemsToFind.length <= 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-start gap-4">
            <div className="size-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
              {currentIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {currentItem.name.charAt(0).toUpperCase() + currentItem.name.slice(1).toLowerCase()}
              </h2>
              <div className="flex flex-col mt-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none truncate mb-1">
                  {currentItem.brand || ''}
                </span>
                <span className="text-sm font-black text-primary leading-none">
                  {currentItem.price.toFixed(2).replace('.', ',')}€ <span className="text-[10px] font-bold text-slate-300 italic">{t.search_price_unit}</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pt-1">
              <span className="text-2xl font-black text-primary leading-none">
                {(currentItem.price * currentItem.quantity).toFixed(2).replace('.', ',')}€
              </span>
              {currentItem.quantity > 1 && (
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">
                  x{currentItem.quantity} {t.common_products}
                </span>
              )}
            </div>
          </div>
        </div>


        {/* Carousel de la sección */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.nav_in_section}</h3>
            <span className="text-[10px] font-bold text-primary">
              {t.nav_picked_count(
                list?.items.filter(i => i.category === currentItem.category && i.checked).length || 0,
                list?.items.filter(i => i.category === currentItem.category).length || 0
              )}
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
            {list?.items.filter(item => item.category === currentItem.category).map((item) => {
              const isActive = item.id === currentItem.id;
              const isChecked = item.checked;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={`min-w-[56px] flex flex-col gap-2 group active:scale-95 transition-all ${isChecked ? 'opacity-60' : 'opacity-100'}`}
                >
                  <div className={`size-14 rounded-xl overflow-hidden p-1 relative transition-all border-2 
                    ${isActive
                      ? 'border-primary ring-4 ring-primary/10 shadow-lg scale-110 z-10 bg-white'
                      : isChecked
                        ? 'border-slate-100 bg-slate-50'
                        : 'border-white bg-white shadow-sm'
                    }`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover rounded-lg transition-all ${isChecked ? 'grayscale contrast-75 brightness-90' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <span className="text-slate-200 font-bold text-xs">{item.name.charAt(0)}</span>
                      </div>
                    )}

                    {isChecked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 ">
                        <Check className="w-6 h-6 text-emerald-600 drop-shadow-sm" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 mt-0.5">{item.price.toFixed(2).replace('.', ',')}€</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex justify-center pb-2">
          <button
            onClick={onBack}
            className="text-[10px] font-bold text-slate-300 hover:text-slate-500 uppercase tracking-[0.2em] transition-colors py-1 px-4 active:scale-95"
          >
            {t.nav_cancel}
          </button>
        </div>
      </main>
    </div>
  );
}
