import { GridItem } from './design-system/layout/grid/components';
import { Grid, InputAmount, SelectCurrency } from './design-system';
import { useState } from 'react';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

function App() {
  const currencyOptions: CurrencyOption[] = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' }
  ];
  const [amount, setAmount] = useState('100');

  const [fromCurrency, setFromCurrency] = useState<CurrencyOption | null>(currencyOptions[0]);
  const [toCurrency, setToCurrency] = useState<CurrencyOption | null>(currencyOptions[1]);

  const handleCurrencyChange = (setter: (value: CurrencyOption | null) => void, otherCurrency: CurrencyOption | null) =>
    (currency: CurrencyOption | null) => {
      if (currency && currency.code === otherCurrency?.code) {
        setter(null);
      }
      setter(currency);
    };

  const filterOptions = (selectedCurrency: CurrencyOption | null) =>
    currencyOptions.filter(option => option.code !== selectedCurrency?.code);

  return (
    <>
      <Grid columns={{ xs: 4, sm: 6, lg: 12 }}>
        <GridItem span={{ xs: 4, sm: 6, lg: 6 }}>
          <InputAmount
            value={amount}
            onChange={setAmount}
            currency="$"
            label="Enter amount"
          />
          <SelectCurrency
            id="from-currency-select"
            value={fromCurrency || { code: '', name: '', flag: '' }}
            onChange={handleCurrencyChange(setFromCurrency, toCurrency)}
            options={filterOptions(toCurrency)}
            label="From"
          />
        </GridItem>
        <GridItem span={{ xs: 4, sm: 6, lg: 6 }}>
          <SelectCurrency
            id="to-currency-select"
            value={toCurrency || { code: '', name: '', flag: '' }}
            onChange={handleCurrencyChange(setToCurrency, fromCurrency)}
            options={filterOptions(fromCurrency)}
            label="To"
          />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
