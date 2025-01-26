/**
 * Generates a random value between a minimum and maximum value (inclusive).
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random value between min and max.
 */
export const getRandomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
