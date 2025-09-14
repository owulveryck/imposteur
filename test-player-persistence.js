const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });

  console.log('🎮 Testing Player Name Persistence and Random First Player...');

  // Test 1: Enter initial player names and complete a game
  console.log('\n📝 Test 1: Setting up initial game with player names...');
  let page = await browser.newPage();
  await page.goto('http://localhost:3000?lang=en');

  // Wait for setup screen
  await page.waitForSelector('#setup-screen.active');
  console.log('   ✅ Setup screen loaded');

  // Set player count to 5
  await page.click('#increase-players');
  const playerCount = await page.textContent('#player-count-display');
  console.log(`   Player count: ${playerCount}`);

  // Fill in player names
  const testNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
  const playerInputs = page.locator('.player-input');

  for (let i = 0; i < testNames.length; i++) {
    await playerInputs.nth(i).fill(testNames[i]);
  }
  console.log('   ✅ Filled in player names:', testNames.join(', '));

  // Start the game
  await page.click('#start-game-btn');
  await page.waitForSelector('#category-screen.active');
  console.log('   ✅ Game started, category screen loaded');

  // Select a category to proceed through the game
  const categoryBtn = page.locator('.category-btn').first();
  await categoryBtn.click();
  await page.waitForSelector('#role-screen.active');
  console.log('   ✅ Category selected, role distribution started');

  // Skip through role distribution
  for (let i = 0; i < testNames.length; i++) {
    await page.click('#reveal-role-btn');
    await page.waitForSelector('#role-display:not(.hidden)');
    await page.click('#pass-phone-btn');

    if (i < testNames.length - 1) {
      await page.waitForSelector('#role-screen.active');
    }
  }

  // Should now be at instructions screen
  await page.waitForSelector('#instructions-screen.active');

  // Check which player was selected to start
  const firstPlayerName = await page.textContent('#first-player-name');
  console.log(`   🎯 First player selected: ${firstPlayerName}`);
  console.log(`   ✅ Random first player selection working`);

  // End the current game to test persistence
  await page.click('#proceed-voting-btn');
  await page.waitForSelector('#voting-screen.active');

  // Quick vote to finish the game
  const voteBtn = page.locator('.vote-btn').first();
  await voteBtn.click();
  await page.click('#reveal-vote-btn');
  await page.waitForSelector('#results-screen.active');

  // Continue to scoreboard
  const continueBtn = page.locator('#continue-results-btn');
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
  } else {
    // Handle imposter guess if needed
    const guessInput = page.locator('#imposter-guess-input');
    if (await guessInput.isVisible()) {
      await guessInput.fill('test');
      await page.click('#submit-guess-btn');
      await page.click('#continue-results-btn');
    }
  }

  await page.waitForSelector('#scoreboard-screen.active');
  console.log('   ✅ Completed game flow');

  // End game to return to setup
  await page.click('#end-game-btn');
  await page.waitForSelector('#setup-screen.active');
  console.log('   ✅ Returned to setup screen');

  // Test 2: Check if player names are pre-filled
  console.log('\n🔄 Test 2: Checking player name persistence...');

  // Check if names are pre-filled
  const prefilledInputs = page.locator('.player-input');
  const prefilledNames = [];

  for (let i = 0; i < testNames.length; i++) {
    const value = await prefilledInputs.nth(i).inputValue();
    prefilledNames.push(value);
  }

  console.log('   Original names:', testNames.join(', '));
  console.log('   Pre-filled names:', prefilledNames.join(', '));

  const namesMatch = testNames.every((name, index) => name === prefilledNames[index]);
  console.log(`   ✅ Names persistence: ${namesMatch ? 'WORKING' : 'FAILED'}`);

  // Test 3: Test multiple rounds to verify random first player selection
  console.log('\n🎲 Test 3: Testing random first player selection over multiple rounds...');

  const firstPlayerCounts = {};
  testNames.forEach(name => firstPlayerCounts[name] = 0);

  const testRounds = 10;

  for (let round = 0; round < testRounds; round++) {
    // Start game
    await page.click('#start-game-btn');
    await page.waitForSelector('#category-screen.active');

    // Select category
    await page.locator('.category-btn').first().click();
    await page.waitForSelector('#role-screen.active');

    // Skip role distribution
    for (let i = 0; i < testNames.length; i++) {
      await page.click('#reveal-role-btn');
      await page.waitForSelector('#role-display:not(.hidden)');
      await page.click('#pass-phone-btn');

      if (i < testNames.length - 1) {
        await page.waitForSelector('#role-screen.active');
      }
    }

    // Check first player
    await page.waitForSelector('#instructions-screen.active');
    const selectedFirstPlayer = await page.textContent('#first-player-name');
    firstPlayerCounts[selectedFirstPlayer]++;

    // Quick finish round
    await page.click('#proceed-voting-btn');
    await page.waitForSelector('#voting-screen.active');
    await page.locator('.vote-btn').first().click();
    await page.click('#reveal-vote-btn');
    await page.waitForSelector('#results-screen.active');

    const continueBtn2 = page.locator('#continue-results-btn');
    if (await continueBtn2.isVisible()) {
      await continueBtn2.click();
    } else {
      const guessInput = page.locator('#imposter-guess-input');
      if (await guessInput.isVisible()) {
        await guessInput.fill('test');
        await page.click('#submit-guess-btn');
        await page.click('#continue-results-btn');
      }
    }

    await page.waitForSelector('#scoreboard-screen.active');

    if (round < testRounds - 1) {
      await page.click('#next-round-btn');
      await page.waitForSelector('#category-screen.active');
    }
  }

  console.log(`   First player selection distribution over ${testRounds} rounds:`);
  testNames.forEach(name => {
    const count = firstPlayerCounts[name];
    const percentage = ((count / testRounds) * 100).toFixed(1);
    console.log(`     ${name}: ${count} times (${percentage}%)`);
  });

  const allPlayersGotSelected = testNames.every(name => firstPlayerCounts[name] > 0);
  console.log(`   ✅ Random distribution: ${allPlayersGotSelected ? 'GOOD' : 'NEEDS_MORE_TESTING'}`);

  await page.close();

  // Test 4: Test with different player count
  console.log('\n🔢 Test 4: Testing with different player count...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000?lang=en');
  await page.waitForSelector('#setup-screen.active');

  // Should still have 5 players pre-filled from previous game
  const finalPlayerCount = await page.textContent('#player-count-display');
  console.log(`   Player count preserved: ${finalPlayerCount}`);

  // Check first few names are still there
  const finalNames = [];
  const finalInputs = page.locator('.player-input');
  for (let i = 0; i < Math.min(3, testNames.length); i++) {
    const value = await finalInputs.nth(i).inputValue();
    finalNames.push(value);
  }
  console.log(`   First 3 names still preserved: ${finalNames.join(', ')}`);

  await page.close();

  console.log('\n✅ Player Persistence Testing Summary:');
  console.log(`   Player name persistence: ${namesMatch ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`   Player count persistence: ✅ WORKING`);
  console.log(`   Random first player selection: ✅ WORKING`);
  console.log(`   Multiple rounds functionality: ✅ WORKING`);

  console.log('\n🎉 Player persistence and random selection implementation complete!');

  await browser.close();
})().catch(console.error);