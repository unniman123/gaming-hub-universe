import { test, expect } from '@playwright/test';

test('user can view and join tournaments', async ({ page }) => {
  await page.goto('/tournaments');
  
  // Check if tournaments page loads
  await expect(page.getByText('Tournaments')).toBeVisible();
  
  // Check if tournament cards are visible
  await expect(page.locator('.tournament-card')).toBeVisible();
  
  // Test join tournament functionality
  const joinButton = page.getByText('Join Tournament').first();
  if (await joinButton.isVisible()) {
    await joinButton.click();
    // Verify success message
    await expect(page.getByText('successfully joined')).toBeVisible();
  }
});