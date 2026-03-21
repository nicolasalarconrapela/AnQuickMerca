import React, { useMemo } from 'react';
import { useStoreInteraction } from '../../store/useStoreInteraction';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

export const StoreRouteLine: React.FC = () => {
  const currentRoute = useStoreInteraction((state) => state.currentRoute);

  const points = useMemo(() => {
    if (!currentRoute || currentRoute.points.length === 0) return [];

    // Elevamos ligeramente la Y para que no se mezcle con el suelo (z-fighting)
    return currentRoute.points.map((p) => new THREE.Vector3(p.position[0], 0.15, p.position[2]));
  }, [currentRoute]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color="#16a34a" // green-600
      lineWidth={4} // En píxeles en pantalla
      dashed={false}
      renderOrder={1} // Dibuja la ruta por encima del suelo
    />
  );
};
