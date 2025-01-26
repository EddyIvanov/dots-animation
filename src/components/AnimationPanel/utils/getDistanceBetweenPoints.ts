/**
 * Get the distance between 2 points
 * @param point1
 * @param point2
 * @returns number
 */
export const getDistanceBetweenPoints = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;

  return Math.sqrt(dx * dx + dy * dy);
};
