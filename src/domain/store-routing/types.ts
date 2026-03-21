import { Vector3Tuple } from '../store-layout/types';

export interface StoreRoutePoint {
  position: Vector3Tuple;
  blockId?: string;
}

export interface StoreRoutePath {
  points: StoreRoutePoint[];
  distance: number;
}
