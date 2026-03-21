import React from 'react';
import { StoreLayoutFootprint } from '../../domain/store-layout/types';

interface Props {
  footprint: StoreLayoutFootprint;
}

export const StoreFloor: React.FC<Props> = ({ footprint }) => {
  return (
    <group>
      {/* Suelo que abarca el layout, posicionado en el centro del Footprint (width/2, depth/2) y en y=-0.1 */}
      <mesh
        position={[footprint.width / 2, -0.1, footprint.depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[footprint.width, footprint.depth]} />
        <meshStandardMaterial color="#e5e7eb" /> {/* tailwind gray-200 */}
      </mesh>

      {/* Grilla orientativa */}
      <gridHelper
        position={[footprint.width / 2, -0.05, footprint.depth / 2]}
        args={[Math.max(footprint.width, footprint.depth), 20, '#9ca3af', '#d1d5db']}
      />
    </group>
  );
};
