import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { StoreLayout } from '../../domain/store-layout/types';
import { StoreLayoutView } from './StoreLayoutView';
import { useStoreInteraction } from '../../store/useStoreInteraction';

interface Props {
  layout: StoreLayout;
}

// Fallback visual si el layout viene vacío o es null
const FALLBACK_LAYOUT: StoreLayout = {
  id: 'fallback-layout',
  name: 'Fallback Store',
  footprint: { kind: 'rectangle', width: 40, depth: 30 },
  metadata: { version: '1', generatedAt: '', strategy: 'fallback' },
  entrances: [{ id: 'ent', position: [20, 0, 0], size: [4, 1, 1], rotation: [0, 0, 0] }],
  checkouts: [],
  blocks: [
    {
      id: 'fb-1',
      departmentId: 1,
      departmentName: 'Fresh Food',
      zoneType: 'produce',
      color: '#4ade80',
      position: [10, 0, 10],
      size: [8, 3, 6],
      rotation: [0, 0, 0],
      label: 'Fresh Food',
      categories: [],
      metadata: { priority: 1, sourceDepartmentId: 1, tags: [], strategy: 'fallback', score: 1 },
    },
    {
      id: 'fb-2',
      departmentId: 2,
      departmentName: 'Groceries',
      zoneType: 'ambient',
      color: '#f87171',
      position: [30, 0, 10],
      size: [10, 4, 8],
      rotation: [0, 0, 0],
      label: 'Groceries',
      categories: [],
      metadata: { priority: 1, sourceDepartmentId: 2, tags: [], strategy: 'fallback', score: 1 },
    },
    {
      id: 'fb-3',
      departmentId: 3,
      departmentName: 'Cold',
      zoneType: 'refrigerated',
      color: '#7dd3fc',
      position: [20, 0, 25],
      size: [12, 5, 4],
      rotation: [0, 0, 0],
      label: 'Cold',
      categories: [],
      metadata: { priority: 1, sourceDepartmentId: 3, tags: [], strategy: 'fallback', score: 1 },
    }
  ]
};

export const StoreScene: React.FC<Props> = ({ layout: inputLayout }) => {
  const selectedBlockId = useStoreInteraction(state => state.selectedBlockId);
  const controlsRef = useRef<any>(null);

  // Protección contra layout vacío
  const layout = !inputLayout || !inputLayout.blocks || inputLayout.blocks.length === 0
    ? FALLBACK_LAYOUT
    : inputLayout;

  // Efecto opcional: Centrar cámara rudimentariamente en bloque seleccionado
  useEffect(() => {
    if (selectedBlockId && controlsRef.current) {
      const block = layout.blocks.find(b => b.id === selectedBlockId);
      if (block) {
        const targetX = block.position[0];
        const targetY = 0;
        const targetZ = block.position[2];

        controlsRef.current.target.set(targetX, targetY, targetZ);
        controlsRef.current.update();
      }
    }
  }, [selectedBlockId, layout.blocks]);

  // Cálculo de centro para cámara inicial
  const cx = layout.footprint.width / 2;
  const cz = layout.footprint.depth / 2;
  const maxDim = Math.max(layout.footprint.width, layout.footprint.depth);

  return (
    <div className="w-full h-full absolute inset-0 bg-zinc-100 dark:bg-zinc-900" style={{ zIndex: 0 }}>
      <Canvas shadows camera={{ position: [0, 0, 0] }}>
        <OrthographicCamera
          makeDefault
          position={[cx, maxDim, cz + maxDim]}
          zoom={window.innerWidth < 768 ? 12 : 20}
          near={-100}
          far={1000}
        />

        <OrbitControls
          ref={controlsRef}
          target={[cx, 0, cz]}
          enableDamping
          dampingFactor={0.05}
          minZoom={5}
          maxZoom={100}
          maxPolarAngle={Math.PI / 2.1}
        />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={[cx - maxDim, maxDim, cz + maxDim]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <StoreLayoutView layout={layout} />
      </Canvas>
    </div>
  );
};
