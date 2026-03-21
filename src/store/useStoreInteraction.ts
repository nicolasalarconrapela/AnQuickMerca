import { create } from 'zustand';
import { StoreRoutePath } from '../domain/store-routing/types';

interface StoreInteractionState {
  hoveredBlockId: string | null;
  selectedBlockId: string | null;
  routeTargetBlockIds: string[];
  currentRoute: StoreRoutePath | null;

  setHoveredBlockId: (id: string | null) => void;
  setSelectedBlockId: (id: string | null) => void;
  addRouteTarget: (id: string) => void;
  removeRouteTarget: (id: string) => void;
  clearRouteTargets: () => void;
  setCurrentRoute: (route: StoreRoutePath | null) => void;
}

export const useStoreInteraction = create<StoreInteractionState>((set) => ({
  hoveredBlockId: null,
  selectedBlockId: null,
  routeTargetBlockIds: [],
  currentRoute: null,

  setHoveredBlockId: (id) => set({ hoveredBlockId: id }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  addRouteTarget: (id) =>
    set((state) => {
      if (state.routeTargetBlockIds.includes(id)) return state;
      return { routeTargetBlockIds: [...state.routeTargetBlockIds, id] };
    }),
  removeRouteTarget: (id) =>
    set((state) => ({
      routeTargetBlockIds: state.routeTargetBlockIds.filter((targetId) => targetId !== id),
    })),
  clearRouteTargets: () => set({ routeTargetBlockIds: [], currentRoute: null }),
  setCurrentRoute: (route) => set({ currentRoute: route }),
}));
