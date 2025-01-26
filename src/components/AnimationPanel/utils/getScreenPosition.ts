import * as THREE from 'three';

/**
 * Convert 3D position to screen-space coordinates
 * @param vector
 * @param camera
 * @param canvas
 * @returns Point object
 */

export const getScreenPosition = (
  vector: THREE.Vector3,
  camera: THREE.Camera,
  canvas: HTMLCanvasElement
) => {
  const ndc = vector.clone().project(camera);
  const x = (ndc.x * 0.5 + 0.5) * canvas.clientWidth;
  const y = (1 - (ndc.y * 0.5 + 0.5)) * canvas.clientHeight; // Flip Y-axis
  return { x, y };
};
