import React, { useState } from 'react';
import { SupermarketMap } from '../components/SupermarketMap';
import { MapSection } from '../types';
import { ArrowLeft, MapPin, Share2, Info } from 'lucide-react';
import { useTranslation } from '../i18n';

interface StoreMapScreenProps {
    onBack: () => void;
}

export const StoreMapScreen: React.FC<StoreMapScreenProps> = ({ onBack }) => {
    const [selectedSection, setSelectedSection] = useState<MapSection | null>(null);
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{t.smap_title}</h1>
                        <p className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-widest">
                            <MapPin size={10} /> Mercadona Sevilla Centro
                        </p>
                    </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <Share2 size={18} className="text-slate-400" />
                </button>
            </header>

            {/* Main Map Area */}
            <div className="flex-1 px-4 pb-6">
                <SupermarketMap
                    selectedSectionId={selectedSection?.id}
                    onSectionSelect={(section) => setSelectedSection(section)}
                    className="h-full"
                />
            </div>

            {/* Selected Section Detail Card */}
            {selectedSection && (
                <div className="px-6 pb-8 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: selectedSection.color }} />

                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: `${selectedSection.color}20`, color: selectedSection.color }}
                                >
                                    <Info size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedSection.label}</h2>
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">{selectedSection.category}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedSection(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <ArrowLeft className="rotate-90" size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.smap_aisles}</p>
                                <p className="text-sm font-bold">{selectedSection.label}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.smap_capacity}</p>
                                <p className="text-sm font-bold">{t.smap_high_occupancy}</p>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                            {t.smap_view_products}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
