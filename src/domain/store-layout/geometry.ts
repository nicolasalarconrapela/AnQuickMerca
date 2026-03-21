import { StoreLayoutFootprint, Vector3Tuple } from './types';

/**
 * Crea la huella rectangular básica que define los límites del mapa.
 */
export const createRectangularFootprint = (width: number, depth: number): StoreLayoutFootprint => ({
  kind: 'rectangle',
  width,
  depth,
  points: [
    [0, 0],
    [width, 0],
    [width, depth],
    [0, depth],
  ],
});

/**
 * Calcula el centro geométrico dado un tamaño y una posición (esquina inferior izquierda).
 */
export const calculateCenter = (position: Vector3Tuple, size: Vector3Tuple): Vector3Tuple => [
  position[0] + size[0] / 2,
  position[1] + size[1] / 2, // Altura media
  position[2] + size[2] / 2,
];

export interface BoundingBox {
  x: number;
  z: number;
  width: number;
  depth: number;
}

/**
 * Genera celdas (bounding boxes) para una grilla simple.
 * Útil para la estrategia de posicionamiento automático inicial.
 */
export const createGridCells = (
  bounds: BoundingBox,
  cols: number,
  rows: number
): BoundingBox[] => {
  const cells: BoundingBox[] = [];
  const cellWidth = bounds.width / cols;
  const cellDepth = bounds.depth / rows;

  // Recorremos de atrás hacia adelante (Z) y de izquierda a derecha (X)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: bounds.x + c * cellWidth,
        z: bounds.z + r * cellDepth,
        width: cellWidth,
        depth: cellDepth,
      });
    }
  }

  return cells;
};

/**
 * Reduce un Bounding Box aplicándole un margen interno (padding).
 * Evita que los bloques choquen entre sí (pasillos virtuales).
 */
export const applyPadding = (box: BoundingBox, padding: number): BoundingBox => ({
  x: box.x + padding,
  z: box.z + padding,
  width: Math.max(0, box.width - padding * 2),
  depth: Math.max(0, box.depth - padding * 2),
});
