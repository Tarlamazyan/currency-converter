import { useState, useEffect } from 'react';

/**
 * Custom debounce hook.
 *
 * Exchange rates update only once every 24 hours.
 * However, debounce is used to prevent UI flickering when users type quickly.
 * It ensures the value updates only after the user stops typing.
 *
 * @param value - The input value to debounce
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
