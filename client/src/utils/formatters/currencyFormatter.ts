import { DEFAULT_LOCALE } from '../../constants';

const DEFAULT_FORMATTER_OPTIONS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
};

interface CurrencyFormatterOptions {
  locale: string;
  options: Intl.NumberFormatOptions;
}

export class CurrencyFormatter {
  private locale: string;
  private options: Intl.NumberFormatOptions;

  constructor({ locale = DEFAULT_LOCALE, options = DEFAULT_FORMATTER_OPTIONS }: Partial<CurrencyFormatterOptions> = {}) {
    this.locale = locale;
    this.options = options;
  }

  format(value: string): string {
    if (value === '' || value === '.') return value;

    const number = parseFloat(value.replace(/,/g, ''));
    return isNaN(number) ? value : new Intl.NumberFormat(this.locale, this.options).format(number);
  }

  formatWithSymbol(value: string, currencySymbol: string): string {
    const formattedValue = this.format(value);
    return `${currencySymbol}${formattedValue}`;
  }
}
