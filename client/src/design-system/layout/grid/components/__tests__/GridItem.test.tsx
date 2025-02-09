import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GridItem } from '../GridItem';

describe('GridItem Component', () => {
  it('renders children correctly', () => {
    const { getByTestId } = render(
      <GridItem>
        <div data-testid="child">Item</div>
      </GridItem>
    );

    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('applies correct grid-column span style', () => {
    const { container } = render(<GridItem span={{ xs: 2 }} />);
    expect(container.firstChild).toHaveStyle('grid-column: span 2');
  });

  it('applies correct grid-column start and end styles', () => {
    const { container } = render(
      <GridItem start={{ xs: 1 }} end={{ xs: 3 }} />
    );

    expect(container.firstChild).toHaveStyle('grid-column-start: 1');
    expect(container.firstChild).toHaveStyle('grid-column-end: 3');
  });
});
