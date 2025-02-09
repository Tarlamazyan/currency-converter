import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputAmount } from '../InputAmount';

describe('InputAmount Component', (): void => {
  it('renders correctly', (): void => {
    render(<InputAmount value="100" onChange={() => {}} currency="$" id="amount" />);

    expect(screen.getByTestId('input-amount-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('input-amount-field')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('displays label when provided', (): void => {
    render(<InputAmount value="100" onChange={() => {}} currency="$" id="amount" label="Amount" />);

    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  it('updates value on change', (): void => {
    const handleChange = vi.fn();
    render(<InputAmount value="100" onChange={handleChange} currency="$" id="amount" />);

    const input = screen.getByTestId('input-amount-field');
    fireEvent.change(input, { target: { value: '200' } });

    expect(handleChange).toHaveBeenCalledWith('200');
  });

  it('displays error message and sets aria-invalid when error is provided', (): void => {
    render(<InputAmount value="100" onChange={() => {}} currency="$" id="amount" error="Invalid amount" />);

    expect(screen.getByText('Invalid amount')).toBeInTheDocument();
    expect(screen.getByTestId('input-amount-field')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby correctly', (): void => {
    render(<InputAmount value="100" onChange={(): void => {}} currency="$" id="amount" error="Invalid amount" />);

    const input = screen.getByTestId('input-amount-field');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('amount-error'));
  });

  it('disables input when disabled prop is set', (): void => {
    render(<InputAmount value="100" onChange={(): void => {}} currency="$" id="amount" disabled />);

    expect(screen.getByTestId('input-amount-field')).toBeDisabled();
  });

  it('does not allow values below minValue', (): void => {
    const handleChange = vi.fn();
    render(<InputAmount value="10" onChange={handleChange} currency="$" id="amount" minValue={5} />);

    const input = screen.getByTestId('input-amount-field');
    fireEvent.change(input, { target: { value: '3' } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not allow values above maxValue', (): void => {
    const handleChange = vi.fn();
    render(<InputAmount value="10" onChange={handleChange} currency="$" id="amount" maxValue={20} />);

    const input = screen.getByTestId('input-amount-field');
    fireEvent.change(input, { target: { value: '25' } });

    expect(handleChange).not.toHaveBeenCalled();
  });
});
