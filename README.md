# Jeopardy Game Application

## Overview
This is a Next.js application that implements a Jeopardy-style game. The application allows users to set up and play a customizable Jeopardy game, complete with categories, questions, and team scoring.

## Key Components

### JeopardyGame (src/components/jeopardy/JeopardyGame.tsx)
The main component that orchestrates the game. It manages the overall state of the game, including categories, questions, teams, and game mode (setup or play).

### JeopardyBoard (src/components/jeopardy/JeopardyBoard.tsx)
Renders the game board with categories and questions. It displays the point values for each question and handles question selection.

### JeopardyQuestion (src/components/jeopardy/JeopardyQuestion.tsx)
Displays the current question and answer, and handles scoring when a team answers correctly.

### JeopardySetup (src/components/jeopardy/JeopardySetup.tsx)
Provides an interface for setting up the game, including adding/editing categories and questions, managing teams, and importing/exporting questions.

### JeopardyTeam (src/components/jeopardy/JeopardyTeam.tsx)
Displays team information and score, with controls to adjust scores manually.

## Key Features
- Customizable categories and questions
- Team management and scoring
- Import/export functionality for questions
- Responsive design for various screen sizes
- Setup and play modes

## Technical Implementation
- Built with Next.js and React
- Uses TypeScript for type safety
- Styling with Tailwind CSS
- Custom UI components (buttons, inputs, dialogs) for consistent design
- State management using React hooks (useState, useEffect)

## How to Use
1. Start in Setup Mode to configure categories, questions, and teams
2. Use the "Switch to Play Mode" button to begin the game
3. Select questions from the board to reveal them
4. Use the scoring buttons to award points to teams
5. Manual score adjustments can be made using team controls

## Data Structure
- Categories: Array of objects containing name and questions
- Questions: Objects with question text, answer, point value, and completion status
- Teams: Array of objects with team name and score

## Future Enhancements
- Add sound effects and animations
- Implement a timer for questions
- Create a multi-round game structure
- Add support for "Daily Double" style questions
- Implement user accounts and save game progress

This Jeopardy game application provides a flexible and interactive platform for hosting trivia games, suitable for educational or entertainment purposes.