import React from 'react';
import { StoreLayoutFootprint } from '../../domain/store-layout/types';

interface Props {
  footprint: StoreLayoutFootprint;
}

export const StoreFloor: React.FC<Props> = ({ footprint }) => {
  return (
    <mesh position={[footprint.width / 2, -0.05, footprint.depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[footprint.width, footprint.depth]} />
      <meshStandardMaterial color="#f3f4f6" /> {/* gris muy claro para suelo */}
      <gridHelper args={[Math.max(footprint.width, footprint.depth), 20, '#d1d5db', '#e5e7eb']} rotation={[Math.PI / 2, 0, 0]} />
    </mesh>
  );
};
