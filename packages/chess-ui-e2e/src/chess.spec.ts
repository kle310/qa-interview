import { test, expect } from '@playwright/test';
import { setupBoard } from './helpers';

test('a piece is visible', async ({ page }) => {
  await setupBoard(page, '8/8/8/3P4/8/8/8/8 w - - 0 1');
  const divWhite = page.locator("div[data-square='d5']");
  await expect(divWhite).toBeVisible();
});
