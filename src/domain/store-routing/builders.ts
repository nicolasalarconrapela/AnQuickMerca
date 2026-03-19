import { StoreLayout, StoreZoneBlock, Entrance } from '../store-layout/types';
import { StoreRoutePath, StoreRoutePoint } from './types';
import { getCenter, manhattanDistance } from './geometry';

/**
 * Construye una ruta simple "Manhattan" desde la entrada pasando por los bloques elegidos.
 * No esquiva colisiones en esta fase, simplemente genera un recorrido ortogonal.
 */
export const buildRouteFromEntranceToBlocks = (
  layout: StoreLayout,
  entrance: Entrance | null,
  targetBlocks: StoreZoneBlock[]
): StoreRoutePath | null => {
  if (!entrance || targetBlocks.length === 0) return null;

  const points: StoreRoutePoint[] = [];
  let totalDistance = 0;

  // Punto inicial: Centro de la entrada (a nivel de suelo y=0.1)
  const startCenter = getCenter(entrance.position, entrance.size);
  let currentPos: [number, number, number] = [startCenter[0], 0.1, startCenter[2]];
  points.push({ position: currentPos });

  // Heurística simple: ordenar bloques destinos por cercanía al punto actual (Nearest Neighbor)
  const unvisited = [...targetBlocks];

  while (unvisited.length > 0) {
    unvisited.sort((a, b) => {
      const cA = getCenter(a.position, a.size);
      const cB = getCenter(b.position, b.size);
      return manhattanDistance(currentPos, cA) - manhattanDistance(currentPos, cB);
    });

    const nextBlock = unvisited.shift()!;
    const nextCenter = getCenter(nextBlock.position, nextBlock.size);
    const targetPos: [number, number, number] = [nextCenter[0], 0.1, nextCenter[2]];

    // Generar codo Manhattan (primero en X, luego en Z)
    const elbowPos: [number, number, number] = [targetPos[0], 0.1, currentPos[2]];

    if (elbowPos[0] !== currentPos[0]) {
       points.push({ position: elbowPos });
       totalDistance += Math.abs(elbowPos[0] - currentPos[0]);
    }

    if (targetPos[2] !== elbowPos[2]) {
       points.push({ position: targetPos, blockId: nextBlock.id });
       totalDistance += Math.abs(targetPos[2] - elbowPos[2]);
    } else {
       // Si ya estaba en la misma Z, el codo ES el destino. Actualizamos el blockId.
       points[points.length - 1].blockId = nextBlock.id;
    }

    currentPos = targetPos;
  }

  return {
    points,
    distance: totalDistance,
  };
};
