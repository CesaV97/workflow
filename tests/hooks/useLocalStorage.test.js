import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from '../../src/hooks/useLocalStorage';

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with undefined for non-existent key', () => {
    const { getItem } = useLocalStorage('nonexistent');
    const value = getItem();
    expect(value).toBeUndefined();
  });

  it('should store and retrieve string values', () => {
    const { setItem, getItem } = useLocalStorage('test-string');
    setItem('hello');
    const value = getItem();
    expect(value).toBe('hello');
  });

  it('should store and retrieve object values', () => {
    const { setItem, getItem } = useLocalStorage('test-object');
    const testObj = { id: '123', name: 'Test Project' };
    setItem(testObj);
    const value = getItem();
    expect(value).toEqual(testObj);
  });

  it('should store and retrieve array values', () => {
    const { setItem, getItem } = useLocalStorage('test-array');
    const testArray = [1, 2, 3];
    setItem(testArray);
    const value = getItem();
    expect(value).toEqual(testArray);
  });

  it('should remove stored value', () => {
    const { setItem, removeItem, getItem } = useLocalStorage('test-remove');
    setItem('value');
    expect(getItem()).toBe('value');
    removeItem();
    expect(getItem()).toBeUndefined();
  });

  it('should clear only the current key', () => {
    const hook1 = useLocalStorage('key1');
    const hook2 = useLocalStorage('key2');
    hook1.setItem('value1');
    hook2.setItem('value2');

    hook1.clear();
    expect(hook1.getItem()).toBeUndefined();
    expect(hook2.getItem()).toBe('value2');
  });

  it('should handle null values', () => {
    const { setItem, getItem } = useLocalStorage('test-null');
    setItem(null);
    const value = getItem();
    expect(value).toBeNull();
  });

  it('should handle boolean values', () => {
    const { setItem, getItem } = useLocalStorage('test-bool');
    setItem(true);
    expect(getItem()).toBe(true);
    setItem(false);
    expect(getItem()).toBe(false);
  });
});
