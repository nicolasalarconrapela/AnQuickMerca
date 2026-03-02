import React, { useState, useCallback, useRef, useEffect } from "react";

interface Transform {
  scale: number;
  x: number;
  y: number;
}

interface UsePanZoomOptions {
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

export const usePanZoom = ({
  minScale = 0.5,
  maxScale = 4,
  initialScale = 1,
}: UsePanZoomOptions = {}) => {
  const [transform, setTransform] = useState<Transform>({
    scale: initialScale,
    x: 0,
    y: 0,
  });
  const containerRef = useRef<SVGSVGElement | null>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const clampScale = useCallback(
    (newScale: number) => {
      return Math.max(minScale, Math.min(newScale, maxScale));
    },
    [minScale, maxScale],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = 0.1;
      const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
      const newScale = clampScale(transform.scale * delta);

      if (newScale === transform.scale) return;

      // Adjust x and y to zoom towards the mouse position
      const dx = (mouseX - transform.x) / transform.scale;
      const dy = (mouseY - transform.y) / transform.scale;

      const newX = mouseX - dx * newScale;
      const newY = mouseY - dy * newScale;

      setTransform({
        scale: newScale,
        x: newX,
        y: newY,
      });
    },
    [transform, clampScale],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      if ("clientX" in e) {
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      } else if (e.touches && e.touches[0]) {
        lastMousePos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current) return;

      let clientX, clientY;
      if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }

      const dx = clientX - lastMousePos.current.x;
      const dy = clientY - lastMousePos.current.y;

      setTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastMousePos.current = { x: clientX, y: clientY };
    },
    [],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  return {
    transform,
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setTransform,
  };
};
