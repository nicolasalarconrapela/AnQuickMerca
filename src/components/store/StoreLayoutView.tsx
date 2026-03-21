import React from 'react';
import { StoreLayout } from '../../domain/store-layout/types';
import { StoreZoneBlockMesh } from './StoreZoneBlockMesh';
import { StoreRouteLine } from './StoreRouteLine';
import { StoreFloor } from './StoreFloor';

interface Props {
  layout: StoreLayout;
}

export const StoreLayoutView: React.FC<Props> = ({ layout }) => {
  return (
    <group>
      <StoreFloor footprint={layout.footprint} />

      {/* Bloques del supermercado */}
      <group>
        {layout.blocks.map((block) => (
          <StoreZoneBlockMesh key={block.id} block={block} />
        ))}
      </group>

      {/* Entrada (Visual) */}
      {layout.entrances.map((entrance) => (
        <mesh
          key={entrance.id}
          position={[entrance.position[0] + entrance.size[0]/2, entrance.size[1]/2, entrance.position[2] + entrance.size[2]/2]}
        >
          <boxGeometry args={entrance.size} />
          <meshStandardMaterial color="#fbbf24" transparent opacity={0.5} />
        </mesh>
      ))}

      <StoreRouteLine />
    </group>
  );
};
