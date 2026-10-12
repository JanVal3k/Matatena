# 🎮 Parry Dice 🎲

**Parry Dice** is a dice-based strategy game inspired by a minigame featured in *Cult of the Lamb*. The project was developed using **React, TypeScript, HTML, and Tailwind CSS**, with a focus on recreating the core gameplay while adding its own identity and features.

## 🎮 Game Description

- **Players:** 2 players: the human player and the AI opponent.
- **Game boards:** Each player has a board with 9 spaces.
- **Objective:** Achieve the highest total score before either player's board is completely filled.

### 🎲 Core Mechanics

- **Dice Placement:** Players take turns placing randomly generated dice, with values ranging from 1 to 6, into empty spaces on their boards.
- **Dice Removal:** When a player places a die in a column where the opponent has a die with the same value, the opponent's matching die is removed from the board.
- **Scoring:** Each die contributes its face value to the player's total score.
- **Pairs and Triples:** In Medium and Hard difficulties, placing two or three dice with the same value in the same column grants a scoring bonus:
  - **Pairs:** Receive a bonus equal to half the sum of their base values. For example, a pair of 3s scores 9 points in total.
  - **Triples:** Receive a bonus equal to two-thirds of the sum of their base values. For example, a triple of 3s scores 15 points in total.

### 🧠 Difficulty Levels

- **Easy:** A beginner-friendly opponent with random decision-making.
- **Medium:** A more strategic opponent that considers combinations and scoring opportunities.
- **Hard:** A more challenging opponent that evaluates possible moves and considers the opponent's responses.

## 🛠️ Technologies Used

- **React:** Component-based user interface.
- **TypeScript:** Game logic and interactions.
- **HTML5:** Application structure.
- **Tailwind CSS:** Styling and responsive layout.

## 📌 Project Status

The single-player version is functional. Future development may include multiplayer support, additional mechanics, and further improvements to the overall gameplay experience.

## ⚖️ Disclaimer

Parry Dice is an independent educational and portfolio project. It is inspired by a minigame featured in *Cult of the Lamb*, but it is not an official product and is not affiliated with its developers or publishers.

All third-party intellectual property remains the property of its respective owners.

---

**Roll. Parry. Steal the Win.** 🎲