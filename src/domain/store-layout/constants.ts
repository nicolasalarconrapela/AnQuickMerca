import { StoreZoneType } from '../store-catalog/types';

/**
 * Colores semánticos iniciales para visualizar las zonas.
 */
export const ZONE_COLORS: Record<StoreZoneType, string> = {
  produce: '#4ade80',      // verde (tailwind green-400)
  bakery: '#fbbf24',       // ámbar (amber-400)
  ambient: '#f87171',      // coral/rojo suave (red-400)
  refrigerated: '#7dd3fc', // azul claro (sky-300)
  frozen: '#3b82f6',       // azul intenso (blue-500)
  'ready-meals': '#f97316',// naranja (orange-500)
  household: '#a78bfa',    // violeta suave (violet-400)
  perfume: '#f472b6',      // rosa/magenta suave (pink-400)
  pet: '#a16207',          // marrón claro (yellow-700)
  baby: '#bae6fd',         // celeste suave (sky-200)
  checkout: '#4b5563',     // gris oscuro (gray-600)
  unknown: '#d1d5db',      // gris neutro (gray-300)
};

/**
 * Heurística de pesos de tamaño.
 * 1.0 = bloque estándar.
 * Mayor valor = bloque más grande en el layout generado.
 */
export const ZONE_SIZE_WEIGHTS: Record<StoreZoneType, number> = {
  ambient: 3.0,
  refrigerated: 2.0,
  frozen: 1.5,
  produce: 1.5,
  household: 1.2,
  bakery: 1.0,
  'ready-meals': 0.8,
  perfume: 0.8,
  pet: 0.5,
  baby: 0.5,
  checkout: 1.0,
  unknown: 1.0,
};

/**
 * Prioridad de posicionamiento (Placement Strategy).
 * Se usa para ordenar los departamentos antes de asignarlos a una región del mapa.
 */
export const ZONE_PLACEMENT_PRIORITY: Record<StoreZoneType, number> = {
  // Alta prioridad (entrada / frontal)
  produce: 100,
  bakery: 95,
  'ready-meals': 90,

  // Media alta (perímetro / bandas)
  refrigerated: 80,
  frozen: 75,

  // Media (centro / núcleo)
  ambient: 50,
  household: 45,
  perfume: 40,

  // Secundaria (huecos / trasera)
  pet: 20,
  baby: 15,

  // Fija o ignorada (cajas van aparte)
  checkout: 0,
  unknown: 0,
};

export type LayoutRegion = 'front' | 'center' | 'left' | 'right' | 'back' | 'any';

/**
 * Región preferida para colocar cada zona en una tienda rectangular.
 */
export const ZONE_PREFERRED_REGION: Record<StoreZoneType, LayoutRegion> = {
  produce: 'front',
  bakery: 'front',
  'ready-meals': 'front',

  refrigerated: 'back',
  frozen: 'left',

  ambient: 'center',

  perfume: 'right',
  household: 'right',

  pet: 'any',
  baby: 'any',

  checkout: 'front',
  unknown: 'any',
};
