import { GridItem } from './design-system/layout/grid/components';
import { Grid, InputAmount } from './design-system';
import { useState } from 'react';

function App() {
  const [amount, setAmount] = useState('100');

  return (
    <>
      <Grid columns={{ xs: 4, sm: 6, lg: 12 }}>
        <GridItem span={{ xs: 4, sm: 6, lg: 6 }}>
          <InputAmount
            value={amount}
            onChange={setAmount}
            currency="$"
            label="Enter amount"
            onEnterPress={() => console.log('Enter pressed!')}
          />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
