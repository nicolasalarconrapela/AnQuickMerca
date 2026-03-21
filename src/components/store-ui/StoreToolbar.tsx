import React from 'react';
import { useStoreInteraction } from '../../store/useStoreInteraction';
import { StoreLayout } from '../../domain/store-layout/types';
import { buildRouteFromEntranceToBlocks } from '../../domain/store-routing/builders';
import { Navigation, Trash2 } from 'lucide-react';

interface Props {
  layout: StoreLayout;
}

export const StoreToolbar: React.FC<Props> = ({ layout }) => {
  const routeTargetBlockIds = useStoreInteraction((state) => state.routeTargetBlockIds);
  const clearRouteTargets = useStoreInteraction((state) => state.clearRouteTargets);
  const setCurrentRoute = useStoreInteraction((state) => state.setCurrentRoute);

  const handleGenerateRoute = () => {
    if (routeTargetBlockIds.length === 0) return;

    const targets = layout.blocks.filter((b) => routeTargetBlockIds.includes(b.id));
    const entrance = layout.entrances[0] || null;

    const route = buildRouteFromEntranceToBlocks(layout, entrance, targets);
    setCurrentRoute(route);
  };

  if (routeTargetBlockIds.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-white dark:bg-zinc-800 p-2 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700">
      <div className="px-4 py-2 flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-700">
        {routeTargetBlockIds.length} destinos
      </div>
      <button
        onClick={handleGenerateRoute}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors"
      >
        <Navigation size={18} />
        Generar Ruta
      </button>
      <button
        onClick={clearRouteTargets}
        className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium flex items-center gap-2 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
