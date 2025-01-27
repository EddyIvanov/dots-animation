/**
 * Calculate opacity for a given distance
 * @param distance
 * @returns alpha in range 0-1
 */
export const getOpacityFromDistance = (distance: number): number => {
  const maxDistance = 100;
  const threshold = 50; // Threshold for transition

  // more aggressive black line
  if (distance <= threshold) {
    return 0;
  }

  return distance / maxDistance / 1.1;
};
