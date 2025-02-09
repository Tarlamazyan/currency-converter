import { renderHook, act } from '@testing-library/react';
import { useCombobox } from '../useCombobox.ts';
import { describe, it, expect, vi } from 'vitest';

const mockOptions = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' }
];

describe('useCombobox Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCombobox(mockOptions, vi.fn()));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.search).toBe('');
    expect(result.current.highlightedIndex).toBe(null);
    expect(result.current.filteredOptions).toEqual(mockOptions);
  });

  it('should filter options based on search input', () => {
    const { result } = renderHook(() => useCombobox(mockOptions, vi.fn()));

    act(() => {
      result.current.setSearch('EUR');
    });

    expect(result.current.filteredOptions).toEqual([{ code: 'EUR', name: 'Euro', flag: '🇪🇺' }]);
  });

  it('should handle selection and update search value', () => {
    const handleChange = vi.fn();
    const { result } = renderHook(() => useCombobox(mockOptions, handleChange));

    act(() => {
      result.current.handleSelect(1);
    });

    expect(handleChange).toHaveBeenCalledWith(mockOptions[1]);
    expect(result.current.search).toBe('EUR - Euro');
    expect(result.current.isOpen).toBe(false);
  });

  it('should not select a disabled option', () => {
    const handleChange = vi.fn();
    const { result } = renderHook(() => useCombobox(mockOptions, handleChange, 'EUR'));

    act(() => {
      result.current.handleSelect(1);
    });

    expect(handleChange).not.toHaveBeenCalled();
  });
});
