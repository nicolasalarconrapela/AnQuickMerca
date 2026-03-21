import { StoreDepartment } from '../store-catalog/types';
import { StoreLayout, StoreZoneBlock, LayoutGenerationOptions } from './types';
import { createRectangularFootprint, createGridCells } from './geometry';
import { sortByPlacementPriority, createBlockFromBox } from './placement';

/**
 * Función central de conversión a bloque espacial.
 * Genera bloques renderizables a partir de los Departamentos del negocio.
 * Utiliza una estrategia sencilla de grilla (Grid Layout).
 */
export const generateZoneBlocksFromDepartments = (
  departments: StoreDepartment[],
  options: LayoutGenerationOptions
): StoreZoneBlock[] => {
  // Ordenar por prioridad (ej: Frescos primero, Secos en el centro)
  const sortedDepartments = sortByPlacementPriority(departments);
  const totalDeps = sortedDepartments.length;

  if (totalDeps === 0) return [];

  // Calcular filas y columnas para la grilla básica en función de la raíz cuadrada
  const cols = Math.ceil(Math.sqrt(totalDeps * (options.width / options.depth)));
  const rows = Math.ceil(totalDeps / cols);

  const bounds = {
    x: 0,
    z: 0, // asumiendo origen (0,0)
    width: options.width,
    depth: options.depth,
  };

  const cells = createGridCells(bounds, cols, rows);

  // Configuración de separación
  const config = {
    padding: 0.5,    // pasillos de 0.5 unidades de ancho virtual
    height: 3,       // Altura virtual para motor 3D
    baseWidth: bounds.width / cols,
    baseDepth: bounds.depth / rows,
  };

  // Convertimos las celdas disponibles en bloques semánticos
  return sortedDepartments.map((dept, i) => {
    const cell = cells[i] || cells[cells.length - 1]; // Fallback si sobran departamentos
    return createBlockFromBox(cell, dept, config);
  });
};

/**
 * Orquestador Principal del Mapeo de Layout.
 * Convierte el listado crudo de dominios en un mapa espacial completo.
 */
export const generateStoreLayout = (
  departments: StoreDepartment[],
  options: LayoutGenerationOptions
): StoreLayout => {
  const footprint = createRectangularFootprint(options.width, options.depth);

  const blocks = generateZoneBlocksFromDepartments(departments, options);

  // Zonas fijas pre-calculadas para la escena inicial.
  // Podremos aplicar lógica avanzada después, por ahora son constantes referenciales.
  const entrances = [
    {
      id: 'entrance-main',
      position: [options.width / 2 - 2, 0, 0] as [number, number, number],
      size: [4, 3, 1] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    },
  ];

  const checkouts = [
    {
      id: 'checkout-zone-1',
      position: [2, 0, 1] as [number, number, number],
      size: [8, 1, 3] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    },
  ];

  return {
    id: `layout-${Date.now()}`,
    name: 'Automatic Standard Layout',
    footprint,
    blocks,
    entrances,
    checkouts,
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      strategy: options.strategy || 'auto',
      totalDepartmentsMapped: departments.length,
    },
  };
};
