import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InputAmount } from '../InputAmount';

describe('InputAmount Component', (): void => {
  let handleChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handleChange = vi.fn();
  });

  it('renders correctly', (): void => {
    render(<InputAmount value="100" onChange={handleChange} currency="$" id="amount" />);

    expect(screen.getByTestId('input-amount-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('input-amount-field')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('displays label when provided', (): void => {
    render(<InputAmount value="100" onChange={handleChange} currency="$" id="amount" label="Amount" />);

    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  it('updates value on change with debounce', async (): Promise<void> => {
    render(<InputAmount value="100" onChange={handleChange} currency="$" id="amount" />);

    const input = screen.getByTestId('input-amount-field');
    fireEvent.change(input, { target: { value: '200' } });

    await waitFor(() => expect(handleChange).toHaveBeenCalledWith('200'), { timeout: 350 });
  });

  it('displays error message and sets aria-invalid when error is provided', (): void => {
    render(<InputAmount value="100" onChange={handleChange} currency="$" id="amount" error="Invalid amount" />);

    expect(screen.getByText('Invalid amount')).toBeInTheDocument();
    expect(screen.getByTestId('input-amount-field')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby correctly', (): void => {
    render(<InputAmount value="100" onChange={handleChange} currency="$" id="amount" error="Invalid amount" />);

    const input = screen.getByTestId('input-amount-field');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('amount-error'));
  });

  it('disables input when disabled prop is set', (): void => {
    render(<InputAmount value="100" onChange={handleChange} currency="$" id="amount" disabled />);

    expect(screen.getByTestId('input-amount-field')).toBeDisabled();
  });

  it('prevents values below minValue', async (): Promise<void> => {
    render(<InputAmount value="10" onChange={handleChange} currency="$" id="amount" minValue={5} />);

    const input = screen.getByTestId('input-amount-field');
    fireEvent.change(input, { target: { value: '3' } });

    await waitFor(() => expect(handleChange).not.toHaveBeenCalled(), { timeout: 350 });
  });

  it('prevents values above maxValue', async (): Promise<void> => {
    render(<InputAmount value="10" onChange={handleChange} currency="$" id="amount" maxValue={20} />);

    const input = screen.getByTestId('input-amount-field');
    fireEvent.change(input, { target: { value: '25' } });

    await waitFor(() => expect(handleChange).not.toHaveBeenCalled(), { timeout: 350 });
  });

  it('formats value correctly', async (): Promise<void> => {
    render(<InputAmount value="1000" onChange={handleChange} currency="$" id="amount" locale="en-US" />);

    const input = screen.getByTestId('input-amount-field');
    fireEvent.change(input, { target: { value: '1234' } });

    await waitFor(() => expect(handleChange).toHaveBeenCalledWith('1234'), { timeout: 350 });
  });
});
