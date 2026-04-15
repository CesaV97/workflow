/**
 * Generate a unique identifier using crypto.randomUUID()
 * Returns a v4 UUID string (36 characters with hyphens)
 *
 * @returns {string} UUID v4 identifier
 * @example "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Generate multiple IDs at once
 * @param {number} count - Number of IDs to generate
 * @returns {string[]} Array of UUID identifiers
 */
export function generateIds(count) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}
