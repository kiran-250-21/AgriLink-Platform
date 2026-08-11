/**
 * AgriLink Financial & Logistics Calculation Utilities
 */

// Distance mapping between common regional agricultural market hubs (in km)
const DISTANCE_MATRIX = {
  'GUNTUR-VIJAYAWADA': 35,
  'VIJAYAWADA-GUNTUR': 35,
  'GUNTUR-TENALI': 28,
  'TENALI-GUNTUR': 28,
  'GUNTUR-GUNTUR': 12, // Local market transport
  'VIJAYAWADA-VIJAYAWADA': 15,
  'TENALI-TENALI': 10,
  'GUNTUR-KURNOOL': 260,
  'KURNOOL-GUNTUR': 260,
  'VIJAYAWADA-KURNOOL': 290,
  'GUNTUR-HYDERABAD': 270,
  'VIJAYAWADA-HYDERABAD': 275,
  'GUNTUR-VISAKHAPATNAM': 350,
  'VIJAYAWADA-VISAKHAPATNAM': 350,
};

/**
 * Calculates estimated distance in kilometers between two locations.
 */
const calculateDistanceKm = (origin, destination) => {
  if (!origin || !destination) return 25;
  const o = origin.trim().toUpperCase();
  const d = destination.trim().toUpperCase();

  if (o === d) return 15; // Local district transport

  const key = `${o}-${d}`;
  if (DISTANCE_MATRIX[key]) return DISTANCE_MATRIX[key];

  // Heuristic based on string hash for deterministic unknown pairs
  let sum = 0;
  for (let i = 0; i < o.length + d.length; i++) {
    sum += (o.charCodeAt(i % o.length) || 0) + (d.charCodeAt(i % d.length) || 0);
  }
  return 30 + (sum % 85); // 30 - 115 km range fallback
};

/**
 * Calculates estimated logistics transportation cost.
 * Base fare + (Weight in Tons * Distance in Km * Rate per Km per Ton)
 */
const calculateLogisticsCost = (quantityKg, distanceKm) => {
  const weightTons = Math.max(0.5, quantityKg / 1000);
  const baseCost = 2000; // Flat loading/unloading & base haulage fee
  const ratePerKmPerTon = 12; // INR 12 per km per ton

  const transportCost = baseCost + distanceKm * weightTons * ratePerKmPerTon;
  return Math.round(transportCost);
};

/**
 * Calculates Gross Revenue, Logistics Cost, and Estimated Net Revenue.
 */
const calculateNetRevenue = (pricePerKg, quantityKg, distanceKm) => {
  const grossRevenue = Math.round(pricePerKg * quantityKg);
  const estimatedLogisticsCost = calculateLogisticsCost(quantityKg, distanceKm);
  const estimatedNetRevenue = Math.max(0, grossRevenue - estimatedLogisticsCost);

  return {
    sellingPrice: pricePerKg,
    grossRevenue,
    estimatedLogisticsCost,
    estimatedNetRevenue,
    distanceKm,
  };
};

module.exports = {
  calculateDistanceKm,
  calculateLogisticsCost,
  calculateNetRevenue,
};
