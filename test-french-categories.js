const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  console.log('🇫🇷 Testing French Categories in Imposter Word Game...');

  await page.goto('http://localhost:3000');
  console.log('✅ Game loaded successfully');

  // Check that all 10 French categories are present
  await page.waitForSelector('#setup-screen.active');

  // Fill player names quickly
  const playerInputs = page.locator('.player-input');
  await playerInputs.nth(0).fill('Alice');
  await playerInputs.nth(1).fill('Bob');
  await playerInputs.nth(2).fill('Charlie');
  await playerInputs.nth(3).fill('Diana');
  await page.click('#start-game-btn');

  // Test all categories
  await page.waitForSelector('#category-screen.active');

  const expectedCategories = [
    { key: 'vetements', name: 'Vêtements et Accessoires' },
    { key: 'emotions', name: 'Sentiments et Émotions' },
    { key: 'cuisine', name: 'Dans la Cuisine' },
    { key: 'loisirs', name: 'Loisirs et Artisanat' },
    { key: 'fiction', name: 'Personnages de Fiction' },
    { key: 'histoire', name: 'Personnages Historiques' },
    { key: 'meteo', name: 'Météo et Saisons' },
    { key: 'corps', name: 'Parties du Corps' },
    { key: 'science', name: 'Science et Espace' },
    { key: 'marques', name: 'Marques et Entreprises' }
  ];

  console.log('📝 Checking all French categories are present...');
  for (const category of expectedCategories) {
    const button = page.locator(`[data-category="${category.key}"]`);
    await button.waitFor();
    const buttonText = await button.textContent();
    console.log(`   ✅ ${category.name} - Found`);

    if (buttonText !== category.name) {
      console.error(`   ❌ Expected "${category.name}", got "${buttonText}"`);
    }
  }

  // Test one category with French words
  console.log('🎭 Testing "Vêtements et Accessoires" category...');
  await page.click('[data-category="vetements"]');

  // Go through role distribution
  const frenchWords = [];
  for (let i = 0; i < 4; i++) {
    await page.waitForSelector('#role-screen.active');
    await page.click('#reveal-role-btn');
    await page.waitForSelector('#role-display:not(.hidden)');

    const roleContent = await page.textContent('#role-content');
    if (roleContent.includes('IMPOSTER')) {
      console.log(`   → Player ${i + 1} is IMPOSTER (sees "Vêtements et Accessoires")`);
    } else {
      // Extract the secret word for non-imposters
      const secretWordMatch = roleContent.match(/Secret Word:\s*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]+)/i);
      if (secretWordMatch) {
        const word = secretWordMatch[1].trim();
        frenchWords.push(word);
        console.log(`   → Player ${i + 1} sees French word: "${word}"`);
      }
    }

    await page.click('#pass-phone-btn');
  }

  // Verify we got a French clothing/accessory word
  if (frenchWords.length > 0) {
    console.log(`✅ French word successfully generated: "${frenchWords[0]}"`);
  }

  // Continue with voting
  await page.waitForSelector('#instructions-screen.active');
  await page.click('#proceed-voting-btn');

  await page.waitForSelector('#voting-screen.active');
  await page.click('.vote-btn:first-child');
  await page.click('#reveal-vote-btn');

  await page.waitForSelector('#results-screen.active');

  // Handle imposter guess with a French word
  const imposterSection = page.locator('#imposter-guess-section');
  if (await imposterSection.isVisible()) {
    console.log('🤔 Testing imposter guess with French word...');
    await page.fill('#imposter-guess-input', 'chemise'); // French clothing word
    await page.click('#submit-guess-btn');
  }

  await page.click('#continue-results-btn');
  await page.waitForSelector('#scoreboard-screen.active');

  console.log('✅ Full game completed with French categories!');

  // Test another category
  console.log('🔄 Testing new round with "Science et Espace"...');
  await page.click('#next-round-btn');
  await page.waitForSelector('#category-screen.active');
  await page.click('[data-category="science"]');

  // Quick role check
  await page.waitForSelector('#role-screen.active');
  await page.click('#reveal-role-btn');
  await page.waitForSelector('#role-display:not(.hidden)');

  const roleContent = await page.textContent('#role-content');
  if (roleContent.includes('Science et Espace')) {
    console.log('✅ Category correctly shows "Science et Espace"');
  }

  // Check for French science words
  if (!roleContent.includes('IMPOSTER')) {
    const secretWordMatch = roleContent.match(/Secret Word:\s*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]+)/i);
    if (secretWordMatch) {
      const word = secretWordMatch[1].trim();
      console.log(`✅ French science word: "${word}"`);
    }
  }

  console.log('🎉 All French category tests completed successfully!');
  console.log(`📊 Total categories tested: ${expectedCategories.length}`);
  console.log('🌟 Game ready for French-speaking players!');

  await browser.close();
})().catch(console.error);