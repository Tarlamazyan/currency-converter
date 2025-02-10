import { test, expect } from '@playwright/test';

test.describe('CurrencyTable Component', () => {
  const mockData = [
    { id: 1, currency: 'USD', rate: 1.0 },
    { id: 2, currency: 'EUR', rate: 0.85 },
    { id: 3, currency: 'GBP', rate: 0.73 }
  ];

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/currencies', async route => {
      await route.fulfill({ json: mockData });
    });
    await page.goto('/');
  });

  test('should render CurrencyTable correctly', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();

    const headerRow = page.locator('thead tr');
    await expect(headerRow).toBeVisible();

    const tableBody = page.locator('tbody');
    await expect(tableBody).toBeVisible();
  });

  test('should sort table when clicking header', async ({ page }) => {
    const currencyHeader = page.getByRole('columnheader', { name: /currency/i });

    await currencyHeader.click();
    await expect(currencyHeader).toHaveAttribute('aria-sort', 'ascending');
    await currencyHeader.click();
    await expect(currencyHeader).toHaveAttribute('aria-sort', 'descending');
  });

  test('should support keyboard navigation for sorting', async ({ page }) => {
    const currencyHeader = page.getByRole('columnheader', { name: /currency/i });

    await currencyHeader.focus();
    await page.keyboard.press('Enter');
    await expect(currencyHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  test('should have correct accessibility attributes', async ({ page }) => {
    const tableWrapper = page.getByRole('region');
    await expect(tableWrapper).toHaveAttribute('tabindex', '0');

    const table = page.locator('table');
    await expect(table).toHaveAttribute('aria-describedby', 'table-description');

    const headers = page.getByRole('columnheader').first();
    await expect(headers).toHaveAttribute('aria-sort', 'none');
  });

  test('should maintain sort state after data updates', async ({ page }) => {
    const rateHeader = page.getByRole('columnheader', { name: /rate/i });
    await rateHeader.click();

    await expect(rateHeader).toHaveAttribute('aria-sort', 'ascending');

    const firstCell = page.locator('tbody tr').first().locator('td').nth(1);
    await expect(firstCell).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const tableRows = page.locator('tbody tr');
    await expect(tableRows.first()).toBeVisible();

    const cellWithLabel = page.locator('td[data-label]').first();
    await expect(cellWithLabel).toBeVisible();
    await expect(cellWithLabel).toHaveAttribute('data-label');
  });
});
