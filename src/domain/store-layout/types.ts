import { StoreCategory, StoreZoneType } from '../store-catalog/types';

export type Vector3Tuple = [number, number, number];

export interface StoreLayoutFootprint {
  kind: 'rectangle' | 'polygon';
  width: number;
  depth: number;
  points?: [number, number][]; // For polygon support
}

export interface StoreZoneBlockMetadata {
  priority: number;
  sourceDepartmentId: number;
  tags: string[];
  strategy: string;
  score: number;
  [key: string]: unknown;
}

export interface StoreZoneBlock {
  id: string;
  departmentId: number;
  departmentName: string;
  zoneType: StoreZoneType;
  color: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  rotation: Vector3Tuple;
  label: string;
  categories: StoreCategory[];
  metadata: StoreZoneBlockMetadata;
}

export interface StoreLayoutMetadata {
  version: string;
  generatedAt: string;
  strategy: string;
  [key: string]: unknown;
}

export interface Entrance {
  id: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  rotation: Vector3Tuple;
}

export interface CheckoutArea {
  id: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  rotation: Vector3Tuple;
}

export interface StoreLayout {
  id: string;
  name: string;
  footprint: StoreLayoutFootprint;
  blocks: StoreZoneBlock[];
  entrances: Entrance[];
  checkouts: CheckoutArea[];
  metadata: StoreLayoutMetadata;
}

export interface LayoutGenerationOptions {
  width: number;
  depth: number;
  strategy?: 'auto' | 'grid' | 'bands';
}
