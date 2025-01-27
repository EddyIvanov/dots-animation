/**
 * Helper to maintain consistent velocity
 * @param dx
 * @param dy
 * @param dz
 * @param baseSpeed
 * @returns Object with 3 dimensions
 */
export const normalizeVelocity = (
  dx: number,
  dy: number,
  dz: number,
  baseSpeed: number = 0.002
): {
  vx: number;
  vy: number;
  vz: number;
} => {
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (distance === 0) return { vx: 0, vy: 0, vz: 0 };

  // Normalize and apply base speed
  return {
    vx: (dx / distance) * baseSpeed,
    vy: (dy / distance) * baseSpeed,
    vz: (dz / distance) * baseSpeed,
  };
};
