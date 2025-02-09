import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Grid } from '../Grid';

describe('Grid Component', () => {
  it('renders children correctly', () => {
    render(
      <Grid columns={{ xs: 2 }}>
        <div data-testid="child">Item 1</div>
        <div data-testid="child">Item 2</div>
      </Grid>
    );

    const children = screen.getAllByTestId('child');
    expect(children).toHaveLength(2);
  });

  it('applies grid styles correctly', () => {
    const { container } = render(
      <Grid columns={{ xs: 3 }}>
        <div />
      </Grid>
    );
    expect(container.firstChild).toHaveStyle('display: grid');
  });

  it('applies correct grid-template-columns based on props', () => {
    const { container } = render(
      <Grid columns={{ xs: 3, md: 4 }}>
        <div />
      </Grid>
    );

    expect(container.firstChild).toHaveStyle('grid-template-columns: repeat(3, 1fr)');
  });
});
