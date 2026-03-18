import { StoreLayout, StoreZoneBlock } from './types';
import { StoreZoneType } from '../store-catalog/types';

/**
 * Obtiene el listado completo de los bloques de zona generados para el layout
 */
export const getZoneBlocks = (layout: StoreLayout): StoreZoneBlock[] => layout.blocks;

/**
 * Encuentra el bloque renderizable que representa a un departamento específico.
 * Útil cuando el usuario selecciona una subcategoría y queremos resaltar su padre en el 3D.
 */
export const getBlockByDepartmentId = (
  layout: StoreLayout,
  departmentId: number
): StoreZoneBlock | undefined => {
  return layout.blocks.find(block => block.departmentId === departmentId);
};

/**
 * Obtiene todos los bloques que pertenecen a una macrozona (ej: todas las neveras).
 * Ideal para encender/apagar luces o darles estilos en lote al renderizador.
 */
export const getBlocksByZoneType = (
  layout: StoreLayout,
  zoneType: StoreZoneType
): StoreZoneBlock[] => {
  return layout.blocks.filter(block => block.zoneType === zoneType);
};

/**
 * Devuelve el huella y fronteras para configurar la escena principal de cámara.
 */
export const getLayoutFootprint = (layout: StoreLayout) => layout.footprint;
