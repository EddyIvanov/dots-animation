import { DOTS_DISTANCE } from '../constants';
import { getDistanceBetweenPoints } from './getDistanceBetweenPoints';

/**
 * Check if two points are within a given radius in screen space
 * @param point1
 * @param point2
 * @param radius
 * @returns boolean
 */
export const isWithinRadius = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
  radius = DOTS_DISTANCE
): boolean => {
  return getDistanceBetweenPoints(point1, point2) <= radius;
};
