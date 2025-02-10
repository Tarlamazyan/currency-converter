import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CurrencyTable } from '../CurrencyTable';

interface TestData extends Record<string, unknown> {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

const mockData: TestData[] = [
  { country: 'USA', currency: 'Dollar', amount: 1, code: 'USD', rate: 1.0 },
  { country: 'Eurozone', currency: 'Euro', amount: 1, code: 'EUR', rate: 0.85 },
  { country: 'Japan', currency: 'Yen', amount: 100, code: 'JPY', rate: 110.5 }
];

describe('CurrencyTable Component', (): void => {
  let handleSort: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handleSort = vi.fn();
  });

  it('renders correctly with data', (): void => {
    render(<CurrencyTable data={mockData} />);

    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1);
  });

  it('renders loading state', (): void => {
    render(<CurrencyTable data={[]} isLoading={true} />);

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders error state', (): void => {
    render(<CurrencyTable data={[]} error={new Error('Fetch error')} />);

    expect(screen.getByText('Error: Fetch error')).toBeInTheDocument();
  });

  it('renders no data state', (): void => {
    render(<CurrencyTable data={[]} />);

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders correct column headers dynamically', () => {
    render(<CurrencyTable data={mockData} />);

    const headers = ['country', 'currency', 'amount', 'code', 'rate'];
    headers.forEach((header): void => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('calls onSort when clicking sortable header', async (): Promise<void> => {
    render(<CurrencyTable data={mockData} onSort={handleSort} sortColumn="country" sortDirection="asc" />);

    const countryHeader = screen.getByRole('columnheader', { name: /country/i });
    fireEvent.click(countryHeader);

    await waitFor(() => expect(handleSort).toHaveBeenCalledWith('country'));
  });

  it('sets correct ARIA attributes for sortable columns', (): void => {
    render(<CurrencyTable data={mockData} onSort={handleSort} sortColumn="country" sortDirection="asc" />);

    const countryHeader = screen.getByRole('columnheader', { name: /country/i });
    expect(countryHeader).toHaveAttribute('aria-sort', 'ascending');

    const rateHeader = screen.getByRole('columnheader', { name: /rate/i });
    expect(rateHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('keeps header fixed while scrolling', async (): Promise<void> => {
    render(<CurrencyTable data={mockData} />);

    const tableHead = screen.getByRole('rowgroup', { name: /table head/i });
    expect(tableHead).toHaveStyle('position: sticky');
  });
});
