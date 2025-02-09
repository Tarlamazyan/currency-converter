import { GridItem } from './design-system/layout/grid/components';
import { Grid } from './design-system';

function App() {
  return (
    <>
      <Grid columns={{ xs: 1, sm: 2, md: 4, lg: 6, xl: 12 }}>
        <GridItem span={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}>
          Item 1
        </GridItem>

        <GridItem span={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}>
          Item 2
        </GridItem>

        <GridItem span={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }} start={{ sm: 2, md: 3, lg: 4 }}>
          Item 3
        </GridItem>

        <GridItem span={{ xs: 1, sm: 3, md: 3, lg: 3, xl: 3 }}>
          Item 4
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
