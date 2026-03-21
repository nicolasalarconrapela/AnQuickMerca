import { StoreZoneType } from './types';

/**
 * Diccionario para mapear el nombre comercial de la sección (API)
 * a una macrozona lógica del supermercado (Dominio).
 * Facilita agrupar secciones en áreas comunes (ej: mapa 3D).
 */
export const zoneBySectionName: Record<string, StoreZoneType> = {
  // Frescos / Produce
  'Fruits & vegetables': 'produce',

  // Panadería
  'Bread & bakery': 'bakery',

  // Congelados
  'Frozen food': 'frozen',

  // Refrigerados
  'Meat': 'refrigerated',
  'Seafood & fish': 'refrigerated',
  'Deli & cheese': 'refrigerated',
  'Eggs, milk & butter': 'refrigerated',
  'Dessert & yoghurt': 'refrigerated',

  // Platos preparados
  'Pizza & ready meals': 'ready-meals',

  // Cuidado del hogar
  'Cleaning & household': 'household',

  // Perfumería y cuidado personal
  'Facial & body care': 'perfume',
  'Hair care': 'perfume',
  'Makeup': 'perfume',
  'Herbal remedies & parapharmacy': 'perfume',

  // Mascotas
  'Pet': 'pet',

  // Bebés
  'Baby': 'baby',

  // Resto de secos (Ambient)
  'Oils, spices & sauces': 'ambient',
  'Water & soft drinks': 'ambient',
  'Snacks': 'ambient',
  'Rice, pulses & pasta': 'ambient',
  'Sugar, sweets & chocolate': 'ambient',
  'Beer, wine & spirits': 'ambient',
  'Chocolate drinks, coffee & tea': 'ambient',
  'Cereal & biscuits': 'ambient',
  'Cans, soups & creams': 'ambient',
  'Juice': 'ambient',
};

/**
 * Constantes adicionales si fueran necesarias en un futuro (por ejemplo, el default).
 */
export const DEFAULT_ZONE_TYPE: StoreZoneType = 'unknown';
