import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SelectCurrency } from '../SelectCurrency';

const mockOptions = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' }
];

describe('SelectCurrency Component', (): void => {
  let handleChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handleChange = vi.fn();
  });

  it('renders correctly with initial value', (): void => {
    render(<SelectCurrency value={mockOptions[0]} onChange={handleChange} options={mockOptions} id="currency-select" />);

    expect(screen.getByTestId('combobox-container')).toBeInTheDocument();
    expect(screen.getByTestId('combobox-input')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByDisplayValue('USD - US Dollar')).toBeInTheDocument();
  });

  it('opens dropdown when input is clicked', async (): Promise<void> => {
    render(<SelectCurrency value={mockOptions[0]} onChange={handleChange} options={mockOptions} id="currency-select" />);

    fireEvent.click(screen.getByTestId('combobox-input'));

    await waitFor(() => expect(screen.getByTestId('combobox-listbox')).toBeInTheDocument());
  });

  it('filters options based on input', async (): Promise<void> => {
    render(<SelectCurrency value={mockOptions[0]} onChange={handleChange} options={mockOptions} id="currency-select" />);

    fireEvent.change(screen.getByTestId('combobox-input'), { target: { value: 'EUR' } });

    await waitFor(() => {
      expect(screen.getByText('EUR - Euro')).toBeInTheDocument();
      expect(screen.queryByText('USD - US Dollar')).not.toBeInTheDocument();
    });
  });

  it('selects an option and calls onChange', async (): Promise<void> => {
    render(<SelectCurrency value={mockOptions[0]} onChange={handleChange} options={mockOptions} id="currency-select" />);

    fireEvent.click(screen.getByTestId('combobox-input'));
    fireEvent.click(screen.getByText('EUR - Euro'));

    await waitFor(() => expect(handleChange).toHaveBeenCalledWith(mockOptions[1]));
  });

  it('closes dropdown when an option is selected', async (): Promise<void> => {
    render(<SelectCurrency value={mockOptions[0]} onChange={handleChange} options={mockOptions} id="currency-select" />);

    fireEvent.click(screen.getByTestId('combobox-input'));
    fireEvent.click(screen.getByText('EUR - Euro'));

    await waitFor(() => expect(screen.queryByTestId('combobox-listbox')).not.toBeInTheDocument());
  });

  it('closes dropdown when clicking outside', async (): Promise<void> => {
    render(<SelectCurrency value={mockOptions[0]} onChange={handleChange} options={mockOptions} id="currency-select" />);

    fireEvent.click(screen.getByTestId('combobox-input'));
    fireEvent.mouseDown(document.body);

    await waitFor(() => expect(screen.queryByTestId('combobox-listbox')).not.toBeInTheDocument());
  });

  it('disables an option if disabledOption is set', async (): Promise<void> => {
    render(
      <SelectCurrency value={mockOptions[0]} onChange={handleChange} options={mockOptions} id="currency-select" disabledOption="EUR" />
    );

    fireEvent.click(screen.getByTestId('combobox-input'));

    const disabledOption = screen.getByText('EUR - Euro');
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(disabledOption);
    await waitFor(() => expect(handleChange).not.toHaveBeenCalled());
  });

  it('shows placeholder when no value is selected', (): void => {
    render(<SelectCurrency value={{ code: '', name: '', flag: '' }} onChange={handleChange} options={mockOptions} id="currency-select" />);

    expect(screen.getByPlaceholderText('Search currency...')).toBeInTheDocument();
  });

  it('shows question mark when no flag is available', (): void => {
    render(<SelectCurrency value={{ code: '', name: '', flag: '' }} onChange={handleChange} options={mockOptions} id="currency-select" />);

    expect(screen.getByText('❓')).toBeInTheDocument();
  });
});
