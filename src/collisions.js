// src/collisions.js

/**
  Reusable distanceSq, overlaps, and withinRange functions 
 */

export function distanceSq(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}
export function overlaps(a, b, factor = 1) {
  const radius = (a.r + b.r) * factor;
  return distanceSq(a, b) <= radius * radius;
}
export function withinRange(a, b, range) {
  return distanceSq(a, b) <= range * range;
}
