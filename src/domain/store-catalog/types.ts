/**
 * Tipos que representan la respuesta cruda de la API del catálogo
 * Mantienen exactamente los campos devueltos por la red.
 */

export interface ApiCategory {
  id: number;
  name: string;
  order: number;
  layout: number;
  published: boolean;
  is_extended: boolean;
}

export interface ApiSection {
  id: number;
  name: string;
  order: number;
  layout: number;
  published: boolean;
  is_extended: boolean;
  categories: ApiCategory[];
}

export interface ApiStoreCatalogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiSection[];
}

/**
 * Tipos del Dominio Interno
 * Representan la abstracción sobre la cual construimos la UI y el mapa 3D
 */

export type StoreZoneType =
  | 'produce'
  | 'bakery'
  | 'ambient'
  | 'refrigerated'
  | 'frozen'
  | 'ready-meals'
  | 'household'
  | 'perfume'
  | 'pet'
  | 'baby'
  | 'checkout'
  | 'unknown';

export interface StoreCategory {
  id: number;
  name: string;
  order: number;
  layout: number;
  published: boolean;
  isExtended: boolean; // Normalizado a camelCase
}

export interface StoreDepartment {
  id: number;
  name: string;
  zoneType: StoreZoneType; // Nuestro mapeo semántico espacial
  order: number;
  layout: number;
  published: boolean;
  isExtended: boolean;
  categories: StoreCategory[];
}
