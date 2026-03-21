import { Vector3Tuple } from '../store-layout/types';

/**
 * Distancia Manhattan en plano XZ. Ignoramos Y (altura).
 */
export const manhattanDistance = (p1: Vector3Tuple, p2: Vector3Tuple): number => {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[2] - p2[2]);
};

/**
 * Obtiene el centro de una posición y su tamaño.
 */
export const getCenter = (position: Vector3Tuple, size: Vector3Tuple): Vector3Tuple => [
  position[0] + size[0] / 2,
  position[1] + size[1] / 2,
  position[2] + size[2] / 2,
];
