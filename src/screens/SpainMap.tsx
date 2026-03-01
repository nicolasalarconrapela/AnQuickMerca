import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, MapPin, Store, ChevronRight, Search, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import rawJsonData from '../../in/data/mercadona/jsons/locations/mercadona_listo_para_comer_enriquecido.json';

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

// ─── CCAA ↔ SVG‑path‑id mapping ──────────────────────────────────────────
// The SVG paths use id based on the community name.  This map connects the
// normalised data‑CCAA to the SVG path id.
const CCAA_SVG_IDS: Record<string, string> = {
    'ANDALUCÍA': 'andalucia',
    'ARAGÓN': 'aragon',
    'ISLAS BALEARES': 'baleares',
    'CANARIAS': 'canarias',
    'CANTABRIA': 'cantabria',
    'CASTILLA Y LEÓN': 'castilla-leon',
    'CASTILLA-LA MANCHA': 'castilla-mancha',
    'CATALUNYA': 'catalunya',
    'COMUNIDAD VALENCIANA': 'valencia',
    'EXTREMADURA': 'extremadura',
    'GALICIA': 'galicia',
    'COMUNIDAD DE MADRID': 'madrid',
    'REGIÓN DE MURCIA': 'murcia',
    'NAVARRA': 'navarra',
    'PAÍS VASCO': 'pais-vasco',
    'PRINCIPADO DE ASTURIAS': 'asturias',
    'LA RIOJA': 'la-rioja',
    'CEUTA': 'ceuta',
    'MELILLA': 'melilla',
};

// Reverse map:  svg-id → ccaa-name
const SVG_ID_TO_CCAA: Record<string, string> = {};
for (const [ccaa, svgId] of Object.entries(CCAA_SVG_IDS)) {
    SVG_ID_TO_CCAA[svgId] = ccaa;
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

// ─── Spain SVG Map Component ─────────────────────────────────────────────
// Simplified SVG paths for each autonomous community, designed to be
// recognisable and clickable.  Paths are approximate outlines.
function SpainSVG({
    hoveredCcaa,
    selectedCcaa,
    availableCcaas,
    onHover,
    onSelect,
}: {
    hoveredCcaa: string | null;
    selectedCcaa: string | null;
    availableCcaas: Set<string>;
    onHover: (ccaa: string | null) => void;
    onSelect: (ccaa: string) => void;
}) {
    const getFill = useCallback(
        (svgId: string) => {
            const ccaaName = SVG_ID_TO_CCAA[svgId];
            const hasData = ccaaName && availableCcaas.has(ccaaName);

            if (selectedCcaa && SVG_ID_TO_CCAA[svgId] === selectedCcaa) return '#007043';
            if (hoveredCcaa === svgId && hasData) return '#00a86b';
            if (hasData) return '#4ade80';
            return '#e2e8f0';
        },
        [hoveredCcaa, selectedCcaa, availableCcaas],
    );

    const getStroke = useCallback(
        (svgId: string) => {
            const ccaaName = SVG_ID_TO_CCAA[svgId];
            const hasData = ccaaName && availableCcaas.has(ccaaName);
            if (selectedCcaa && SVG_ID_TO_CCAA[svgId] === selectedCcaa) return '#004b2d';
            if (hasData) return '#047857';
            return '#94a3b8';
        },
        [selectedCcaa, availableCcaas],
    );

    const handleClick = useCallback(
        (svgId: string) => {
            const ccaaName = SVG_ID_TO_CCAA[svgId];
            if (ccaaName && availableCcaas.has(ccaaName)) {
                onSelect(ccaaName);
            }
        },
        [availableCcaas, onSelect],
    );

    const pathProps = (svgId: string) => ({
        fill: getFill(svgId),
        stroke: getStroke(svgId),
        strokeWidth: 1.2,
        strokeLinejoin: 'round' as const,
        className: `transition-all duration-200 ${availableCcaas.has(SVG_ID_TO_CCAA[svgId] ?? '') ? 'cursor-pointer' : 'cursor-default opacity-60'}`,
        onMouseEnter: () => onHover(svgId),
        onMouseLeave: () => onHover(null),
        onClick: () => handleClick(svgId),
    });

    return (
        <svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-lg">
            {/* Galicia */}
            <path id="galicia" d="M30,80 L60,55 L100,50 L120,70 L130,100 L110,140 L80,160 L40,150 L20,120 Z" {...pathProps('galicia')} />
            {/* Asturias */}
            <path id="asturias" d="M120,70 L170,55 L220,60 L225,90 L200,100 L130,100 Z" {...pathProps('asturias')} />
            {/* Cantabria */}
            <path id="cantabria" d="M220,60 L270,55 L290,65 L285,90 L250,95 L225,90 Z" {...pathProps('cantabria')} />
            {/* País Vasco */}
            <path id="pais-vasco" d="M290,65 L330,55 L350,65 L345,90 L310,95 L285,90 Z" {...pathProps('pais-vasco')} />
            {/* Navarra */}
            <path id="navarra" d="M345,90 L350,65 L390,60 L400,80 L395,110 L360,115 Z" {...pathProps('navarra')} />
            {/* La Rioja */}
            <path id="la-rioja" d="M285,90 L310,95 L345,90 L360,115 L340,130 L290,125 L270,110 Z" {...pathProps('la-rioja')} />
            {/* Aragón */}
            <path id="aragon" d="M360,115 L395,110 L400,80 L440,75 L460,100 L470,160 L460,220 L420,250 L380,240 L350,200 L340,160 L340,130 Z" {...pathProps('aragon')} />
            {/* Catalunya */}
            <path id="catalunya" d="M440,75 L490,65 L530,80 L540,120 L520,170 L470,190 L470,160 L460,100 Z" {...pathProps('catalunya')} />
            {/* Castilla y León */}
            <path id="castilla-leon" d="M80,160 L110,140 L130,100 L200,100 L225,90 L250,95 L270,110 L290,125 L340,130 L340,160 L320,200 L280,220 L240,230 L190,220 L140,230 L100,210 L70,190 Z" {...pathProps('castilla-leon')} />
            {/* Madrid */}
            <path id="madrid" d="M240,230 L280,220 L300,240 L295,270 L265,275 L240,260 Z" {...pathProps('madrid')} />
            {/* Castilla-La Mancha */}
            <path id="castilla-mancha" d="M190,220 L240,230 L240,260 L265,275 L295,270 L300,240 L320,200 L350,200 L380,240 L420,250 L430,290 L420,340 L380,360 L330,370 L280,350 L230,340 L200,310 L170,280 L160,250 Z" {...pathProps('castilla-mancha')} />
            {/* Comunidad Valenciana */}
            <path id="valencia" d="M420,250 L460,220 L470,190 L520,170 L530,210 L510,270 L480,330 L440,370 L410,360 L420,340 L430,290 Z" {...pathProps('valencia')} />
            {/* Extremadura */}
            <path id="extremadura" d="M40,250 L100,210 L140,230 L190,220 L160,250 L170,280 L200,310 L180,340 L140,360 L100,350 L60,320 L30,290 Z" {...pathProps('extremadura')} />
            {/* Región de Murcia */}
            <path id="murcia" d="M380,360 L410,360 L440,370 L440,410 L400,420 L370,400 Z" {...pathProps('murcia')} />
            {/* Andalucía */}
            <path id="andalucia" d="M60,320 L100,350 L140,360 L180,340 L200,310 L230,340 L280,350 L330,370 L380,360 L370,400 L400,420 L380,450 L320,470 L250,470 L180,450 L120,420 L70,400 L40,370 Z" {...pathProps('andalucia')} />
            {/* Islas Baleares */}
            <g id="baleares">
                <path d="M500,300 L530,290 L550,300 L555,320 L530,330 L505,320 Z" {...pathProps('baleares')} />
                <path d="M555,285 L575,280 L585,295 L570,305 L555,300 Z" {...pathProps('baleares')} />
            </g>
            {/* Canarias - shown as inset */}
            <g id="canarias" transform="translate(30, 470)">
                <rect x="-5" y="-5" width="200" height="55" rx="6" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="4 3" />
                <path d="M10,20 L30,10 L50,15 L55,30 L35,35 L10,30 Z" {...pathProps('canarias')} />
                <path d="M65,15 L85,8 L100,15 L95,30 L70,30 Z" {...pathProps('canarias')} />
                <path d="M110,12 L130,5 L145,10 L150,25 L135,30 L115,28 Z" {...pathProps('canarias')} />
                <path d="M155,15 L175,10 L185,20 L178,30 L158,28 Z" {...pathProps('canarias')} />
            </g>
            {/* Ceuta */}
            <circle id="ceuta" cx="185" cy="490" r="6" {...pathProps('ceuta')} />
            <text x="185" y="505" textAnchor="middle" fontSize="7" fill="#64748b">Ceuta</text>
            {/* Melilla */}
            <circle id="melilla" cx="230" cy="490" r="6" {...pathProps('melilla')} />
            <text x="230" y="505" textAnchor="middle" fontSize="7" fill="#64748b">Melilla</text>

            {/* CCAA name labels (abbreviated for fitting) */}
            <text x="70" y="115" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#1e293b" pointerEvents="none">GAL</text>
            <text x="170" y="85" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e293b" pointerEvents="none">AST</text>
            <text x="255" y="80" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#1e293b" pointerEvents="none">CANT</text>
            <text x="320" y="78" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#1e293b" pointerEvents="none">PV</text>
            <text x="373" y="92" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#1e293b" pointerEvents="none">NAV</text>
            <text x="310" y="115" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#1e293b" pointerEvents="none">RIO</text>
            <text x="400" y="170" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1e293b" pointerEvents="none">ARA</text>
            <text x="495" y="130" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1e293b" pointerEvents="none">CAT</text>
            <text x="200" y="175" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1e293b" pointerEvents="none">CyL</text>
            <text x="268" y="255" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e293b" pointerEvents="none">MAD</text>
            <text x="310" y="295" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#1e293b" pointerEvents="none">CLM</text>
            <text x="490" y="275" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#1e293b" pointerEvents="none">VAL</text>
            <text x="110" y="300" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#1e293b" pointerEvents="none">EXT</text>
            <text x="410" y="395" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e293b" pointerEvents="none">MUR</text>
            <text x="240" y="410" textAnchor="middle" fontSize="9" fontWeight="600" fill="#1e293b" pointerEvents="none">AND</text>
            <text x="540" y="315" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e293b" pointerEvents="none">BAL</text>
            <text x="128" y="505" textAnchor="middle" fontSize="7" fontWeight="600" fill="#1e293b" pointerEvents="none">CAN</text>
        </svg>
    );
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
    const [hoveredSvgId, setHoveredSvgId] = useState<string | null>(null);
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

    // ─ Hovered ccaa tooltip ─
    const hoveredCcaaName = useMemo(() => {
        if (!hoveredSvgId) return null;
        return SVG_ID_TO_CCAA[hoveredSvgId] ?? null;
    }, [hoveredSvgId]);



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
                        <div className="relative">
                            <SpainSVG
                                hoveredCcaa={hoveredSvgId}
                                selectedCcaa={selectedCcaaName ? CCAA_SVG_IDS[selectedCcaaName] ?? null : null}
                                availableCcaas={availableCcaas}
                                onHover={setHoveredSvgId}
                                onSelect={selectCcaa}
                            />
                            {/* Tooltip on hover */}
                            {hoveredCcaaName && availableCcaas.has(hoveredCcaaName) && (
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg pointer-events-none backdrop-blur-sm z-10 whitespace-nowrap">
                                    {titleCase(hoveredCcaaName)} — {ccaaMap.get(hoveredCcaaName)?.totalStores ?? 0} tiendas
                                </div>
                            )}
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
