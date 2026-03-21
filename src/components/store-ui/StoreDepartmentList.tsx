import React, { useState } from 'react';
import { useStoreInteraction } from '../../store/useStoreInteraction';
import { StoreLayout } from '../../domain/store-layout/types';
import { Search } from 'lucide-react';

interface Props {
  layout: StoreLayout;
}

export const StoreDepartmentList: React.FC<Props> = ({ layout }) => {
  const [search, setSearch] = useState('');
  const setSelectedBlockId = useStoreInteraction((state) => state.setSelectedBlockId);
  const selectedBlockId = useStoreInteraction((state) => state.selectedBlockId);

  const filteredBlocks = layout.blocks.filter(b =>
    b.departmentName.toLowerCase().includes(search.toLowerCase()) ||
    b.zoneType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute left-4 top-4 z-10 w-72 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 flex flex-col max-h-[80vh]">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Buscar sección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
          />
        </div>
      </div>
      <ul className="overflow-y-auto p-2 flex-1 space-y-1">
        {filteredBlocks.map((block) => (
          <li key={block.id}>
            <button
              onClick={() => setSelectedBlockId(block.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedBlockId === block.id
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="truncate">{block.departmentName}</div>
              <div className="text-xs opacity-60 capitalize">{block.zoneType}</div>
            </button>
          </li>
        ))}
        {filteredBlocks.length === 0 && (
          <div className="p-4 text-center text-sm text-zinc-500">No hay resultados.</div>
        )}
      </ul>
    </div>
  );
};
