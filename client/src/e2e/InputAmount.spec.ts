import { test, expect } from '@playwright/test';

test.describe('InputAmount Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render InputAmount correctly', async ({ page }) => {
    const input = page.getByTestId('input-amount-field');
    await expect(input).toBeVisible();
  });

  test('should allow entering numbers', async ({ page }) => {
    const input = page.getByTestId('input-amount-field');
    await input.fill('1234');
    await expect(input).toHaveValue('1234');
  });

  test('should have correct accessibility attributes', async ({ page }) => {
    const input = page.getByTestId('input-amount-field');
    await expect(input).toHaveAttribute('aria-describedby');
  });
});
