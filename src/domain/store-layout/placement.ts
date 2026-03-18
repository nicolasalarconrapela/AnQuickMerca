import { StoreDepartment } from '../store-catalog/types';
import { StoreZoneBlock } from './types';
import { BoundingBox, applyPadding } from './geometry';
import { ZONE_COLORS, ZONE_SIZE_WEIGHTS, ZONE_PLACEMENT_PRIORITY } from './constants';

export interface PlacementConfig {
  padding: number;
  height: number;
  baseWidth: number;
  baseDepth: number;
}

/**
 * Ordena los departamentos según nuestra estrategia semántica (prioridad de frescura o perimetral).
 */
export const sortByPlacementPriority = (departments: StoreDepartment[]): StoreDepartment[] => {
  return [...departments].sort((a, b) => {
    const priorityA = ZONE_PLACEMENT_PRIORITY[a.zoneType] || 0;
    const priorityB = ZONE_PLACEMENT_PRIORITY[b.zoneType] || 0;

    // Descendente (mayor prioridad primero)
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    // Empate: mantener orden original de la API
    return a.order - b.order;
  });
};

/**
 * Convierte un Bounding Box puro en un Bloque Renderizable (StoreZoneBlock)
 * inyectándole los datos del Departamento.
 */
export const createBlockFromBox = (
  box: BoundingBox,
  department: StoreDepartment,
  config: PlacementConfig
): StoreZoneBlock => {
  const paddedBox = applyPadding(box, config.padding);

  // Consideramos heurística de peso si quisiéramos escalar (opcional en fase 2,
  // aquí respetamos la caja asignada pero podríamos guardar el peso para metadatos).
  const weight = ZONE_SIZE_WEIGHTS[department.zoneType] || 1.0;

  return {
    id: `block-${department.id}`,
    departmentId: department.id,
    departmentName: department.name,
    zoneType: department.zoneType,
    color: ZONE_COLORS[department.zoneType] || ZONE_COLORS.unknown,
    // [x, y, z] -> [ancho, altura, profundidad]
    position: [paddedBox.x, 0, paddedBox.z],
    // Asignamos una altura base para dar volumen 3D después
    size: [paddedBox.width, config.height, paddedBox.depth],
    // Sin rotación en la grilla básica inicial
    rotation: [0, 0, 0],
    label: department.name,
    categories: [...department.categories],
    metadata: {
      priority: ZONE_PLACEMENT_PRIORITY[department.zoneType] || 0,
      sourceDepartmentId: department.id,
      tags: [department.zoneType],
      strategy: 'grid-cell',
      score: weight,
    },
  };
};
