import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { palette, fontSizes } from '../../../styles';
import { useCombobox } from './hooks';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

interface SelectCurrencyProps {
  value: CurrencyOption;
  options: CurrencyOption[];
  onChange: (option: CurrencyOption | null) => void;
  label?: string;
  id: string;
  disabledOption?: string;
  fullWidth?: boolean;
  error?: string | null;
}

const ComboboxContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  position: relative;
`;

const ComboboxLabel = styled.label`
  ${fontSizes.sm};
  color: ${palette['gray-600']};
  margin-bottom: 4px;
  font-weight: 500;
`;

const ComboboxControl = styled.div<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid ${({ $hasError }) => ($hasError ? palette.danger : palette['gray-400'])};
  border-radius: 8px;
  background-color: ${palette.white};
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? palette.danger : palette.primary)};
    box-shadow: 0 0 0 1px ${({ $hasError }) => ($hasError ? palette.danger : palette.primary)};
  }
`;

const CurrencyFlag = styled.span`
  padding: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  ${fontSizes.lg};
  color: ${palette.dark};
  font-weight: 600;
  background-color: ${palette['gray-200']};
  border-right: 1px solid ${palette['gray-400']};
`;

const ComboboxInput = styled.input`
  width: 100%;
  padding: 12px;
  ${fontSizes.lg};
  font-weight: 600;
  outline: none;
  background-color: ${palette.white};
  color: ${palette.dark};
  border: none;

  &::placeholder {
    color: ${palette['gray-500']};
  }

  &:disabled {
    background-color: ${palette['gray-200']};
    cursor: not-allowed;
  }
`;

const ComboboxListBox = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  margin: 0;
  padding: 4px 0;
  background: ${palette.white};
  border: 1px solid ${palette['gray-400']};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
`;

const ComboboxOption = styled.li<{ $selected?: boolean; $disabled?: boolean; $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  ${fontSizes.base};
  background-color: ${({ $selected, $highlighted }) =>
  $selected ? palette['gray-200'] : $highlighted ? palette['gray-100'] : 'transparent'};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: background-color 0.2s ease;

  &:hover:not([aria-disabled="true"]) {
    background-color: ${palette['gray-200']};
  }
`;

const CurrencyIcon = styled.span`
  margin-right: 8px;
`;

export const SelectCurrency: React.FC<SelectCurrencyProps> = ({
  value,
  options,
  onChange,
  label,
  id,
  disabledOption,
  fullWidth = true,
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const {
    isOpen,
    setIsOpen,
    search,
    setSearch,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    findNextAvailableIndex
  } = useCombobox(options, onChange, disabledOption);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;

    setSearch(newValue);
    setIsOpen(true);

    if (newValue === '' && value.code) {
      onChange(null);
    }
  }, [setSearch, setIsOpen, value.code, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(findNextAvailableIndex(0, 'down'));
          return;
        }

        setHighlightedIndex((prev: number | null): number => {
          const direction = e.key === 'ArrowDown' ? 'down' : 'up';
          const startIndex = prev === null ? 0 : prev + (direction === 'down' ? 1 : -1);

          return findNextAvailableIndex(startIndex, direction);
        });
        break;

      case 'Enter':
        e.preventDefault();

        if (highlightedIndex !== null && filteredOptions[highlightedIndex]?.code !== disabledOption) {
          onChange(filteredOptions[highlightedIndex]);
          setIsOpen(false);
          setSearch('');
          inputRef.current?.blur();
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(null);
        break;
    }
  }, [
    isOpen, setHighlightedIndex, highlightedIndex, filteredOptions, disabledOption, setIsOpen, findNextAvailableIndex, onChange, setSearch
  ]
);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (!listboxRef.current?.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;

  const handleOptionClick = useCallback((option: CurrencyOption): void => {
    onChange(option);
    setIsOpen(false);
    setSearch('');
    inputRef.current?.blur();
  }, [onChange, setIsOpen, setSearch]);

  return (
    <ComboboxContainer data-testid="combobox-container" $fullWidth={fullWidth}>
      {label && (
        <ComboboxLabel id={labelId} htmlFor={id}>
          {label}
        </ComboboxLabel>
      )}

      <ComboboxControl data-testid="combobox-control" $hasError={!!error}>
        <CurrencyFlag aria-hidden="true">{value.flag ? value.flag : '❓'}</CurrencyFlag>
        <ComboboxInput
          data-testid="combobox-input"
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-autocomplete="list"
          aria-live="polite"
          aria-activedescendant={highlightedIndex !== null ? `${id}-option-${highlightedIndex}` : undefined}
          type="text"
          placeholder="Search currency..."
          value={search !== '' ? search : value.code && value.name ? `${value.code} - ${value.name}` : ''}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen(true)}
        />
      </ComboboxControl>

      {isOpen && (
        <ComboboxListBox
          data-testid="combobox-listbox"
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label="Currencies"
        >
          {filteredOptions.map((option, index) => {
            const isDisabled = option.code === disabledOption;
            const isHighlighted = index === highlightedIndex;
            const isSelected = option.code === value.code;

            return (
              <ComboboxOption
                key={option.code}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected ? 'true' : undefined}
                aria-disabled={isDisabled}
                data-testid={`combobox-option-${option.code}`}
                $disabled={isDisabled}
                $highlighted={isHighlighted}
                $selected={isSelected}
                onClick={!isDisabled ? (): void => handleOptionClick(option) : undefined}
              >
                <CurrencyIcon data-testid="combobox-option-flag" aria-hidden="true">{option.flag}</CurrencyIcon>
                {option.code} - {option.name}
              </ComboboxOption>
            );
          })}
        </ComboboxListBox>
      )}
    </ComboboxContainer>
  );
};
