import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchExchangeRates } from '../../api';

interface ExchangeRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

export const useExchangeRates = (options?: UseQueryOptions<ExchangeRate[]>) => {
  return useQuery<ExchangeRate[]>({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 60,
    ...options
  });
};
