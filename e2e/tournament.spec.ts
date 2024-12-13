import { test, expect } from '@playwright/test';

test.describe('Tournament System', () => {
  test('user can view tournaments list', async ({ page }) => {
    await page.goto('/tournaments');
    await expect(page.getByText('Tournaments')).toBeVisible();
    await expect(page.locator('.tournament-card')).toBeVisible();
  });

  test('user can join tournament', async ({ page }) => {
    await page.goto('/tournaments');
    const joinButton = page.getByText('Join Tournament').first();
    if (await joinButton.isVisible()) {
      await joinButton.click();
      await expect(page.getByText('successfully joined')).toBeVisible();
    }
  });

  test('tournament details page shows correct information', async ({ page }) => {
    await page.goto('/tournaments');
    await page.locator('.tournament-card').first().click();
    await expect(page.getByText('Tournament Details')).toBeVisible();
    await expect(page.getByText('Prize Pool:')).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
  });
});