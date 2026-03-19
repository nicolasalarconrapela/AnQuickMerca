import React from 'react';
import { useStoreInteraction } from '../../store/useStoreInteraction';
import { StoreLayout } from '../../domain/store-layout/types';
import { Map, X } from 'lucide-react';

interface Props {
  layout: StoreLayout;
}

export const StoreInspectorPanel: React.FC<Props> = ({ layout }) => {
  const selectedBlockId = useStoreInteraction((state) => state.selectedBlockId);
  const addRouteTarget = useStoreInteraction((state) => state.addRouteTarget);
  const setSelectedBlockId = useStoreInteraction((state) => state.setSelectedBlockId);
  const routeTargetBlockIds = useStoreInteraction((state) => state.routeTargetBlockIds);

  if (!selectedBlockId) return null;

  const block = layout.blocks.find((b) => b.id === selectedBlockId);
  if (!block) return null;

  const isTarget = routeTargetBlockIds.includes(block.id);

  return (
    <div className="absolute right-4 top-4 z-10 w-80 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{block.departmentName}</h2>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded mt-1">
            Zona: {block.zoneType}
          </span>
        </div>
        <button
          onClick={() => setSelectedBlockId(null)}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full text-zinc-500"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Categorías</h3>
        <ul className="text-sm space-y-1 text-zinc-700 dark:text-zinc-300 max-h-40 overflow-y-auto">
          {block.categories.map((cat) => (
            <li key={cat.id} className="truncate">• {cat.name}</li>
          ))}
          {block.categories.length === 0 && <li className="italic text-zinc-400">Sin categorías específicas</li>}
        </ul>
      </div>

      <button
        onClick={() => {
          if (!isTarget) addRouteTarget(block.id);
        }}
        disabled={isTarget}
        className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
          isTarget
            ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-700 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
        }`}
      >
        <Map size={18} />
        {isTarget ? 'Añadido a ruta' : 'Añadir a ruta'}
      </button>
    </div>
  );
};
