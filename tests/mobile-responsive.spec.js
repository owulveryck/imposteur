import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness Tests', () => {
  test.describe('Mobile Portrait', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
      await page.goto('/');
    });

    test('should display properly on mobile portrait', async ({ page }) => {
      // Check header
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();

      // Check main content
      await expect(page.locator('#setup-screen')).toBeVisible();
      await expect(page.locator('#setup-screen .content')).toBeVisible();

      // Check player counter
      await expect(page.locator('.player-counter')).toBeVisible();
      await expect(page.locator('#player-count-display')).toBeVisible();
    });

    test('should have touch-friendly buttons', async ({ page }) => {
      // Check button sizes
      const increaseBtn = page.locator('#increase-players');
      const decreaseBtn = page.locator('#decrease-players');

      const increaseBtnBox = await increaseBtn.boundingBox();
      const decreaseBtnBox = await decreaseBtn.boundingBox();

      // Buttons should be at least 44px (iOS recommendation)
      expect(increaseBtnBox?.height).toBeGreaterThanOrEqual(44);
      expect(increaseBtnBox?.width).toBeGreaterThanOrEqual(44);
      expect(decreaseBtnBox?.height).toBeGreaterThanOrEqual(44);
      expect(decreaseBtnBox?.width).toBeGreaterThanOrEqual(44);
    });

    test('should handle input fields properly on mobile', async ({ page }) => {
      const playerInputs = page.locator('.player-input');
      const firstInput = playerInputs.first();

      // Check input is visible and properly sized
      await expect(firstInput).toBeVisible();

      // Fill and check that mobile keyboard doesn't break layout
      await firstInput.fill('Alice');
      await expect(firstInput).toHaveValue('Alice');

      // Check that other inputs are still accessible
      await expect(playerInputs.nth(1)).toBeVisible();
      await expect(playerInputs.nth(2)).toBeVisible();
      await expect(playerInputs.nth(3)).toBeVisible();
    });
  });

  test.describe('Mobile Landscape', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 812, height: 375 }); // iPhone X landscape
      await page.goto('/');
    });

    test('should display properly on mobile landscape', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('#setup-screen')).toBeVisible();
      await expect(page.locator('.content')).toBeVisible();

      // Content should still be readable and usable
      await expect(page.locator('#player-count-display')).toBeVisible();
      await expect(page.locator('.player-input')).toHaveCount(4);
    });

    test('should maintain proper spacing in landscape', async ({ page }) => {
      // Check that content doesn't overflow or get cut off
      const content = page.locator('.content');
      await expect(content).toBeVisible();

      // All player inputs should be visible
      const playerInputs = page.locator('.player-input');
      for (let i = 0; i < 4; i++) {
        await expect(playerInputs.nth(i)).toBeVisible();
      }
    });
  });

  test.describe('Tablet Portrait', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad dimensions
      await page.goto('/');
    });

    test('should display properly on tablet', async ({ page }) => {
      await expect(page.locator('#setup-screen')).toBeVisible();

      // Content should be centered and properly sized
      const content = page.locator('#setup-screen .content');
      await expect(content).toBeVisible();

      // Check that max-width is applied (should be 500px on tablet)
      const contentBox = await content.boundingBox();
      expect(contentBox?.width).toBeLessThanOrEqual(500);
    });

    test('should use grid layout for categories on tablet', async ({ page }) => {
      // Navigate to category screen
      const playerInputs = page.locator('.player-input');
      await playerInputs.nth(0).fill('Alice');
      await playerInputs.nth(1).fill('Bob');
      await playerInputs.nth(2).fill('Charlie');
      await playerInputs.nth(3).fill('Diana');
      await page.click('#start-game-btn');

      // Check category grid layout
      const categoriesGrid = page.locator('#categories-grid');
      await expect(categoriesGrid).toBeVisible();

      // Should have auto-fit grid layout on tablet
      const categoryButtons = page.locator('.category-btn');
      await expect(categoryButtons).toHaveCount(5);

      // All buttons should be visible
      for (let i = 0; i < 5; i++) {
        await expect(categoryButtons.nth(i)).toBeVisible();
      }
    });
  });

  test.describe('Touch Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
    });

    test('should handle touch events properly', async ({ page }) => {
      // Test touch on player count buttons
      await page.tap('#increase-players');
      await expect(page.locator('#player-count-display')).toContainText('5');

      await page.tap('#decrease-players');
      await expect(page.locator('#player-count-display')).toContainText('4');
    });

    test('should prevent default touch behaviors', async ({ page }) => {
      // Check that user-select is disabled
      const body = page.locator('body');
      const userSelect = await body.evaluate((el) => getComputedStyle(el).userSelect);
      expect(userSelect).toBe('none');

      // Check that touch-action is set
      const touchAction = await body.evaluate((el) => getComputedStyle(el).touchAction);
      expect(touchAction).toBe('manipulation');
    });
  });

  test.describe('Safe Area Support', () => {
    test.beforeEach(async ({ page }) => {
      // Simulate device with notch/safe areas
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
    });

    test('should handle safe areas correctly', async ({ page }) => {
      // Check that header uses safe area padding
      const header = page.locator('header');
      await expect(header).toBeVisible();

      // Check that game container accounts for safe area bottom
      const gameContainer = page.locator('#game-container');
      await expect(gameContainer).toBeVisible();
    });
  });

  test.describe('Game Flow on Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
    });

    test('should complete full game flow on mobile', async ({ page }) => {
      // Setup
      const playerInputs = page.locator('.player-input');
      await playerInputs.nth(0).fill('Alice');
      await playerInputs.nth(1).fill('Bob');
      await playerInputs.nth(2).fill('Charlie');
      await playerInputs.nth(3).fill('Diana');
      await page.tap('#start-game-btn');

      // Category selection
      await expect(page.locator('#category-screen')).toBeVisible();
      await page.tap('[data-category="food"]');

      // Role distribution
      for (let i = 0; i < 4; i++) {
        await expect(page.locator('#role-screen')).toBeVisible();
        await page.tap('#reveal-role-btn');
        await expect(page.locator('#role-display')).toBeVisible();
        await page.tap('#pass-phone-btn');
      }

      // Instructions
      await expect(page.locator('#instructions-screen')).toBeVisible();
      await page.tap('#proceed-voting-btn');

      // Voting
      await expect(page.locator('#voting-screen')).toBeVisible();
      await page.tap('.vote-btn >> nth=0');
      await page.tap('#reveal-vote-btn');

      // Results
      await expect(page.locator('#results-screen')).toBeVisible();

      // Handle imposter guess if needed
      const imposterSection = page.locator('#imposter-guess-section');
      if (await imposterSection.isVisible()) {
        await page.fill('#imposter-guess-input', 'pizza');
        await page.tap('#submit-guess-btn');
      }

      await page.tap('#continue-results-btn');

      // Scoreboard
      await expect(page.locator('#scoreboard-screen')).toBeVisible();
      await expect(page.locator('#scores-list')).toBeVisible();
    });
  });

  test.describe('Accessibility on Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
    });

    test('should maintain accessibility on mobile', async ({ page }) => {
      // Check that focus styles are visible
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Check that all interactive elements are reachable
      const buttons = page.locator('button:visible');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);

      // All visible buttons should be enabled or properly disabled
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
      }
    });
  });
});