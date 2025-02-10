import { useMemo, useState } from 'react';
import {  useExchangeRates } from '../../../hooks';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

export function useCurrencyConverter() {
  const { data, isLoading, isError } = useExchangeRates();
  const [amount, setAmount] = useState<string>('0');
  const [toCurrency, setToCurrency] = useState<CurrencyOption | null>(null);

  const currencyOptions: CurrencyOption[] = useMemo(() => {
    return data
      ? data.map(item => ({
        code: item.code,
        name: item.currency,
        flag: ''
      }))
      : [];
  }, [data]);

  const convertedAmount = useMemo(() => {
    if (!data || !toCurrency || amount.trim() === '') {
      return { integerPart: '0', decimalPart: '00' };
    }

    const targetRate = data.find(item => item.code === toCurrency.code);
    if (!targetRate) {
      return { integerPart: '0', decimalPart: '00' };
    }

    const numAmount = parseFloat(amount.replace(',', '.'));
    const result = (numAmount / targetRate.rate) * targetRate.amount;
    const [integerPart, decimalPart] = result.toFixed(2).split('.');

    return { integerPart, decimalPart };
  }, [amount, data, toCurrency]);

  const filterOptions = () => currencyOptions.filter(option => option.code !== 'CZK');

  return {
    data,
    isLoading,
    isError,
    amount,
    setAmount,
    toCurrency,
    setToCurrency,
    currencyOptions,
    filterOptions,
    convertedAmount
  };
}
