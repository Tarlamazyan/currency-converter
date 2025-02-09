import { test, expect } from '@playwright/test';

test.describe('SelectCurrency Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render SelectCurrency correctly', async ({ page }) => {
    const combobox = page.locator('[data-testid="combobox-container"]').first();
    await expect(combobox).toBeVisible();
  });

  test('should open dropdown when clicked', async ({ page }) => {
    const input = page.locator('[data-testid="combobox-input"]').first();
    await input.click();
    const listbox = page.locator('[data-testid="combobox-listbox"]');
    await expect(listbox).toBeVisible();
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    const input = page.locator('[data-testid="combobox-input"]').first();
    await input.click();
    await page.mouse.click(0, 0);
    const listbox = page.locator('[data-testid="combobox-listbox"]');
    await expect(listbox).not.toBeVisible();
  });

  test('should support keyboard navigation (ArrowDown + Enter)', async ({ page }) => {
    const input = page.locator('[data-testid="combobox-input"]').first();
    await input.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(input).not.toBeEmpty();
  });
});
