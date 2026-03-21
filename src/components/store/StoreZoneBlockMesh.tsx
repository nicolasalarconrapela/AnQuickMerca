import React, { useRef } from 'react';
import { useStoreInteraction } from '../../store/useStoreInteraction';
import { StoreZoneBlock } from '../../domain/store-layout/types';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';
import { StoreLabel } from './StoreLabel';

interface Props {
  block: StoreZoneBlock;
}

export const StoreZoneBlockMesh: React.FC<Props> = ({ block }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Estado global de interacción
  const hoveredBlockId = useStoreInteraction((state) => state.hoveredBlockId);
  const selectedBlockId = useStoreInteraction((state) => state.selectedBlockId);
  const routeTargetBlockIds = useStoreInteraction((state) => state.routeTargetBlockIds);
  const currentRoute = useStoreInteraction((state) => state.currentRoute);

  const setHoveredBlockId = useStoreInteraction((state) => state.setHoveredBlockId);
  const setSelectedBlockId = useStoreInteraction((state) => state.setSelectedBlockId);

  // Estados derivados
  const isHovered = hoveredBlockId === block.id;
  const isSelected = selectedBlockId === block.id;
  const isRouteTarget = routeTargetBlockIds.includes(block.id);
  const isInRoutePath = currentRoute?.points.some((p) => p.blockId === block.id);

  // Cálculos visuales
  const scaleY = isSelected ? 1.2 : isHovered ? 1.1 : 1.0;

  // Como el centro base ya es block.size[1]/2 (centerY),
  // ajustamos posición Y para que al crecer mantenga su base en 0.
  const height = block.size[1];
  const positionY = block.position[1] + (height * scaleY - height) / 2;

  let displayColor = block.color;
  let emissiveIntensity = 0;

  if (isSelected) {
    emissiveIntensity = 0.3;
  } else if (isHovered) {
    emissiveIntensity = 0.15;
  }

  // Resaltado extra si es destino de ruta
  if (isRouteTarget) {
    displayColor = '#16a34a'; // tailwind green-600
    emissiveIntensity = Math.max(emissiveIntensity, 0.2);
  } else if (isInRoutePath) {
    displayColor = '#86efac'; // tailwind green-300
    emissiveIntensity = Math.max(emissiveIntensity, 0.1);
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[block.position[0], positionY, block.position[2]]}
        scale={[1, scaleY, 1]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHoveredBlockId(block.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          if (hoveredBlockId === block.id) {
            setHoveredBlockId(null);
            document.body.style.cursor = 'default';
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBlockId(block.id === selectedBlockId ? null : block.id);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={block.size} />
        <meshStandardMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={emissiveIntensity}
          transparent={true}
          opacity={isHovered || isSelected || isRouteTarget ? 0.95 : 0.8}
        />

        {/* Bordes para dar definición al bloque */}
        <Edges
          linewidth={isSelected ? 3 : 1}
          color={isSelected ? '#000000' : '#4b5563'}
        />
      </mesh>

      {/* Etiqueta arriba del bloque */}
      <StoreLabel
        text={block.label}
        position={[block.position[0], positionY + height * scaleY / 2 + 0.1, block.position[2]]}
      />
    </group>
  );
};
