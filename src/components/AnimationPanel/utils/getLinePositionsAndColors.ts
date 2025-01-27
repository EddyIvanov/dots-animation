import { Vector3 } from 'three';

import { MAX_DOTS_DISTANCE } from '../constants';
import { getDistanceBetweenPoints } from './getDistanceBetweenPoints';
import { getOpacityFromDistance } from './getOpacityFromDistance';
import { getScreenPosition } from './getScreenPosition';

/**
 * Helper function to get line positions and colors related to the camera
 * @param camera
 * @param gl
 * @param positionsArray
 * @param dotsNumber
 * @param dotsDistance
 * @returns Object {positions, colors}
 */
export const getLinePositionsAndColors = ({
  camera,
  gl,
  positionsArray,
  dotsNumber,
  dotsDistance = MAX_DOTS_DISTANCE,
}): { positions: number[]; colors: number[] } => {
  const linePositions: number[] = [];
  const colors: number[] = [];

  // Update line colors and positions
  for (let i = 0; i < dotsNumber; i++) {
    const pos1 = new Vector3(
      positionsArray[i * 3],
      positionsArray[i * 3 + 1],
      positionsArray[i * 3 + 2]
    );
    const screenPos1 = getScreenPosition(pos1, camera, gl.domElement);

    for (let j = i + 1; j < dotsNumber; j++) {
      const pos2 = new Vector3(
        positionsArray[j * 3],
        positionsArray[j * 3 + 1],
        positionsArray[j * 3 + 2]
      );
      const screenPos2 = getScreenPosition(pos2, camera, gl.domElement);

      const distance = getDistanceBetweenPoints(screenPos1, screenPos2);
      if (distance < dotsDistance) {
        linePositions.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
        const alpha = getOpacityFromDistance(distance);
        colors.push(alpha, alpha, alpha, alpha, alpha, alpha);
      }
    }
  }

  return { positions: linePositions, colors };
};
