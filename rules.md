#### **1. Objective**

Create a mobile-optimized web application for the "Imposter Word Game." The game should be built using HTML, CSS, and JavaScript, ensuring a responsive design that works seamlessly on mobile browsers. The application will manage game setup, role assignment, voting, and scoring, facilitating a party game played with a single phone passed among players.

---

#### **2. Core Game Concept**

The game is a social deduction activity where all players but one (the "Imposter") know a secret word. Players take turns giving one-word clues about the secret word. The Imposter, who doesn't know the word, must blend in by giving plausible clues. The goal for the regular players ("Crew") is to identify the Imposter. The Imposter's goal is to survive undetected and, if possible, guess the secret word.

---

#### **3. Screen-by-Screen Application Flow**

Implement the following screen flow and functionality.

**Screen 1: Game Setup**
*   **Title:** Imposter Word Game
*   **UI Components:**
    *   A section to select the number of players. Use a slider or `+` / `-` buttons. The range should be a minimum of 4 players and a maximum of 12.
    *   Dynamically generate text input fields for player names based on the selected number. Each field should be labeled "Player 1," "Player 2," etc.
    *   A prominent button labeled "**Start Game**." This button should be disabled until all player name fields are filled.

**Screen 2: Category Selection**
*   **Title:** Choose a Category
*   **Functionality:**
    *   Upon starting the game, the app must randomly select one player from the list to be the Imposter. This should happen in the background.
    *   Display a list of categories for the secret word.
*   **UI Components:**
    *   A grid or list of buttons, each with a category name.
    *   **Pre-defined Categories & Word Lists:** Create at least five default categories with 20+ words each:
        *   **Food:** (e.g., Pizza, Sushi, Apple, Bread, Cheese)
        *   **Animals:** (e.g., Elephant, Penguin, Spider, Dog, Goldfish)
        *   **Household Items:** (e.g., Lamp, Sofa, Microwave, Scissors, Towel)
        *   **Movies:** (e.g., Titanic, Star Wars, Frozen, Inception, Jaws)
        *   **Travel:** (e.g., Airport, Beach, Mountain, Passport, Hotel)
    *   When a category is selected, the app should randomly pick one word from that category's list to be the secret word for the round.

**Screen 3: Role Distribution ("Pass the Phone")**
This screen is a sequence designed to discreetly show each player their role.
*   **Initial State (For Player 1):**
    *   Display text: `[Player 1's Name], it's your turn.`
    *   A large button labeled "**Tap to Reveal Your Role**."
*   **Revealed State (On Tap):**
    *   The screen clears and shows the role for a few seconds.
    *   **For Crew players:** Display the secret word and category. Example: `Category: Food | Secret Word: PIZZA`
    *   **For the Imposter:** Display the text: `You are the IMPOSTER! | Category: Food`
    *   Below the role, include a button labeled "**Got It! Pass to the Next Player**."
*   **Transition State:**
    *   When the "Got It!" button is pressed, the screen should hide the role and display a message for the next player (e.g., `[Player 2's Name], it's your turn.`).
    *   This "Tap to Reveal" -> "Revealed Role" -> "Pass to Next" cycle continues until the last player has seen their role.

**Screen 4: Gameplay Instructions (Offline Phase)**
*   **Title:** The Game Begins!
*   **Functionality:** This screen signals the start of the verbal part of the game, which happens without the phone.
*   **UI Components:**
    *   Display the following instructions:
        > "Everyone has their role. Put the phone down now.
        > Starting with **[Player 1's Name]**, go around the circle and give a **one-word clue** related to the secret word.
        > After **two full rounds** of clues, pick up the phone to vote."
    *   A single button at the bottom labeled "**Proceed to Voting**." Players will only press this after they have finished giving their clues.

**Screen 5: Voting**
*   **Title:** Who is the Imposter?
*   **Instructions:** "After discussion, select the player the group has voted for."
*   **UI Components:**
    *   A list or grid of buttons, each displaying a player's name.
    *   When a name is selected, it should become highlighted.
    *   A button labeled "**Reveal the Vote**."

**Screen 6: Results**
This screen has conditional logic based on the vote.
*   **Functionality:** Compare the player selected during the vote with the pre-assigned Imposter.
*   **Scenario 1: The Imposter is Caught.**
    *   Display: `You caught the Imposter! [Imposter's Name] was the Imposter.`
    *   Also display: `The secret word was: [Secret Word].`
    *   Announce points: `The Crew gets 1 point.`
*   **Scenario 2: An Innocent Player is Voted Out.**
    *   Display: `Wrong guess! [Voted Player's Name] was not the Imposter.`
    *   Reveal the Imposter: `The real Imposter was [Imposter's Name]!`
    *   **Imposter's Guess:** Now, prompt the Imposter to guess the word.
        *   Display: `[Imposter's Name], you have one chance to guess the secret word for a bonus point!`
        *   Provide a text input field and a "**Submit Guess**" button.
        *   **If guess is correct:** Display `Correct! The word was [Secret Word]. The Imposter earns 2 points.`
        *   **If guess is incorrect:** Display `Incorrect. The secret word was [Secret Word]. The Imposter earns 1 point.`

**Screen 7: Scoreboard and New Round**
*   **Title:** Current Scores
*   **UI Components:**
    *   A clear list of all players and their current total scores.
    *   A button labeled "**Play Next Round**." This should reset the game state (keeping the scores) and return the players to **Screen 2: Category Selection**.
    *   A button labeled "**End Game**." This should return to **Screen 1: Game Setup**.

---

#### **4. Game Logic and Rules to Implement**

*   **Player & Role Management:** At the start of each round, one player must be randomly and secretly assigned the "Imposter" role. All other players are the "Crew."
*   **Scoring System:**
    *   **Crew:** Award 1 point to every player on the Crew team if the Imposter is correctly voted out.
    *   **Imposter:**
        *   If the Crew votes for an innocent player, the Imposter gets 1 point for surviving.
        *   If the Imposter survives AND correctly guesses the secret word, they get 1 additional bonus point (for a total of 2 points in that round).
*   **State Management:** The application must maintain the state throughout the game session, including player names, scores, the current secret word, and the assigned Imposter for the round.

---

#### **5. Technical Specifications**

*   **Platform:** Web Application (HTML, CSS, JavaScript).
*   **Design:** Mobile-first, responsive, and clean. The UI should be intuitive and guide the players through each step with clear instructions.
*   **Data:** All game data (player names, scores) can be managed client-side with JavaScript for the duration of the browser session. No backend or database is required.
