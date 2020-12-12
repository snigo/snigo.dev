import round from './round';

/**
 * Generates random number within range with certain precision
 *
 * @param {number[]} range Array of min and max values of the range
 * @param {number} precision Precision, the generated number to be rounded to
 */
function random(range: [number, number] = [0, 1], precision: number = 12): number {
  const [min, max] = range;
  return round(min + Math.random() * (max - min), precision);
}

export default random;
