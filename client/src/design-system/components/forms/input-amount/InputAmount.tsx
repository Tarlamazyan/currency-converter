import React, {
  useState,
  useCallback,
  ChangeEvent,
  useId,
  useEffect
} from 'react';
import styled from 'styled-components';
import { palette, fontSizes } from '../../../styles';
import { useDebounce } from '../../../../hooks';

interface StyledProps {
  $hasError?: boolean;
  $fullWidth?: boolean;
  disabled?: boolean;
}

interface InputAmountProps {
  value: string;
  currency: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  fullWidth?: boolean;
  error?: string | null;
  disabled?: boolean;
  'aria-label'?: string;
  maxValue?: number;
  minValue?: number;
  locale?: string;
  onEnterPress?: () => void;
}

const InputWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  position: relative;
`;

const Label = styled.label`
  ${fontSizes.sm};
  color: ${palette['gray-600']};
  margin-bottom: 4px;
  font-weight: 500;
`;

const Input = styled.input<StyledProps>`
  width: 100%;
  padding: 12px;
  ${fontSizes.lg};
  font-weight: 600;
  border: none;
  outline: none;
  background-color: ${({ disabled }) =>
      disabled ? palette['gray-200'] : palette.white};
  color: ${({ disabled }) => (disabled ? palette['gray-600'] : palette.dark)};
  text-align: left;

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  ${fontSizes.sm};
  color: ${palette.danger};
  margin-top: 4px;
`;

const InputWithPrefix = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid
  ${({ $hasError }) => ($hasError ? palette.danger : palette['gray-400'])};
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ $hasError }) =>
        $hasError ? palette.danger : palette.primary};
    box-shadow: 0 0 0 1px
    ${({ $hasError }) => ($hasError ? palette.danger : palette.primary)};
  }
`;

const Prefix = styled.span`
  padding: 12px;
  display: flex;
  align-items: center;
  ${fontSizes.lg};
  color: ${palette.dark};
  font-weight: 600;
  background-color: ${palette['gray-200']};
  border-right: 1px solid ${palette['gray-400']};
`;

const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const formatNormalized = (normalized: string): string => {
  if (normalized === '' || normalized === '.') {
    return normalized;
  }

  const parts = normalized.split('.');
  let integerPart = parts[0];

  if (integerPart !== '') {
    integerPart = String(parseInt(integerPart, 10));
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return parts.length > 1 ? integerPart + '.' + parts[1] : integerPart;
};

const parseInput = (input: string, previous: string): string => {
  if (input === '') return '';

  if (input[0] === '.') {
    const rest = input.slice(1).replace(/\./g, '');
    return '.' + rest;
  }

  if (input.endsWith('.') && !previous.includes('.')) {
    return input.replace(/\./g, '') + '.';
  }

  if (previous.includes('.') || input.indexOf('.') !== input.lastIndexOf('.')) {
    const lastDotIndex = input.lastIndexOf('.');
    const fractionLength = input.length - lastDotIndex - 1;
    const allDigits = input.replace(/\./g, '');

    if (fractionLength > 0) {
      const integerPart = allDigits.slice(0, allDigits.length - fractionLength);
      const fractionalPart = allDigits.slice(allDigits.length - fractionLength);
      return integerPart + '.' + fractionalPart;
    }
    return allDigits + '.';
  }

  return input.replace(/\./g, '');
};

export const InputAmount: React.FC<InputAmountProps> = ({
  value,
  onChange,
  currency,
  label,
  id: providedId,
  error,
  fullWidth = true,
  disabled = false,
  'aria-label': ariaLabel,
  maxValue,
  minValue,
  onEnterPress
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const [rawNormalized, setRawNormalized] = useState<string>(value);
  const debouncedValue = useDebounce(rawNormalized, 300);

  const validateValue = useCallback((num: number): boolean => {
    if (maxValue !== undefined && num > maxValue) return false;
    if (minValue !== undefined && num < minValue) return false;
    return true;
  }, [maxValue, minValue]);

  useEffect((): void => {
    if (debouncedValue !== value && debouncedValue !== '') {
      const num = parseFloat(debouncedValue);
      if (!isNaN(num) && validateValue(num)) {
        onChange(debouncedValue);
      } else {
        onChange(debouncedValue);
      }
    }
  }, [debouncedValue, value, onChange, validateValue]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    const isFullSelection =
      selectionStart !== null &&
      selectionEnd !== null &&
      selectionStart === 0 &&
      selectionEnd === input.length;

    let newNormalized: string;
    if (isFullSelection) {
      newNormalized = input.replace(/\./g, '');
    } else {
      newNormalized = parseInput(input, rawNormalized);
    }
    setRawNormalized(newNormalized);
  }, [rawNormalized]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnterPress) {
        onEnterPress();
      }
    },
    [onEnterPress]
  );

  const ariaDescribedbyFinal = error
    ? `${errorId} ${descriptionId}`
    : descriptionId;

  return (
    <InputWrapper
      $fullWidth={fullWidth}
      role="group"
      aria-labelledby={id}
      data-testid="input-amount-wrapper"
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputWithPrefix $hasError={!!error}>
        <Prefix aria-hidden="true">{currency}</Prefix>
        <Input
          id={id}
          type="text"
          value={formatNormalized(rawNormalized)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputMode="decimal"
          aria-label={ariaLabel || label || `Amount in ${currency}`}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedbyFinal}
          disabled={disabled}
          data-testid="input-amount-field"
          autoComplete="off"
        />
      </InputWithPrefix>
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
      <ScreenReaderOnly id={descriptionId}>
        {`Enter the amount in ${currency}. Use only digits and, if necessary, a dot for the fractional part. ${maxValue !== undefined
          ? `The maximum value is ${maxValue}.`
          : ''} ${minValue !== undefined
            ? `The minimum value is ${minValue}.`
            : ''}`}
      </ScreenReaderOnly>
    </InputWrapper>
  );
};

