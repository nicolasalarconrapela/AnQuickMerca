import React, { useState } from 'react';
import { SpainRegionsMap } from '../components/SpainRegionsMap';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n';

interface MapDemoProps {
    onBack: () => void;
}

export const MapDemo: React.FC<MapDemoProps> = ({ onBack }) => {
    const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
    const { t } = useTranslation();

    // Ejemplo de valores por región usando códigos INE estándar
    const demoValues: Record<string, number> = {
        '01': 85, // Andalucía
        '13': 95, // Madrid
        '09': 75, // Cataluña
        '12': 45, // Galicia
        '10': 60, // C. Valenciana
        '02': 30, // Aragón
        '07': 50, // C. y León
        '08': 40, // C. La Mancha
        '04': 25, // Baleares
        '05': 90, // Canarias
    };

    const handleSelect = (id: string, name: string) => {
        setSelected({ id, name });
        console.log(`Region seleccionada: ${name} (${id})`);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-4">
            <header className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">{t.map_title}</h1>
            </header>

            <div className="flex-1">
                <SpainRegionsMap
                    valuesByRegion={demoValues}
                    onRegionSelect={handleSelect}
                />
            </div>

            <footer className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{t.map_selection_details}</h2>
                {selected ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-bold text-primary">{selected.name}</p>
                            <p className="text-xs text-slate-400">ID: {selected.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-700 dark:text-slate-200">
                                {demoValues[selected.id] || 0}%
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase">{t.map_heatmap_value}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400 italic text-sm">{t.map_click_region}</p>
                )}
            </footer>
        </div>
    );
};
