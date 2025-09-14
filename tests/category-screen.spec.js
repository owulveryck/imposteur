import { test, expect } from '@playwright/test';

test.describe('Category Selection Screen Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Setup game first
    const playerInputs = page.locator('.player-input');
    await playerInputs.nth(0).fill('Alice');
    await playerInputs.nth(1).fill('Bob');
    await playerInputs.nth(2).fill('Charlie');
    await playerInputs.nth(3).fill('Diana');
    await page.click('#start-game-btn');
  });

  test('should display category selection screen', async ({ page }) => {
    await expect(page.locator('#category-screen')).toBeVisible();
    await expect(page.locator('#category-screen')).toHaveClass(/active/);
    await expect(page.locator('h2')).toContainText('Choose a Category');
  });

  test('should display all required categories', async ({ page }) => {
    const categories = [
      { selector: '[data-category="food"]', text: 'Food' },
      { selector: '[data-category="animals"]', text: 'Animals' },
      { selector: '[data-category="household"]', text: 'Household Items' },
      { selector: '[data-category="movies"]', text: 'Movies' },
      { selector: '[data-category="travel"]', text: 'Travel' }
    ];

    for (const category of categories) {
      await expect(page.locator(category.selector)).toBeVisible();
      await expect(page.locator(category.selector)).toContainText(category.text);
    }
  });

  test('should navigate to role distribution when category is selected', async ({ page }) => {
    await page.click('[data-category="food"]');

    // Should navigate to role screen
    await expect(page.locator('#category-screen')).not.toHaveClass(/active/);
    await expect(page.locator('#role-screen')).toHaveClass(/active/);
  });

  test('should work with all categories', async ({ page }) => {
    const categories = ['food', 'animals', 'household', 'movies', 'travel'];

    for (const category of categories) {
      // Reset to category screen if needed
      if (await page.locator('#role-screen').isVisible()) {
        await page.goto('/');
        const playerInputs = page.locator('.player-input');
        await playerInputs.nth(0).fill('Alice');
        await playerInputs.nth(1).fill('Bob');
        await playerInputs.nth(2).fill('Charlie');
        await playerInputs.nth(3).fill('Diana');
        await page.click('#start-game-btn');
      }

      await page.click(`[data-category="${category}"]`);
      await expect(page.locator('#role-screen')).toHaveClass(/active/);

      // Go back for next iteration
      if (category !== 'travel') {
        await page.goto('/');
        const playerInputs = page.locator('.player-input');
        await playerInputs.nth(0).fill('Alice');
        await playerInputs.nth(1).fill('Bob');
        await playerInputs.nth(2).fill('Charlie');
        await playerInputs.nth(3).fill('Diana');
        await page.click('#start-game-btn');
      }
    }
  });

  test('should have accessible category buttons', async ({ page }) => {
    const categoryButtons = page.locator('.category-btn');
    const count = await categoryButtons.count();

    expect(count).toBe(5);

    // Check each button is clickable
    for (let i = 0; i < count; i++) {
      await expect(categoryButtons.nth(i)).toBeEnabled();
      await expect(categoryButtons.nth(i)).toBeVisible();
    }
  });
});