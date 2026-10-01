/**
 * Alias for /api/bus-arrival.js to support exact PascalCase /api/BusArrival
 */
import busArrivalHandler from './bus-arrival.js';

export default async function handler(req, res) {
  return busArrivalHandler(req, res);
}
