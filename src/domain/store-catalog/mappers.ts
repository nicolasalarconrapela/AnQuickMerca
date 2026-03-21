import {
  ApiStoreCatalogResponse,
  ApiSection,
  ApiCategory,
  StoreDepartment,
  StoreCategory,
  StoreZoneType
} from './types';
import { zoneBySectionName, DEFAULT_ZONE_TYPE } from './constants';

/**
 * Transforma una categoría recibida desde la API en una entidad de dominio.
 * Aplica normalización de datos (ej: is_extended -> isExtended).
 */
export const mapApiCategoryToDomain = (apiCategory: ApiCategory): StoreCategory => ({
  id: apiCategory.id,
  name: apiCategory.name, // Mantenemos el nombre original en inglés
  order: apiCategory.order,
  layout: apiCategory.layout,
  published: apiCategory.published,
  isExtended: apiCategory.is_extended,
});

/**
 * Transforma una sección devuelta por la API en un Departamento del supermercado
 * calculando además a qué macrozona espacial pertenece según su nombre.
 */
export const mapApiSectionToDepartment = (apiSection: ApiSection): StoreDepartment => {
  // Obtenemos el tipo de zona o asignamos la zona 'unknown' por defecto
  const mappedZoneType: StoreZoneType = zoneBySectionName[apiSection.name] || DEFAULT_ZONE_TYPE;

  return {
    id: apiSection.id,
    name: apiSection.name,
    zoneType: mappedZoneType,
    order: apiSection.order,
    layout: apiSection.layout,
    published: apiSection.published,
    isExtended: apiSection.is_extended,
    // Mapeamos las subcategorías (si no vienen devolvemos arreglo vacío)
    categories: Array.isArray(apiSection.categories)
      ? apiSection.categories.map(mapApiCategoryToDomain)
      : [],
  };
};

/**
 * Función principal para convertir toda la respuesta cruda de la API
 * en una colección limpia de Departamentos lista para la UI o el renderizador 3D.
 */
export const mapApiSectionsToDepartments = (
  response: ApiStoreCatalogResponse
): StoreDepartment[] => {
  if (!response || !Array.isArray(response.results)) {
    return [];
  }

  return response.results.map(mapApiSectionToDepartment);
};
