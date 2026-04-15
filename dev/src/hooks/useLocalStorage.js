/**
 * Custom hook for managing localStorage with JSON serialization
 * Provides a clean interface for getting, setting, removing, and clearing data
 *
 * @param {string} key - localStorage key
 * @returns {object} Methods to interact with localStorage:
 *   - getItem(): Returns parsed value or undefined
 *   - setItem(value): Stores JSON-serialized value
 *   - removeItem(): Removes this key from localStorage
 *   - clear(): Clears entire localStorage
 */
export function useLocalStorage(key) {
  return {
    /**
     * Get item from localStorage
     * @returns {any} Parsed value or undefined if not found
     */
    getItem() {
      if (typeof window === 'undefined') {
        return undefined;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return undefined;
      }

      try {
        return JSON.parse(item);
      } catch (error) {
        console.warn(`Failed to parse localStorage item "${key}":`, error);
        return undefined;
      }
    },

    /**
     * Set item in localStorage
     * @param {any} value - Value to store (will be JSON-serialized)
     */
    setItem(value) {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to set localStorage item "${key}":`, error);
      }
    },

    /**
     * Remove item from localStorage
     */
    removeItem() {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.removeItem(key);
    },

    /**
     * Clear entire localStorage
     */
    clear() {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.clear();
    },
  };
}
