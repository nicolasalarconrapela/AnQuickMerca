import { StoreDepartment, StoreCategory, StoreZoneType } from './types';

/**
 * Encuentra un departamento por su ID en la colección de departamentos cargada.
 */
export const getDepartmentById = (departments: StoreDepartment[], id: number): StoreDepartment | undefined => {
  return departments.find((dept) => dept.id === id);
};

/**
 * Agrupa todos los departamentos según la macrozona a la que pertenecen.
 * Ideal para el motor 3D cuando necesita renderizar "todas las neveras" o "toda la frutería".
 */
export const groupDepartmentsByZone = (
  departments: StoreDepartment[]
): Record<StoreZoneType, StoreDepartment[]> => {
  return departments.reduce((acc, department) => {
    const zone = department.zoneType;
    if (!acc[zone]) {
      acc[zone] = [];
    }
    acc[zone].push(department);
    return acc;
  }, {} as Record<StoreZoneType, StoreDepartment[]>);
};

/**
 * Filtra la colección y devuelve solo los departamentos que están publicados ('published: true').
 */
export const getPublishedDepartments = (departments: StoreDepartment[]): StoreDepartment[] => {
  return departments.filter((dept) => dept.published);
};

/**
 * Ordena los departamentos en base a su propiedad 'order'.
 * Utilidad principal para el pintado secuencial en menús de la UI.
 */
export const sortDepartmentsByOrder = (departments: StoreDepartment[]): StoreDepartment[] => {
  return [...departments].sort((a, b) => a.order - b.order);
};

/**
 * Extrae y aplana todas las categorías de todos los departamentos en un único arreglo.
 * Útil para menús rápidos o buscadores globales de subcategorías sin depender de su sección padre.
 */
export const flattenCategories = (departments: StoreDepartment[]): StoreCategory[] => {
  return departments.reduce<StoreCategory[]>((acc, department) => {
    return acc.concat(department.categories || []);
  }, []);
};
