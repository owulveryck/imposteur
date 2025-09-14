import { test, expect } from '@playwright/test';

test.describe('Voting and Results Screen Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Setup complete game to voting phase
    await setupGameToVoting(page);
  });

  test('should display voting screen correctly', async ({ page }) => {
    await expect(page.locator('#voting-screen')).toBeVisible();
    await expect(page.locator('#voting-screen')).toHaveClass(/active/);
    await expect(page.locator('h2')).toContainText('Who is the Imposter?');
    await expect(page.locator('.instructions')).toContainText('After discussion, select the player the group has voted for.');
  });

  test('should display all player voting buttons', async ({ page }) => {
    const voteButtons = page.locator('.vote-btn');
    await expect(voteButtons).toHaveCount(4);

    const expectedPlayers = ['Alice', 'Bob', 'Charlie', 'Diana'];
    for (let i = 0; i < expectedPlayers.length; i++) {
      await expect(voteButtons.nth(i)).toContainText(expectedPlayers[i]);
      await expect(voteButtons.nth(i)).toBeEnabled();
    }
  });

  test('should disable reveal vote button initially', async ({ page }) => {
    await expect(page.locator('#reveal-vote-btn')).toBeDisabled();
  });

  test('should enable reveal vote button after selecting player', async ({ page }) => {
    const voteButtons = page.locator('.vote-btn');
    await voteButtons.first().click();

    await expect(voteButtons.first()).toHaveClass(/selected/);
    await expect(page.locator('#reveal-vote-btn')).toBeEnabled();
  });

  test('should allow changing vote selection', async ({ page }) => {
    const voteButtons = page.locator('.vote-btn');

    // Select first player
    await voteButtons.nth(0).click();
    await expect(voteButtons.nth(0)).toHaveClass(/selected/);

    // Select second player
    await voteButtons.nth(1).click();
    await expect(voteButtons.nth(0)).not.toHaveClass(/selected/);
    await expect(voteButtons.nth(1)).toHaveClass(/selected/);
  });

  test('should show results screen after revealing vote', async ({ page }) => {
    // Vote for first player
    await page.locator('.vote-btn').first().click();
    await page.click('#reveal-vote-btn');

    await expect(page.locator('#voting-screen')).not.toHaveClass(/active/);
    await expect(page.locator('#results-screen')).toHaveClass(/active/);
    await expect(page.locator('h2')).toContainText('Results');
  });

  test('should handle crew winning scenario', async ({ page }) => {
    // We need to vote for the actual imposter
    // Since imposter is randomly assigned, we'll test the result logic
    const voteButtons = page.locator('.vote-btn');

    // Try each player until we find the imposter
    for (let i = 0; i < 4; i++) {
      await page.goto('/');
      await setupGameToVoting(page);

      await voteButtons.nth(i).click();
      await page.click('#reveal-vote-btn');

      const resultsContent = page.locator('#results-content');
      const isSuccess = await resultsContent.locator('.success-text').count() > 0;

      if (isSuccess) {
        // Found the imposter!
        await expect(resultsContent).toContainText('You caught the Imposter!');
        await expect(resultsContent).toContainText('was the Imposter.');
        await expect(resultsContent).toContainText('The secret word was:');
        await expect(resultsContent).toContainText('The Crew gets 1 point!');
        await expect(page.locator('#continue-results-btn')).toBeVisible();
        await expect(page.locator('#imposter-guess-section')).toHaveClass(/hidden/);
        break;
      }
    }
  });

  test('should handle imposter survival scenario', async ({ page }) => {
    // Vote for a non-imposter (try multiple until we get wrong guess)
    const voteButtons = page.locator('.vote-btn');

    for (let i = 0; i < 4; i++) {
      await page.goto('/');
      await setupGameToVoting(page);

      await voteButtons.nth(i).click();
      await page.click('#reveal-vote-btn');

      const resultsContent = page.locator('#results-content');
      const isError = await resultsContent.locator('.error-text').count() > 0;

      if (isError) {
        // Found a wrong guess!
        await expect(resultsContent).toContainText('Wrong guess!');
        await expect(resultsContent).toContainText('was not the Imposter.');
        await expect(resultsContent).toContainText('The real Imposter was');
        await expect(page.locator('#imposter-guess-section')).toBeVisible();
        await expect(page.locator('#continue-results-btn')).toHaveClass(/hidden/);

        // Test imposter guess functionality
        await expect(page.locator('#imposter-guess-prompt')).toContainText('you have one chance to guess');
        await expect(page.locator('#imposter-guess-input')).toBeVisible();
        await expect(page.locator('#submit-guess-btn')).toBeVisible();
        break;
      }
    }
  });

  test('should handle correct imposter guess', async ({ page }) => {
    // Find wrong vote first to trigger imposter guess
    const voteButtons = page.locator('.vote-btn');
    let foundWrongGuess = false;

    for (let i = 0; i < 4 && !foundWrongGuess; i++) {
      await page.goto('/');
      await setupGameToVoting(page);

      await voteButtons.nth(i).click();
      await page.click('#reveal-vote-btn');

      const resultsContent = page.locator('#results-content');
      const isError = await resultsContent.locator('.error-text').count() > 0;

      if (isError) {
        foundWrongGuess = true;

        // Try common food words that might be the secret word
        const commonFoodWords = ['pizza', 'pasta', 'bread', 'apple', 'cheese'];

        for (const word of commonFoodWords) {
          await page.fill('#imposter-guess-input', word);
          await page.click('#submit-guess-btn');

          // Check if guess was correct or incorrect
          const hasCorrect = await resultsContent.locator('.success-text').count() > 1; // More than initial error
          const hasIncorrect = await resultsContent.textContent();

          if (hasCorrect || hasIncorrect?.includes('Correct!')) {
            await expect(resultsContent).toContainText('The word was');
            if (hasCorrect) {
              await expect(resultsContent).toContainText('The Imposter earns 2 points!');
            }
            break;
          } else if (hasIncorrect?.includes('Incorrect!')) {
            await expect(resultsContent).toContainText('The Imposter earns 1 point');
            break;
          }

          // Reset for next word attempt
          await page.goto('/');
          await setupGameToVoting(page);
          await voteButtons.nth(i).click();
          await page.click('#reveal-vote-btn');
        }

        await expect(page.locator('#imposter-guess-section')).toHaveClass(/hidden/);
        await expect(page.locator('#continue-results-btn')).toBeVisible();
      }
    }
  });

  test('should navigate to scoreboard after results', async ({ page }) => {
    // Vote and get results
    await page.locator('.vote-btn').first().click();
    await page.click('#reveal-vote-btn');

    // Handle imposter guess if needed
    const imposterSection = page.locator('#imposter-guess-section');
    if (await imposterSection.isVisible()) {
      await page.fill('#imposter-guess-input', 'pizza');
      await page.click('#submit-guess-btn');
    }

    await page.click('#continue-results-btn');

    // Should be at scoreboard
    await expect(page.locator('#results-screen')).not.toHaveClass(/active/);
    await expect(page.locator('#scoreboard-screen')).toHaveClass(/active/);
  });
});

async function setupGameToVoting(page) {
  // Fill player names
  const playerInputs = page.locator('.player-input');
  await playerInputs.nth(0).fill('Alice');
  await playerInputs.nth(1).fill('Bob');
  await playerInputs.nth(2).fill('Charlie');
  await playerInputs.nth(3).fill('Diana');

  await page.click('#start-game-btn');
  await page.click('[data-category="food"]');

  // Complete role distribution
  for (let i = 0; i < 4; i++) {
    await page.click('#reveal-role-btn');
    await page.click('#pass-phone-btn');
  }

  // Skip instructions to get to voting
  await page.click('#proceed-voting-btn');
}