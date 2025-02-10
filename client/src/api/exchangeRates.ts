import { API_URLS } from '../constants';

export const fetchExchangeRates = async () => {
  const response = await fetch(API_URLS.EXCHANGE_RATES);

  if (!response.ok) throw new Error('Failed to fetch exchange rates');

  return await response.json();
};
