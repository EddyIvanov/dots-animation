import { getRandomBetween } from '../../../helpers';

/**
 * Helper function that returns random velocity speed
 * @returns number
 */
export const getRandomVelocitySpeed = (): number => {
  const minSpeed = 0.001;
  const maxSpeed = 0.005;

  return getRandomBetween(minSpeed, maxSpeed);
};
