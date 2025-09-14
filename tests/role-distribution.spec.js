import { test, expect } from '@playwright/test';

test.describe('Role Distribution Screen Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Setup game and select category
    const playerInputs = page.locator('.player-input');
    await playerInputs.nth(0).fill('Alice');
    await playerInputs.nth(1).fill('Bob');
    await playerInputs.nth(2).fill('Charlie');
    await playerInputs.nth(3).fill('Diana');
    await page.click('#start-game-btn');
    await page.click('[data-category="food"]');
  });

  test('should display role distribution screen for first player', async ({ page }) => {
    await expect(page.locator('#role-screen')).toBeVisible();
    await expect(page.locator('#role-screen')).toHaveClass(/active/);
    await expect(page.locator('#current-player-name')).toContainText("Alice, it's your turn.");
    await expect(page.locator('#reveal-role-btn')).toBeVisible();
    await expect(page.locator('#role-display')).toHaveClass(/hidden/);
  });

  test('should reveal role when button is clicked', async ({ page }) => {
    await page.click('#reveal-role-btn');

    await expect(page.locator('#reveal-role-btn')).toHaveClass(/hidden/);
    await expect(page.locator('#role-display')).not.toHaveClass(/hidden/);
    await expect(page.locator('#role-content')).toBeVisible();
    await expect(page.locator('#pass-phone-btn')).toBeVisible();
  });

  test('should show correct role information', async ({ page }) => {
    await page.click('#reveal-role-btn');

    const roleContent = page.locator('#role-content');
    await expect(roleContent).toBeVisible();

    // Should show either imposter or crew role
    const isImposter = await roleContent.locator('.imposter-role').count() > 0;
    const isCrew = await roleContent.locator('.secret-word').count() > 0;

    expect(isImposter || isCrew).toBe(true);

    if (isImposter) {
      await expect(roleContent).toContainText('IMPOSTER!');
      await expect(roleContent).toContainText('Category: Food');
      // Imposter should not see the secret word
      await expect(roleContent.locator('.secret-word')).toHaveCount(0);
    } else {
      await expect(roleContent).toContainText('Category: Food');
      await expect(roleContent).toContainText('Secret Word:');
      await expect(roleContent.locator('.secret-word')).toBeVisible();
      // Should NOT mention "crew" to maintain game secrecy
      await expect(roleContent).not.toContainText('Crew');
    }
  });

  test('should progress through all players', async ({ page }) => {
    const players = ['Alice', 'Bob', 'Charlie', 'Diana'];

    for (let i = 0; i < players.length; i++) {
      // Check current player name
      await expect(page.locator('#current-player-name')).toContainText(`${players[i]}, it's your turn.`);

      // Reveal role
      await page.click('#reveal-role-btn');
      await expect(page.locator('#role-display')).toBeVisible();

      // Check button text for last player
      if (i === players.length - 1) {
        await expect(page.locator('#pass-phone-btn')).toContainText('Start the Game!');
      } else {
        await expect(page.locator('#pass-phone-btn')).toContainText('Got It! Pass to the Next Player');
      }

      // Pass to next player or go to instructions
      await page.click('#pass-phone-btn');

      // If not last player, should reset for next player
      if (i < players.length - 1) {
        await expect(page.locator('#reveal-role-btn')).toBeVisible();
        await expect(page.locator('#role-display')).toHaveClass(/hidden/);
      }
    }

    // After all players, should go to instructions screen
    await expect(page.locator('#role-screen')).not.toHaveClass(/active/);
    await expect(page.locator('#instructions-screen')).toHaveClass(/active/);
  });

  test('should assign exactly one imposter among players', async ({ page }) => {
    const players = ['Alice', 'Bob', 'Charlie', 'Diana'];
    let imposterCount = 0;
    let crewCount = 0;

    for (let i = 0; i < players.length; i++) {
      await page.click('#reveal-role-btn');

      const roleContent = page.locator('#role-content');
      const isImposter = await roleContent.locator('.imposter-role').count() > 0;

      if (isImposter) {
        imposterCount++;
      } else {
        crewCount++;
      }

      await page.click('#pass-phone-btn');

      // Reset for next player if not last
      if (i < players.length - 1) {
        await expect(page.locator('#reveal-role-btn')).toBeVisible();
      }
    }

    expect(imposterCount).toBe(1);
    expect(crewCount).toBe(3);
  });

  test('should maintain role consistency across multiple rounds', async ({ page }) => {
    // Complete first round to get to scoreboard
    await completeQuickRound(page);

    // Start next round
    await page.click('#next-round-btn');
    await page.click('[data-category="animals"]'); // Different category

    // Verify roles are reassigned (might be different players)
    let imposterCount = 0;
    const players = ['Alice', 'Bob', 'Charlie', 'Diana'];

    for (let i = 0; i < players.length; i++) {
      await page.click('#reveal-role-btn');

      const roleContent = page.locator('#role-content');
      const isImposter = await roleContent.locator('.imposter-role').count() > 0;

      if (isImposter) {
        imposterCount++;
        // Should show new category
        await expect(roleContent).toContainText('Category: Animals');
      } else {
        await expect(roleContent).toContainText('Category: Animals');
        await expect(roleContent.locator('.secret-word')).toBeVisible();
        // Verify no "crew" mention to maintain secrecy
        await expect(roleContent).not.toContainText('Crew');
      }

      await page.click('#pass-phone-btn');

      if (i < players.length - 1) {
        await expect(page.locator('#reveal-role-btn')).toBeVisible();
      }
    }

    expect(imposterCount).toBe(1);
  });
});

async function completeQuickRound(page) {
  // Complete role distribution
  for (let i = 0; i < 4; i++) {
    await page.click('#reveal-role-btn');
    await page.click('#pass-phone-btn');
  }

  // Skip instructions
  await page.click('#proceed-voting-btn');

  // Vote for first player
  await page.locator('.vote-btn').first().click();
  await page.click('#reveal-vote-btn');

  // Handle imposter guess if needed
  const imposterSection = page.locator('#imposter-guess-section');
  if (await imposterSection.isVisible()) {
    await page.fill('#imposter-guess-input', 'pizza');
    await page.click('#submit-guess-btn');
  }

  await page.click('#continue-results-btn');
}