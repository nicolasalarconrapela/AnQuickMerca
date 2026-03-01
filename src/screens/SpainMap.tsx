import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, MapPin, Store, ChevronRight, Search, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import rawJsonData from '../../in/data/mercadona/jsons/locations/mercadona_listo_para_comer_enriquecido.json';
import { SpainRegionsMap } from '../components/SpainRegionsMap';

interface MercadonaLocation {
    ccaa: string;
    provincia: string;
    poblacion: { raw: string; nombre: string };
    direccion: { raw: string; via_tipo?: string; via_nombre?: string; numero?: string; detalle?: string };
    listo_para_comer: boolean | null;
    source: { table_index: number; row_index: number };
}

interface JsonData {
    meta: any;
    locations: MercadonaLocation[];
}

type DrillLevel = 'ccaa' | 'provincia' | 'poblacion' | 'tienda';

interface CcaaData {
    name: string;
    provincias: Map<string, PoblacionData[]>;
    totalStores: number;
}

interface PoblacionData {
    nombre: string;
    stores: MercadonaLocation[];
}

// ─── Normalise CCAA names coming from the JSON ────────────────────────────
const CCAA_NORMALISE: Record<string, string> = {
    'ANDALUCIA': 'ANDALUCÍA',
    'ARAGON': 'ARAGÓN',
    'ILLES BALEARS': 'ISLAS BALEARES',
    'REGION DE MURCIA': 'REGIÓN DE MURCIA',
    'CASTILLA Y LEON': 'CASTILLA Y LEÓN',
    'CASTILLA Y LEÓN': 'CASTILLA Y LEÓN',
    'EUSKADI': 'PAÍS VASCO',
};

function normaliseCcaa(raw: string): string {
    const upper = raw.toUpperCase().trim();
    return CCAA_NORMALISE[upper] ?? upper;
}

// ─── CCAA ↔ INE mapping (for new amCharts map) ──────────────────────────
const CCAA_TO_INE: Record<string, string> = {
    'ANDALUCÍA': '01',
    'ARAGÓN': '02',
    'PRINCIPADO DE ASTURIAS': '03',
    'ISLAS BALEARES': '04',
    'CANARIAS': '05',
    'CANTABRIA': '06',
    'CASTILLA Y LEÓN': '07',
    'CASTILLA-LA MANCHA': '08',
    'CATALUNYA': '09',
    'COMUNIDAD VALENCIANA': '10',
    'EXTREMADURA': '11',
    'GALICIA': '12',
    'COMUNIDAD DE MADRID': '13',
    'REGIÓN DE MURCIA': '14',
    'NAVARRA': '15',
    'PAÍS VASCO': '16',
    'LA RIOJA': '17',
    'CEUTA': '18',
    'MELILLA': '19',
};

// Reverse map: INE → ccaa-name
const INE_TO_CCAA: Record<string, string> = {};
for (const [ccaa, ine] of Object.entries(CCAA_TO_INE)) {
    INE_TO_CCAA[ine] = ccaa;
}

// ─── Pretty title case ───────────────────────────────────────────────────
function titleCase(s: string): string {
    return s
        .toLowerCase()
        .split(' ')
        .map(w => {
            if (['de', 'del', 'la', 'el', 'y', 'las', 'los'].includes(w)) return w;
            return w.charAt(0).toUpperCase() + w.slice(1);
        })
        .join(' ')
        .replace(/^./, c => c.toUpperCase());
}


// ─── Props ────────────────────────────────────────────────────────────────
interface Props {
    onNext: () => void;
}

// ─── Main StoreSelection with Spain Map ──────────────────────────────────
export function StoreSelection({ onNext }: Props) {
    const { selectedStore, setSelectedStore, favoriteStores, setFavoriteStores } = useAppContext();
    const jsonData = rawJsonData as unknown as JsonData;

    // Drill‑down state
    const [level, setLevel] = useState<DrillLevel>('ccaa');
    const [selectedCcaaName, setSelectedCcaaName] = useState<string | null>(null);
    const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);
    const [selectedPoblacion, setSelectedPoblacion] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // ─ Parse into hierarchical structure ─
    const ccaaMap = useMemo(() => {
        const map = new Map<string, CcaaData>();

        for (const loc of jsonData.locations) {
            const ccaaRaw = normaliseCcaa(loc.ccaa);
            if (!map.has(ccaaRaw)) {
                map.set(ccaaRaw, { name: ccaaRaw, provincias: new Map(), totalStores: 0 });
            }
            const ccaaEntry = map.get(ccaaRaw)!;
            ccaaEntry.totalStores++;

            const provKey = loc.provincia;
            if (!ccaaEntry.provincias.has(provKey)) {
                ccaaEntry.provincias.set(provKey, []);
            }
            // Group by poblacion nombre
            const poblaciones = ccaaEntry.provincias.get(provKey)!;
            const existing = poblaciones.find(p => p.nombre === loc.poblacion.nombre);
            if (existing) {
                existing.stores.push(loc);
            } else {
                poblaciones.push({ nombre: loc.poblacion.nombre, stores: [loc] });
            }
        }
        return map;
    }, [jsonData]);

    const availableCcaas = useMemo(() => new Set(ccaaMap.keys()), [ccaaMap]);

    // Data mapped for amCharts heatmap
    const mapValuesByRegion = useMemo(() => {
        const vals: Record<string, number> = {};
        for (const [name, data] of ccaaMap.entries()) {
            const ine = CCAA_TO_INE[name];
            if (ine) {
                vals[ine] = data.totalStores;
            }
        }
        return vals;
    }, [ccaaMap]);

    // ─ Current slice ─
    const currentProvincias = useMemo(() => {
        if (!selectedCcaaName) return [];
        const ccaa = ccaaMap.get(selectedCcaaName);
        if (!ccaa) return [];
        return Array.from(ccaa.provincias.entries()).map(([name, pobs]) => ({
            name,
            poblaciones: pobs,
            totalStores: pobs.reduce((a, p) => a + p.stores.length, 0),
        }));
    }, [ccaaMap, selectedCcaaName]);

    const currentPoblaciones = useMemo(() => {
        if (!selectedCcaaName || !selectedProvincia) return [];
        const ccaa = ccaaMap.get(selectedCcaaName);
        if (!ccaa) return [];
        const pobs = ccaa.provincias.get(selectedProvincia);
        return pobs ?? [];
    }, [ccaaMap, selectedCcaaName, selectedProvincia]);

    const currentStores = useMemo(() => {
        if (!selectedPoblacion) return [];
        const pob = currentPoblaciones.find(p => p.nombre === selectedPoblacion);
        return pob ? pob.stores : [];
    }, [currentPoblaciones, selectedPoblacion]);

    // ─ Filtered items based on search ─
    const filteredProvincias = useMemo(() => {
        if (!searchQuery) return currentProvincias;
        const q = searchQuery.toLowerCase();
        return currentProvincias.filter(p => p.name.toLowerCase().includes(q));
    }, [currentProvincias, searchQuery]);

    const filteredPoblaciones = useMemo(() => {
        if (!searchQuery) return currentPoblaciones;
        const q = searchQuery.toLowerCase();
        return currentPoblaciones.filter(p => p.nombre.toLowerCase().includes(q));
    }, [currentPoblaciones, searchQuery]);

    const filteredStores = useMemo(() => {
        if (!searchQuery) return currentStores;
        const q = searchQuery.toLowerCase();
        return currentStores.filter(s => s.direccion.raw.toLowerCase().includes(q));
    }, [currentStores, searchQuery]);

    // ─ Navigation helpers ─
    const goBack = () => {
        setSearchQuery('');
        if (level === 'tienda') {
            setSelectedPoblacion(null);
            setLevel('poblacion');
        } else if (level === 'poblacion') {
            setSelectedProvincia(null);
            setLevel('provincia');
        } else if (level === 'provincia') {
            setSelectedCcaaName(null);
            setLevel('ccaa');
        } else if (selectedStore) {
            onNext();
        }
    };

    const selectCcaa = (name: string) => {
        setSearchQuery('');
        setSelectedCcaaName(name);
        setLevel('provincia');
    };

    const selectProvincia = (name: string) => {
        setSearchQuery('');
        setSelectedProvincia(name);
        setLevel('poblacion');
    };

    const selectPoblacion = (name: string) => {
        setSearchQuery('');
        setSelectedPoblacion(name);
        setLevel('tienda');
    };

    const selectStore = (loc: MercadonaLocation) => {
        const storeObj = {
            id: `${loc.provincia}-${loc.poblacion.nombre}-${loc.direccion.raw}`,
            name: `Mercadona ${titleCase(loc.poblacion.nombre)}`,
            address: loc.direccion.raw,
            ccaa: selectedCcaaName,
            provincia: loc.provincia,
            poblacion: loc.poblacion.nombre,
            listoParaComer: loc.listo_para_comer,
        };
        setSelectedStore(storeObj);
        localStorage.setItem('selectedStore', JSON.stringify(storeObj));
        setTimeout(() => onNext(), 350);
    };

    // ─ Breadcrumb ─
    const breadcrumb = useMemo(() => {
        const parts: string[] = [];
        if (selectedCcaaName) parts.push(titleCase(selectedCcaaName));
        if (selectedProvincia) parts.push(titleCase(selectedProvincia));
        if (selectedPoblacion) parts.push(selectedPoblacion);
        return parts;
    }, [selectedCcaaName, selectedProvincia, selectedPoblacion]);

    return (
        <div className="flex flex-col min-h-screen w-full bg-white dark:bg-slate-900">
            {/* Header */}
            <header className="flex items-center p-4 gap-3 border-b border-slate-100 dark:border-slate-800">
                {(level !== 'ccaa' || selectedStore) && (
                    <button
                        onClick={goBack}
                        className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 truncate">
                        {level === 'ccaa' && 'Selecciona tu Mercadona'}
                        {level === 'provincia' && titleCase(selectedCcaaName ?? '')}
                        {level === 'poblacion' && titleCase(selectedProvincia ?? '')}
                        {level === 'tienda' && selectedPoblacion}
                    </h1>
                    {breadcrumb.length > 0 && level !== 'ccaa' && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                            {breadcrumb.join(' › ')}
                        </p>
                    )}
                </div>
                {level !== 'ccaa' && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {level === 'provincia' && `${currentProvincias.length} prov.`}
                        {level === 'poblacion' && `${currentPoblaciones.length} pobl.`}
                        {level === 'tienda' && `${currentStores.length} tiendas`}
                    </span>
                )}
            </header>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto hide-scrollbar">
                {/* ── CCAA Level: Show Map ── */}
                {level === 'ccaa' && (
                    <div className="px-4 pt-4 pb-6">
                        {/* Legend */}
                        <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-[#4ade80] border border-[#047857]" />
                                <span>Con tiendas</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-slate-200 border border-slate-400" />
                                <span>Sin datos</span>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="relative h-[35rem] bg-white rounded-xl shadow-inner border border-slate-100 overflow-hidden">
                            <SpainRegionsMap
                                valuesByRegion={mapValuesByRegion}
                                onRegionSelect={(ineId) => {
                                    const ccaaName = INE_TO_CCAA[ineId];
                                    if (ccaaName && availableCcaas.has(ccaaName)) {
                                        selectCcaa(ccaaName);
                                    }
                                }}
                            />
                        </div>

                        {/* Quick list below map */}
                        <div className="mt-4">
                            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Comunidades Autónomas ({availableCcaas.size})
                            </h2>
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from(ccaaMap.entries())
                                    .sort((a, b) => a[0].localeCompare(b[0]))
                                    .map(([name, data]) => (
                                        <button
                                            key={name}
                                            onClick={() => selectCcaa(name)}
                                            className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-left hover:bg-primary/10 hover:border-primary transition-all border border-slate-100 dark:border-slate-700 group"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                                    {titleCase(name)}
                                                </p>
                                                <p className="text-[10px] text-slate-400">{data.totalStores} tiendas</p>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Provincia Level ── */}
                {level === 'provincia' && (
                    <div className="px-4 pt-3 pb-6">
                        {currentProvincias.length > 5 && (
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Buscar provincia…"
                                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="space-y-2">
                            {filteredProvincias
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(prov => (
                                    <button
                                        key={prov.name}
                                        onClick={() => selectProvincia(prov.name)}
                                        className="w-full flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-left hover:bg-primary/10 transition-all border border-slate-100 dark:border-slate-700 group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-4.5 h-4.5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">
                                                {titleCase(prov.name)}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {prov.poblaciones.length} poblaciones · {prov.totalStores} tiendas
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* ── Poblacion Level ── */}
                {level === 'poblacion' && (
                    <div className="px-4 pt-3 pb-6">
                        {currentPoblaciones.length > 5 && (
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Buscar población…"
                                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="space-y-2">
                            {filteredPoblaciones
                                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                .map(pob => (
                                    <button
                                        key={pob.nombre}
                                        onClick={() => selectPoblacion(pob.nombre)}
                                        className="w-full flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-left hover:bg-primary/10 transition-all border border-slate-100 dark:border-slate-700 group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <Store className="w-4.5 h-4.5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">
                                                {pob.nombre}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">{pob.stores.length} tienda{pob.stores.length > 1 ? 's' : ''}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

                {/* ── Tienda Level ── */}
                {level === 'tienda' && (
                    <div className="px-4 pt-3 pb-6">
                        {currentStores.length > 5 && (
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Buscar dirección…"
                                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="space-y-2">
                            {filteredStores.map((store, i) => (
                                <button
                                    key={`${store.direccion.raw}-${i}`}
                                    onClick={() => selectStore(store)}
                                    className="w-full flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-left hover:bg-primary/10 transition-all border border-slate-100 dark:border-slate-700 group"
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${store.listo_para_comer === true ? 'bg-emerald-500/15' : 'bg-amber-500/15'
                                        }`}>
                                        <Store className={`w-4.5 h-4.5 ${store.listo_para_comer === true ? 'text-emerald-600' : 'text-amber-600'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">
                                            Mercadona
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{store.direccion.raw}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {store.listo_para_comer === true && (
                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                                    ✓ Listo para comer
                                                </span>
                                            )}
                                            {store.listo_para_comer === false && (
                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                    Sin "Listo para comer"
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
