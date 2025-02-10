import { GridItem } from '../../design-system/layout/grid/components';
import { Grid, InputAmount, SelectCurrency, CurrencyTable } from '../../design-system';
import { useCurrencyConverter } from './hooks';
import { ExchangeResultDisplay } from './ExchangeResultDisplay';

export function CurrencyConverter() {
  const {
    data,
    isLoading,
    isError,
    amount,
    setAmount,
    toCurrency,
    setToCurrency,
    filterOptions,
    convertedAmount
  } = useCurrencyConverter();

  if (isLoading) {
    return (
      <Grid columns={{ xs: 4, sm: 6, lg: 12 }}>
        <GridItem span={{ xs: 4, sm: 4, lg: 12 }}>Loading exchange rates...</GridItem>
      </Grid>
    );
  }

  if (isError) {
    return (
      <Grid columns={{ xs: 4, sm: 6, lg: 12 }}>
        <GridItem span={{ xs: 4, sm: 4, lg: 12 }}>Error loading exchange rates. Please try again later.</GridItem>
      </Grid>
    );
  }

  const formattedData = (data ?? []).map(item => ({
    country: item.country,
    currency: item.currency,
    amount: item.amount,
    code: item.code,
    rate: item.rate
  }));

  return (
    <Grid columns={{ xs: 4, sm: 6, lg: 12 }}>
      <GridItem span={{ xs: 2, sm: 2, lg: 4 }} start={{ sm: 2, lg: 3 }} end={{ sm: 4, lg: 7 }}>
        <SelectCurrency
          id="from-currency-select"
          value={{ code: 'CZK', name: 'Czech Koruna', flag: '' }}
          onChange={() => {}}
          options={[{ code: 'CZK', name: 'Czech Koruna', flag: '' }]}
          disabledOption="CZK"
          label="From"
        />
      </GridItem>

      <GridItem span={{ xs: 2, sm: 2, lg: 4 }} start={{ sm: 4, lg: 7 }} end={{ sm: 6, lg: 11 }}>
        <SelectCurrency
          id="to-currency-select"
          value={toCurrency || { code: '', name: '', flag: '' }}
          onChange={setToCurrency}
          options={filterOptions()}
          label="To"
        />
      </GridItem>

      <GridItem span={{ xs: 4, sm: 4, lg: 6 }} start={{ sm: 2, lg: 3 }} end={{ sm: 6, lg: 11 }}>
        <InputAmount value={amount} onChange={setAmount} currency="CZK" label="Enter amount" />
      </GridItem>

      <GridItem span={{ xs: 4, sm: 4, lg: 6 }} start={{ sm: 2, lg: 3 }} end={{ sm: 6, lg: 11 }}>
        <ExchangeResultDisplay
          integerPart={convertedAmount.integerPart}
          decimalPart={convertedAmount.decimalPart}
          currencyCode={toCurrency?.code}
        />
      </GridItem>

      <GridItem span={{ xs: 4, sm: 4, lg: 6 }} start={{ sm: 2, lg: 3 }} end={{ sm: 6, lg: 11 }}>
        {formattedData.length > 0 && <CurrencyTable data={formattedData} />}
      </GridItem>
    </Grid>
  );
}

export default CurrencyConverter;
