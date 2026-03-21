import React from 'react';
import { Text } from '@react-three/drei';
import { Vector3Tuple } from '../../domain/store-layout/types';

interface Props {
  text: string;
  position: Vector3Tuple;
  visible?: boolean;
}

export const StoreLabel: React.FC<Props> = ({ text, position, visible = true }) => {
  if (!visible) return null;

  return (
    <Text
      position={position}
      rotation={[-Math.PI / 2, 0, 0]} // Tumbado para verse desde arriba
      fontSize={1.2}
      color="#1f2937" // text-gray-800
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.1}
      outlineColor="#ffffff"
      renderOrder={2}
    >
      {text}
    </Text>
  );
};
