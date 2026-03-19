import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { StoreLayout } from '../../domain/store-layout/types';
import { StoreLayoutView } from './StoreLayoutView';
import { useStoreInteraction } from '../../store/useStoreInteraction';

interface Props {
  layout: StoreLayout;
}

export const StoreScene: React.FC<Props> = ({ layout }) => {
  const selectedBlockId = useStoreInteraction(state => state.selectedBlockId);
  const controlsRef = useRef<any>(null);

  // Efecto opcional: Centrar cámara rudimentariamente en bloque seleccionado
  useEffect(() => {
    if (selectedBlockId && controlsRef.current) {
      const block = layout.blocks.find(b => b.id === selectedBlockId);
      if (block) {
        // Obtenemos el centro del bloque
        const targetX = block.position[0] + block.size[0] / 2;
        const targetY = 0;
        const targetZ = block.position[2] + block.size[2] / 2;

        // Mover orbit controls focus (muy suave)
        controlsRef.current.target.set(targetX, targetY, targetZ);
        controlsRef.current.update();
      }
    }
  }, [selectedBlockId, layout.blocks]);

  // Cálculo de centro para cámara inicial
  const cx = layout.footprint.width / 2;
  const cz = layout.footprint.depth / 2;

  return (
    <div className="w-full h-full absolute inset-0 bg-zinc-50 dark:bg-zinc-900">
      <Canvas shadows>
        {/* Usar cámara ortográfica ayuda a que el mapa parezca más un "plano" profesional */}
        <OrthographicCamera
          makeDefault
          position={[cx, 100, cz + 100]}
          zoom={25}
          near={1}
          far={500}
        />

        <OrbitControls
          ref={controlsRef}
          target={[cx, 0, cz]}
          enableDamping
          dampingFactor={0.05}
          minZoom={10}
          maxZoom={100}
          maxPolarAngle={Math.PI / 2.1} // No dejar que la cámara baje del suelo
        />

        <ambientLight intensity={0.6} />
        <directionalLight position={[cx, 50, cz + 50]} intensity={0.8} castShadow />

        <StoreLayoutView layout={layout} />
      </Canvas>
    </div>
  );
};
