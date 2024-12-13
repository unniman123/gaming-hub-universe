import { test, expect } from '@playwright/test';

test.describe('Match System', () => {
  test('user can view match details', async ({ page }) => {
    await page.goto('/matches/active');
    await page.locator('.match-card').first().click();
    await expect(page.getByText('Match Details')).toBeVisible();
  });

  test('score submission works correctly', async ({ page }) => {
    await page.goto('/matches/active');
    await page.locator('.match-card').first().click();
    await page.getByLabel('Your Score').fill('5');
    await page.getByText('Submit Score').click();
    await expect(page.getByText('Score submitted successfully')).toBeVisible();
  });

  test('match chat functionality works', async ({ page }) => {
    await page.goto('/matches/active');
    await page.locator('.match-card').first().click();
    await page.getByPlaceholder('Type a message...').fill('Good luck!');
    await page.getByText('Send').click();
    await expect(page.getByText('Good luck!')).toBeVisible();
  });
});