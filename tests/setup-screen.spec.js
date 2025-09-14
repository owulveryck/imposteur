import { test, expect } from '@playwright/test';

test.describe('Setup Screen Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correct initial setup', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Imposter Word Game');
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.locator('#setup-screen')).toHaveClass(/active/);
    await expect(page.locator('#setup-screen h2')).toContainText('Game Setup');
  });

  test('should have correct initial player count', async ({ page }) => {
    await expect(page.locator('#player-count-display')).toContainText('4');
    await expect(page.locator('.player-input')).toHaveCount(4);
  });

  test('should increase player count correctly', async ({ page }) => {
    await page.click('#increase-players');
    await expect(page.locator('#player-count-display')).toContainText('5');
    await expect(page.locator('.player-input')).toHaveCount(5);

    // Test maximum limit (12 players)
    for (let i = 5; i < 12; i++) {
      await page.click('#increase-players');
    }
    await expect(page.locator('#player-count-display')).toContainText('12');

    // Should not go beyond 12
    await page.click('#increase-players');
    await expect(page.locator('#player-count-display')).toContainText('12');
  });

  test('should decrease player count correctly', async ({ page }) => {
    await page.click('#decrease-players');
    await expect(page.locator('#player-count-display')).toContainText('4'); // Should stay at minimum

    // Set to higher count first
    await page.click('#increase-players');
    await page.click('#increase-players');
    await expect(page.locator('#player-count-display')).toContainText('6');

    // Now decrease
    await page.click('#decrease-players');
    await expect(page.locator('#player-count-display')).toContainText('5');
    await expect(page.locator('.player-input')).toHaveCount(5);
  });

  test('should disable start button when player names are empty', async ({ page }) => {
    await expect(page.locator('#start-game-btn')).toBeDisabled();
  });

  test('should enable start button when all player names are filled', async ({ page }) => {
    const playerInputs = page.locator('.player-input');

    // Fill all but one
    await playerInputs.nth(0).fill('Alice');
    await playerInputs.nth(1).fill('Bob');
    await playerInputs.nth(2).fill('Charlie');
    await expect(page.locator('#start-game-btn')).toBeDisabled();

    // Fill the last one
    await playerInputs.nth(3).fill('Diana');
    await expect(page.locator('#start-game-btn')).toBeEnabled();
  });

  test('should disable start button if any name is cleared', async ({ page }) => {
    const playerInputs = page.locator('.player-input');

    // Fill all names
    await playerInputs.nth(0).fill('Alice');
    await playerInputs.nth(1).fill('Bob');
    await playerInputs.nth(2).fill('Charlie');
    await playerInputs.nth(3).fill('Diana');
    await expect(page.locator('#start-game-btn')).toBeEnabled();

    // Clear one name
    await playerInputs.nth(1).clear();
    await expect(page.locator('#start-game-btn')).toBeDisabled();
  });

  test('should handle player name input validation', async ({ page }) => {
    const playerInputs = page.locator('.player-input');

    // Test empty spaces don't count as valid names
    await playerInputs.nth(0).fill('   ');
    await playerInputs.nth(1).fill('Bob');
    await playerInputs.nth(2).fill('Charlie');
    await playerInputs.nth(3).fill('Diana');
    await expect(page.locator('#start-game-btn')).toBeDisabled();

    // Fix the empty name
    await playerInputs.nth(0).fill('Alice');
    await expect(page.locator('#start-game-btn')).toBeEnabled();
  });

  test('should respect maximum length for player names', async ({ page }) => {
    const playerInput = page.locator('.player-input').first();

    // Should have maxLength attribute
    await expect(playerInput).toHaveAttribute('maxLength', '20');

    // Try typing a very long name
    const longName = 'ThisIsAVeryLongNameThatExceedsTwentyCharacters';
    await playerInput.fill(longName);

    // Should be truncated to 20 characters
    const actualValue = await playerInput.inputValue();
    expect(actualValue.length).toBeLessThanOrEqual(20);
  });

  test('should navigate to category screen on start game', async ({ page }) => {
    // Fill all player names
    const playerInputs = page.locator('.player-input');
    await playerInputs.nth(0).fill('Alice');
    await playerInputs.nth(1).fill('Bob');
    await playerInputs.nth(2).fill('Charlie');
    await playerInputs.nth(3).fill('Diana');

    await page.click('#start-game-btn');

    // Should navigate to category screen
    await expect(page.locator('#setup-screen')).not.toHaveClass(/active/);
    await expect(page.locator('#category-screen')).toHaveClass(/active/);
  });
});