import { describe, it, expect } from 'vitest';
import { CurrencyFormatter } from '../currencyFormatter';

describe('CurrencyFormatter', (): void => {
  it('formats numbers correctly', (): void => {
    const formatter = new CurrencyFormatter({ locale: 'en-US' });

    expect(formatter.format('1000')).toBe('1,000');
    expect(formatter.format('1000.5')).toBe('1,000.5');
    expect(formatter.format('1000000')).toBe('1,000,000');
  });

  it('handles empty and invalid values', (): void => {
    const formatter = new CurrencyFormatter({ locale: 'en-US' });

    expect(formatter.format('')).toBe('');
    expect(formatter.format('.')).toBe('.');
    expect(formatter.format('abc')).toBe('abc');
  });

  it('removes commas before formatting', (): void => {
    const formatter = new CurrencyFormatter({ locale: 'en-US' });

    expect(formatter.format('1,000')).toBe('1,000');
    expect(formatter.format('10,00,000')).toBe('1,000,000');
  });

  it('formats using different locales', (): void => {
    const usFormatter = new CurrencyFormatter({ locale: 'en-US' });
    const deFormatter = new CurrencyFormatter({ locale: 'de-DE' });

    expect(usFormatter.format('1000.5')).toBe('1,000.5');
    expect(deFormatter.format('1000.5')).toBe('1.000,5');
  });

  it('formats with currency symbol', (): void => {
    const formatter = new CurrencyFormatter({ locale: 'en-US' });

    expect(formatter.formatWithSymbol('1000', '$')).toBe('$1,000');
    expect(formatter.formatWithSymbol('1000.5', '€')).toBe('€1,000.5');
  });
});
