import React from 'react';
import { X, Package, ShieldCheck, Droplet, Info, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { translations } from '../i18n';

interface Props {
    product: Product;
    onClose: () => void;
    onAdd?: (product: Product) => void;
    lang?: 'en' | 'es';
}

export function ProductDetailModal({ product, onClose, onAdd, lang = 'es' }: Props) {
    const t = translations[lang ?? 'es'];
    const hit = product.rawHit || {};
    const pi = hit.price_instructions || {};

    const formatPrice = (p: any) => {
        if (p === null || p === undefined) return '-';
        return Number(p).toFixed(2).replace('.', ',') + ' €';
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60  animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md md:max-w-xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con imagen - Tamaño reducido para aspecto flotante */}
                <div className="relative h-60 sm:h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b border-slate-100 dark:border-slate-800 shrink-0">
                    {product.image ? (
                        <img
                            src={product.image.replace('h=300&w=300', 'h=600&w=600')}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                        />
                    ) : (
                        <Package className="w-16 h-16 text-slate-300" />
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 size-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white active:scale-90 transition-all z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {hit.badges?.is_water && (
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-primary text-white flex items-center gap-1.5 text-[10px] font-bold shadow-lg shadow-primary/20">
                            <Droplet className="w-3 h-3" />
                            {lang === 'es' ? 'AGUA MINERAL' : 'MINERAL WATER'}
                        </div>
                    )}
                </div>

                {/* Contenido - Con scroll interno si es necesario */}
                <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category}</span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mt-1">{product.name}</h2>
                                {product.brand && (
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-xs mt-1">{product.brand}</p>
                                )}
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-xl font-black text-slate-900 dark:text-white">
                                    {formatPrice(product.price)}
                                </div>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">{t.product_tax_included}</p>
                            </div>
                        </div>
                    </div>

                    {/* Grid de detalles */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                {t.product_reference}
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {pi.reference_price ? `${formatPrice(pi.reference_price)} / ${pi.reference_format || 'kg'}` : '-'}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                {t.product_format}
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {pi.unit_name || product.unit} ({pi.unit_size} {pi.size_format})
                            </p>
                        </div>
                    </div>

                    {/* Información Adicional */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                            {t.product_technical_info}
                        </h3>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500">{t.product_tax}</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{pi.tax_percentage || (pi.iva ? pi.iva + '%' : '-')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500">{t.product_id}</span>
                                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">#{product.id}</span>
                            </div>
                            {hit.published && (
                                <div className="flex items-center justify-between text-sm py-2">
                                    <div className="flex items-center gap-1.5 text-primary font-bold">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>{t.product_in_stock}</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-primary/10 dark:bg-primary/20 text-primary px-2 py-0.5 rounded text-uppercase">VERIFIED</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Acción */}
                    {onAdd && (
                        <button
                            onClick={() => { onAdd(product); onClose(); }}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-14 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-sm mt-4"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {t.product_add_to_list}
                        </button>
                    )}
                </div>

                {/* Footer info */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
                        {t.product_price_disclaimer}
                    </p>
                </div>
            </div>
        </div>
    );
}
