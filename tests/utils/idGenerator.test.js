import { describe, it, expect } from 'vitest';
import { generateId, generateIds } from '../../src/utils/idGenerator';

describe('idGenerator', () => {
  it('should generate a valid UUID v4 string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should generate unique IDs on multiple calls', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate multiple unique IDs', () => {
    const ids = generateIds(5);
    expect(ids).toHaveLength(5);
    expect(new Set(ids).size).toBe(5); // all unique
  });
});
