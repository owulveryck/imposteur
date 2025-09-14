const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });

  console.log('🌍 Testing French and English Language Support...');

  // Test French (default based on French categories)
  console.log('\n🇫🇷 Testing French Version...');
  let page = await browser.newPage();
  await page.goto('http://localhost:3000?lang=fr');

  // Check French UI elements
  await page.waitForSelector('#setup-screen.active');
  const frenchTitle = await page.textContent('h1');
  const frenchSetup = await page.textContent('[data-i18n="setupTitle"]');
  const frenchLabel = await page.textContent('[data-i18n="playerCountLabel"]');

  console.log(`   Title: "${frenchTitle}"`);
  console.log(`   Setup Title: "${frenchSetup}"`);
  console.log(`   Player Label: "${frenchLabel}"`);

  // Quick game setup in French
  const playerInputs = page.locator('.player-input');
  await playerInputs.nth(0).fill('Alice');
  await playerInputs.nth(1).fill('Bob');
  await playerInputs.nth(2).fill('Charlie');
  await playerInputs.nth(3).fill('Diana');

  const startBtn = await page.textContent('#start-game-btn');
  console.log(`   Start Button: "${startBtn}"`);
  await page.click('#start-game-btn');

  // Check French categories
  await page.waitForSelector('#category-screen.active');
  const categoryTitle = await page.textContent('[data-i18n="categoryTitle"]');
  console.log(`   Category Title: "${categoryTitle}"`);

  // Check a French category name
  const firstCategory = await page.textContent('.category-btn:first-child');
  console.log(`   First Category: "${firstCategory}"`);

  await page.click('.category-btn:first-child');

  // Check role distribution in French
  await page.waitForSelector('#role-screen.active');
  const roleBtn = await page.textContent('#reveal-role-btn');
  console.log(`   Reveal Role Button: "${roleBtn}"`);

  await page.click('#reveal-role-btn');
  await page.waitForSelector('#role-display:not(.hidden)');

  const roleContent = await page.textContent('#role-content');
  console.log(`   Role Content (first few words): "${roleContent.substring(0, 50)}..."`);

  await page.close();

  // Test English
  console.log('\n🇺🇸 Testing English Version...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000?lang=en');

  // Check English UI elements
  await page.waitForSelector('#setup-screen.active');
  const englishTitle = await page.textContent('h1');
  const englishSetup = await page.textContent('[data-i18n="setupTitle"]');
  const englishLabel = await page.textContent('[data-i18n="playerCountLabel"]');

  console.log(`   Title: "${englishTitle}"`);
  console.log(`   Setup Title: "${englishSetup}"`);
  console.log(`   Player Label: "${englishLabel}"`);

  // Quick game setup in English
  const englishPlayerInputs = page.locator('.player-input');
  await englishPlayerInputs.nth(0).fill('Alice');
  await englishPlayerInputs.nth(1).fill('Bob');
  await englishPlayerInputs.nth(2).fill('Charlie');
  await englishPlayerInputs.nth(3).fill('Diana');

  const englishStartBtn = await page.textContent('#start-game-btn');
  console.log(`   Start Button: "${englishStartBtn}"`);
  await page.click('#start-game-btn');

  // Check English categories
  await page.waitForSelector('#category-screen.active');
  const englishCategoryTitle = await page.textContent('[data-i18n="categoryTitle"]');
  console.log(`   Category Title: "${englishCategoryTitle}"`);

  // Check an English category name
  const englishFirstCategory = await page.textContent('.category-btn:first-child');
  console.log(`   First Category: "${englishFirstCategory}"`);

  await page.click('.category-btn:first-child');

  // Check role distribution in English
  await page.waitForSelector('#role-screen.active');
  const englishRoleBtn = await page.textContent('#reveal-role-btn');
  console.log(`   Reveal Role Button: "${englishRoleBtn}"`);

  await page.click('#reveal-role-btn');
  await page.waitForSelector('#role-display:not(.hidden)');

  const englishRoleContent = await page.textContent('#role-content');
  console.log(`   Role Content (first few words): "${englishRoleContent.substring(0, 50)}..."`);

  // Test word generation
  console.log('\n📝 Testing Word Generation...');
  const secretWordElement = page.locator('.secret-word');
  if (await secretWordElement.count() > 0) {
    const englishWord = await secretWordElement.textContent();
    console.log(`   English Word Generated: "${englishWord}"`);
  } else {
    console.log('   Player is the imposter (no secret word shown)');
  }

  await page.close();

  // Test browser language detection
  console.log('\n🔍 Testing Browser Language Detection...');
  page = await browser.newPage();

  // Set browser language to French
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
  });

  await page.goto('http://localhost:3000'); // No lang parameter

  await page.waitForSelector('#setup-screen.active');
  const autoFrenchTitle = await page.textContent('h1');
  console.log(`   Auto-detected French Title: "${autoFrenchTitle}"`);

  await page.close();

  // Test English auto-detection
  page = await browser.newPage();

  // Set browser language to English
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });

  await page.goto('http://localhost:3000'); // No lang parameter

  await page.waitForSelector('#setup-screen.active');
  const autoEnglishTitle = await page.textContent('h1');
  console.log(`   Auto-detected English Title: "${autoEnglishTitle}"`);

  await page.close();

  console.log('\n✅ Language Testing Summary:');
  console.log(`   French support: ${frenchTitle.includes('Imposteur') ? '✅' : '❌'}`);
  console.log(`   English support: ${englishTitle.includes('Imposter') ? '✅' : '❌'}`);
  console.log(`   Auto French detection: ${autoFrenchTitle.includes('Imposteur') ? '✅' : '❌'}`);
  console.log(`   Auto English detection: ${autoEnglishTitle.includes('Imposter') ? '✅' : '❌'}`);
  console.log(`   French categories: ${firstCategory.includes('Vêtements') ? '✅' : '❌'}`);
  console.log(`   English categories: ${englishFirstCategory.includes('Clothing') ? '✅' : '❌'}`);

  console.log('\n🎉 Multilingual implementation complete!');

  await browser.close();
})().catch(console.error);