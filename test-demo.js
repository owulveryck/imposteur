const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();

  console.log('🎮 Starting Imposter Word Game Demo...');

  // Navigate to the game
  await page.goto('http://localhost:3000');
  console.log('✅ Game loaded successfully');

  // Check initial setup screen
  await page.waitForSelector('#setup-screen.active');
  console.log('✅ Setup screen is active');

  // Fill player names
  console.log('📝 Filling player names...');
  await page.fill('.player-input:nth-of-type(1)', 'Alice');
  await page.fill('.player-input:nth-of-type(2)', 'Bob');
  await page.fill('.player-input:nth-of-type(3)', 'Charlie');
  await page.fill('.player-input:nth-of-type(4)', 'Diana');

  // Start game
  console.log('🚀 Starting game...');
  await page.click('#start-game-btn');

  // Select category
  await page.waitForSelector('#category-screen.active');
  console.log('✅ Category selection screen active');
  await page.click('[data-category="vetements"]'); // Test new French categories

  // Role distribution - go through each player
  console.log('🎭 Distributing roles...');
  for (let i = 0; i < 4; i++) {
    await page.waitForSelector('#role-screen.active');
    console.log(`   Player ${i + 1} viewing role...`);
    await page.click('#reveal-role-btn');
    await page.waitForSelector('#role-display:not(.hidden)');

    // Check role content - should either show IMPOSTER or just category + word
    const roleContent = await page.textContent('#role-content');
    if (roleContent.includes('IMPOSTER')) {
      console.log(`     → Player ${i + 1} is the IMPOSTER (sees category only)`);
    } else {
      console.log(`     → Player ${i + 1} sees secret word (not told they're crew)`);
    }

    await page.click('#pass-phone-btn');
  }

  // Instructions screen
  await page.waitForSelector('#instructions-screen.active');
  console.log('✅ Instructions screen active');
  await page.click('#proceed-voting-btn');

  // Voting
  await page.waitForSelector('#voting-screen.active');
  console.log('🗳️ Voting phase...');
  await page.click('.vote-btn:first-child');
  await page.click('#reveal-vote-btn');

  // Results
  await page.waitForSelector('#results-screen.active');
  console.log('📊 Results screen active');

  // Handle imposter guess if needed
  const imposterSection = page.locator('#imposter-guess-section');
  if (await imposterSection.isVisible()) {
    console.log('🤔 Imposter making guess...');
    await page.fill('#imposter-guess-input', 'pizza');
    await page.click('#submit-guess-btn');
  }

  await page.click('#continue-results-btn');

  // Scoreboard
  await page.waitForSelector('#scoreboard-screen.active');
  console.log('🏆 Scoreboard screen active');

  console.log('✅ Full game flow completed successfully!');

  // Test mobile view
  console.log('📱 Testing mobile responsiveness...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);

  // Check if layout adapts
  const header = await page.locator('header').boundingBox();
  const content = await page.locator('#scoreboard-screen .content').boundingBox();

  console.log(`✅ Mobile layout: Header height: ${header?.height}px, Content width: ${content?.width}px`);

  console.log('🎉 All tests completed successfully!');

  await browser.close();
})().catch(console.error);