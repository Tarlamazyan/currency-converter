import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', (): void => {
  it('returns initial value immediately', (): void => {
    const { result } = renderHook(() => useDebounce('test', 300));

    expect(result.current).toBe('test');
  });

  it('updates debounced value after delay', async (): Promise<void> => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' }
    });

    rerender({ value: 'updated' });

    expect(result.current).toBe('initial');

    act((): void => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  it('does not update value before delay', async (): Promise<void> => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'start' }
    });

    rerender({ value: 'changed' });

    expect(result.current).toBe('start');

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('start');

    vi.useRealTimers();
  });

  it('cleans up previous timeouts', async (): Promise<void> => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'first' }
    });

    rerender({ value: 'second' });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    rerender({ value: 'third' });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current).toBe('third');

    vi.useRealTimers();
  });
});
