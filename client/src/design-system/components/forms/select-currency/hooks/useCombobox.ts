import { useCallback, useMemo, useState } from 'react';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

/**
 * Custom hook for managing the state and behavior of a currency selection combobox.
 *
 * This hook provides filtering, keyboard navigation, and state management for a dropdown-based
 * currency selector. It allows searching, highlighting options with arrow keys, and selecting
 * a currency while ensuring a specified option can be disabled.
 *
 */
export const useCombobox = (
  options: CurrencyOption[],
  onChange: (option: CurrencyOption | null) => void,
  disabledOption?: string
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return options;
    }

    const lowerSearch = search.toLowerCase();

    return options.filter(
      (option): boolean =>
        option.name.toLowerCase().includes(lowerSearch) ||
        option.code.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  const findNextAvailableIndex = useCallback(
    (startIndex: number, direction: 'up' | 'down'): number => {
      let index = startIndex;
      while (
        (direction === 'down' ? index < filteredOptions.length : index >= 0) &&
        filteredOptions[index]?.code === disabledOption
        ) {
        index += direction === 'down' ? 1 : -1;
      }
      return index < 0 || index >= filteredOptions.length ? -1 : index;
    },
    [filteredOptions, disabledOption]
  );

  const handleSelect = useCallback(
    (index: number) => {
      if (index !== -1 && filteredOptions[index].code !== disabledOption) {
        onChange(filteredOptions[index]);
        setIsOpen(false);
        setSearch(`${filteredOptions[index].code} - ${filteredOptions[index].name}`);
      }
    },
    [filteredOptions, onChange, disabledOption]
  );

  return {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    findNextAvailableIndex,
    handleSelect
  };
};
