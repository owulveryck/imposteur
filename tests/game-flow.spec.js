import { test, expect } from '@playwright/test';

test.describe('Imposter Word Game - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete game flow with crew winning', async ({ page }) => {
    // Screen 1: Game Setup
    await expect(page.locator('h1')).toContainText('Imposter Word Game');
    await expect(page.locator('#setup-screen')).toBeVisible();

    // Test player count controls
    await expect(page.locator('#player-count-display')).toContainText('4');
    await page.click('#increase-players');
    await expect(page.locator('#player-count-display')).toContainText('5');
    await page.click('#decrease-players');
    await expect(page.locator('#player-count-display')).toContainText('4');

    // Fill player names
    const playerInputs = page.locator('.player-input');
    await playerInputs.nth(0).fill('Alice');
    await playerInputs.nth(1).fill('Bob');
    await playerInputs.nth(2).fill('Charlie');
    await playerInputs.nth(3).fill('Diana');

    // Start button should be enabled after all names are filled
    await expect(page.locator('#start-game-btn')).toBeEnabled();
    await page.click('#start-game-btn');

    // Screen 2: Category Selection
    await expect(page.locator('#category-screen')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Choose a Category');

    // Select Food category
    await page.click('[data-category="food"]');

    // Screen 3: Role Distribution
    await expect(page.locator('#role-screen')).toBeVisible();

    // Go through each player's role reveal
    for (let i = 0; i < 4; i++) {
      await expect(page.locator('#current-player-name')).toContainText("it's your turn");
      await page.click('#reveal-role-btn');

      // Check if role is displayed
      await expect(page.locator('#role-display')).toBeVisible();
      await expect(page.locator('#role-content')).toBeVisible();

      // Pass to next player or start game
      if (i === 3) {
        await expect(page.locator('#pass-phone-btn')).toContainText('Start the Game!');
      }
      await page.click('#pass-phone-btn');
    }

    // Screen 4: Gameplay Instructions
    await expect(page.locator('#instructions-screen')).toBeVisible();
    await expect(page.locator('h2')).toContainText('The Game Begins!');
    await expect(page.locator('#first-player-name')).toContainText('Alice');

    await page.click('#proceed-voting-btn');

    // Screen 5: Voting
    await expect(page.locator('#voting-screen')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Who is the Imposter?');

    // Vote for a player (Alice)
    const voteButtons = page.locator('.vote-btn');
    await voteButtons.first().click();
    await expect(voteButtons.first()).toHaveClass(/selected/);

    await expect(page.locator('#reveal-vote-btn')).toBeEnabled();
    await page.click('#reveal-vote-btn');

    // Screen 6: Results
    await expect(page.locator('#results-screen')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Results');

    // Check if either crew wins or imposter survives
    const resultsContent = page.locator('#results-content');
    const isCaught = await resultsContent.locator('.success-text').count();
    const isWrong = await resultsContent.locator('.error-text').count();

    if (isCaught > 0) {
      // Crew caught the imposter
      await expect(resultsContent).toContainText('You caught the Imposter!');
      await expect(resultsContent).toContainText('The Crew gets 1 point!');
      await page.click('#continue-results-btn');
    } else if (isWrong > 0) {
      // Wrong guess, imposter gets to guess
      await expect(resultsContent).toContainText('Wrong guess!');
      await expect(page.locator('#imposter-guess-section')).toBeVisible();

      // Make an imposter guess
      await page.fill('#imposter-guess-input', 'pizza');
      await page.click('#submit-guess-btn');

      await expect(page.locator('#continue-results-btn')).toBeVisible();
      await page.click('#continue-results-btn');
    }

    // Screen 7: Scoreboard
    await expect(page.locator('#scoreboard-screen')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Current Scores');

    // Check scoreboard exists
    await expect(page.locator('#scores-list')).toBeVisible();
    await expect(page.locator('.score-item')).toHaveCount(4);

    // Test next round and end game buttons
    await expect(page.locator('#next-round-btn')).toBeVisible();
    await expect(page.locator('#end-game-btn')).toBeVisible();
  });

  test('start new round after game completion', async ({ page }) => {
    // Complete a quick game first
    await setupQuickGame(page);

    // Click next round
    await page.click('#next-round-btn');

    // Should be back at category selection
    await expect(page.locator('#category-screen')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Choose a Category');
  });

  test('end game and return to setup', async ({ page }) => {
    // Complete a quick game first
    await setupQuickGame(page);

    // Click end game
    await page.click('#end-game-btn');

    // Should be back at setup screen
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.locator('#player-count-display')).toContainText('4');
  });
});

async function setupQuickGame(page) {
  // Fill player names quickly
  const playerInputs = page.locator('.player-input');
  await playerInputs.nth(0).fill('Alice');
  await playerInputs.nth(1).fill('Bob');
  await playerInputs.nth(2).fill('Charlie');
  await playerInputs.nth(3).fill('Diana');

  await page.click('#start-game-btn');
  await page.click('[data-category="food"]');

  // Quick role distribution
  for (let i = 0; i < 4; i++) {
    await page.click('#reveal-role-btn');
    await page.click('#pass-phone-btn');
  }

  await page.click('#proceed-voting-btn');

  // Vote for first player
  const voteButtons = page.locator('.vote-btn');
  await voteButtons.first().click();
  await page.click('#reveal-vote-btn');

  // Handle imposter guess if needed
  const imposterSection = page.locator('#imposter-guess-section');
  if (await imposterSection.isVisible()) {
    await page.fill('#imposter-guess-input', 'pizza');
    await page.click('#submit-guess-btn');
  }

  await page.click('#continue-results-btn');
}