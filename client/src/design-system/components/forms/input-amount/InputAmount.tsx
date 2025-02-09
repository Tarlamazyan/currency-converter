import React, { useState, useCallback, useMemo, ChangeEvent, useId, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { palette, fontSizes } from '../../../styles';
import { CurrencyFormatter } from '../../../../utils';
import { DEFAULT_LOCALE } from '../../../../constants';

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
  background-color: ${({ disabled }) => disabled ? palette['gray-200'] : palette.white};
  color: ${({ disabled }) => disabled ? palette['gray-600'] : palette.dark};
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
  border: 2px solid ${({ $hasError }) => ($hasError ? palette.danger : palette['gray-400'])};
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? palette.danger : palette.primary)};
    box-shadow: 0 0 0 1px ${({ $hasError }) => ($hasError ? palette.danger : palette.primary)};
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
    locale = DEFAULT_LOCALE,
    onEnterPress
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const [rawValue, setRawValue] = useState<string>(value);
  const formatter = useMemo(() => new CurrencyFormatter({ locale }), [locale]);

  const validateValue = useCallback((num: number): boolean => {
    if (maxValue !== undefined && num > maxValue) {
      return false;
    }

    return !(minValue !== undefined && num < minValue);
    }, [maxValue, minValue]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const rawInput = e.target.value.replace(/[^0-9.]/g, '');

    if (rawInput === '' || rawInput === '.') {
      setRawValue(rawInput);
      onChange(rawInput);
      return;
    }

    const numericValue = parseFloat(rawInput);

    if (!isNaN(numericValue) && validateValue(numericValue)) {
      const formatted = formatter.format(rawInput);
      setRawValue(formatted);
      onChange(formatted);
    }
  }, [onChange, validateValue, formatter]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && onEnterPress) {
      onEnterPress();
    }
  }, [onEnterPress]);

  const ariaDescribedbyFinal = error ? `${errorId} ${descriptionId}` : descriptionId;

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
          value={rawValue}
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
        {`Enter amount in ${currency}. Use numbers and decimal point only. ${
          maxValue !== undefined ? `Maximum value is ${maxValue}.` : ''
        } ${
          minValue !== undefined ? `Minimum value is ${minValue}.` : ''
        }`}
      </ScreenReaderOnly>
    </InputWrapper>
  );
};
