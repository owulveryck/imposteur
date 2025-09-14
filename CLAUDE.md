# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Imposter Word Game** - a mobile-first social deduction web game implemented in vanilla HTML, CSS, and JavaScript. Players pass a single phone around to secretly view their roles, then try to identify the imposter through word clues.

### Core Architecture

**Single-Page Application Structure:**
- `index.html` - Contains all 7 game screens as hidden divs that are shown/hidden dynamically
- `game.js` - Main game class (`ImposterWordGame`) managing state and screen transitions
- `words-config.js` - External word/category configuration loaded before game.js
- `styles.css` - Mobile-first responsive CSS with screen-specific styling

**Game State Management:**
The game uses a centralized state object (`this.gameState`) tracking:
- Player list and current player index
- Imposter assignment (randomly selected index)
- Selected category and secret word
- Voting results and scores
- Current screen state

**Screen Flow (7 Screens):**
1. Setup → 2. Category Selection → 3. Role Distribution → 4. Instructions → 5. Voting → 6. Results → 7. Scoreboard

## Development Commands

### Local Development
```bash
npm run serve          # Start local server on port 3000
```

### Testing
```bash
npm test              # Run full Playwright test suite
npm run test:headed   # Run tests with visible browser
npm run test:mobile   # Test mobile Chrome & Safari only
npm run test:ui       # Open Playwright UI for debugging
npm run test:demo     # Visual demo of complete game flow
npm run test:french   # Test French word categories
```

### Single Test Execution
```bash
npx playwright test tests/setup-screen.spec.js           # Single test file
npx playwright test tests/setup-screen.spec.js:8         # Specific test
npx playwright test --project=chromium                   # Single browser
npx playwright test --grep "should display correctly"    # Pattern match
```

## Code Architecture Details

### Dynamic Content Generation

**Category System:**
- Categories are loaded from `words-config.js` into `window.WORD_CATEGORIES`
- `generateCategoryButtons()` dynamically creates category buttons from config
- This allows easy localization and category management without touching game logic

**Player Input Generation:**
- Player count (4-12) dynamically generates input fields
- Input validation enables/disables start button
- Player names are stored in `gameState.players` array

### Role Distribution Logic

**Critical Implementation Detail:**
- Only the imposter sees "You are the IMPOSTER!" message
- Non-imposters see category + secret word WITHOUT being told they're "crew"
- This maintains game secrecy (imposters shouldn't know others are crew)

**State Tracking:**
- `gameState.imposterIndex` tracks who is the imposter
- `gameState.currentPlayerIndex` tracks role distribution progress
- Role reveal happens sequentially with phone passing

### Testing Architecture

**Playwright Configuration:**
- Tests run against local server (`http://localhost:3000`)
- Cross-browser testing: Desktop Chrome, Mobile Chrome, Mobile Safari
- Automatic server startup via `webServer` config

**Test Organization:**
- `setup-screen.spec.js` - Player setup and validation
- `category-screen.spec.js` - Category selection
- `role-distribution.spec.js` - Role assignment and reveal
- `voting-results.spec.js` - Voting and scoring logic
- `mobile-responsive.spec.js` - Mobile layout and touch interactions
- `game-flow.spec.js` - End-to-end complete game scenarios

### Mobile-First Design

**Touch Optimization:**
- Minimum 44px touch targets for mobile usability
- CSS `touch-action: manipulation` prevents default behaviors
- `user-select: none` prevents text selection during gameplay

**Responsive Breakpoints:**
- Base: Mobile portrait (375px)
- `@media (min-width: 480px)` - Mobile landscape / small tablet
- `@media (min-width: 768px)` - Tablet portrait
- Safe area support for notched devices

## Word Configuration

**Localization Structure:**
The `words-config.js` file contains 10 French categories with 30 words each, organized by difficulty:
- Each category has `name` (display name) and `words` (array of terms)
- Categories include: Vêtements, Émotions, Cuisine, Loisirs, Fiction, Histoire, Météo, Corps, Science, Marques
- To add new languages, create new config files and update HTML script loading

**Category Integration:**
- `this.categories = window.WORD_CATEGORIES` loads external config
- `selectCategory(categoryKey)` picks random word from selected category
- Category names display using `this.categories[categoryKey].name`

## Key Implementation Notes

**Screen Management:**
- All screens exist in DOM simultaneously with `screen` class
- Only one screen has `active` class (CSS controls visibility)
- `showScreen(screenId)` handles transitions

**Security Considerations:**
- Game state is client-side only (no backend required)
- Imposter assignment uses `Math.random()` for unpredictability
- No sensitive data - purely recreational game

**Browser Compatibility:**
- Vanilla JavaScript (no frameworks)
- Modern browser features: CSS Grid, Flexbox, CSS custom properties
- Touch events for mobile interaction
- Device orientation API integration ready (mentioned in README but not implemented)

## Common Development Patterns

When modifying game screens, follow the pattern:
1. Update HTML structure in `index.html`
2. Add CSS styles in `styles.css` with screen-specific selectors
3. Implement logic in `game.js` as class methods
4. Add event listeners in `setupEventListeners()`
5. Update state in `gameState` object
6. Add corresponding tests in appropriate spec file