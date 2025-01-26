/**
 * Calculate opacity for a given distance
 * @param distance
 * @returns alpha in range 0-1
 */
export const getOpacityFromDistance = (distance: number): number => {
  const alpha = distance / 100 / 5;

  return alpha;
};
