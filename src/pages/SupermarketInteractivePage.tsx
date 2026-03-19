import React, { useMemo } from 'react';
import { StoreLayout } from '../domain/store-layout/types';
import { generateStoreLayout } from '../domain/store-layout/generators';
import { StoreScene } from '../components/store/StoreScene';
import { StoreInspectorPanel } from '../components/store-ui/StoreInspectorPanel';
import { StoreDepartmentList } from '../components/store-ui/StoreDepartmentList';
import { StoreToolbar } from '../components/store-ui/StoreToolbar';
import { StoreDepartment } from '../domain/store-catalog/types';

// Datos Mock generados para probar UI independiente del API
const MOCK_DEPARTMENTS: StoreDepartment[] = [
  { id: 1, name: 'Fruits & vegetables', zoneType: 'produce', order: 1, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 2, name: 'Bread & bakery', zoneType: 'bakery', order: 2, layout: 1, published: true, isExtended: false, categories: [{ id: 201, name: 'Pan fresco', order: 1, layout: 1, published: true, isExtended: false }] },
  { id: 3, name: 'Pizza & ready meals', zoneType: 'ready-meals', order: 3, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 4, name: 'Meat', zoneType: 'refrigerated', order: 4, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 5, name: 'Seafood & fish', zoneType: 'refrigerated', order: 5, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 6, name: 'Frozen food', zoneType: 'frozen', order: 6, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 7, name: 'Oils, spices & sauces', zoneType: 'ambient', order: 7, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 8, name: 'Water & soft drinks', zoneType: 'ambient', order: 8, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 9, name: 'Cereal & biscuits', zoneType: 'ambient', order: 9, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 10, name: 'Cleaning & household', zoneType: 'household', order: 10, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 11, name: 'Facial & body care', zoneType: 'perfume', order: 11, layout: 1, published: true, isExtended: false, categories: [] },
  { id: 12, name: 'Pet', zoneType: 'pet', order: 12, layout: 1, published: true, isExtended: false, categories: [] },
];

export const SupermarketInteractivePage: React.FC = () => {
  // Generar un layout básico a partir de departamentos
  // En producción se sacaría del estado global de la API.
  const layout = useMemo<StoreLayout>(() => {
    return generateStoreLayout(MOCK_DEPARTMENTS, { width: 30, depth: 40 });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900 font-sans">
      {/* HUD UI Capa */}
      <StoreDepartmentList layout={layout} />
      <StoreInspectorPanel layout={layout} />
      <StoreToolbar layout={layout} />

      {/* Capa 3D principal (ocupa toda la pantalla de fondo) */}
      <StoreScene layout={layout} />
    </div>
  );
};
