# Chess Puzzles App - Backend Integration Contract

## Overview
This document outlines the backend implementation requirements and integration protocol for the Chess Puzzles App.

## Current Mock Data (to be replaced)
### In `/app/frontend/src/data/mock.js`:
1. **mockPuzzles** - 14 chess puzzles (4 beginner, 4 intermediate, 6 advanced)
2. **mockUserProgress** - User statistics and achievements
3. **Chess board utilities** - Piece symbols and move validation logic

## API Contracts

### 1. Puzzles API

#### GET /api/puzzles
- **Purpose**: Retrieve all available puzzles
- **Query Parameters**: 
  - `difficulty` (optional): "beginner", "intermediate", "advanced"
  - `completed` (optional): boolean
- **Response**: Array of puzzle objects
```json
{
  "puzzles": [
    {
      "id": "string",
      "title": "string",
      "description": "string", 
      "difficulty": "beginner|intermediate|advanced",
      "timeLimit": "number (minutes)",
      "rating": "number",
      "completed": "boolean",
      "moves": ["array of solution moves"],
      "position": "string (FEN notation)",
      "solution": "string",
      "hints": ["array of hint strings"]
    }
  ]
}
```

#### GET /api/puzzles/:id
- **Purpose**: Get specific puzzle details
- **Response**: Single puzzle object

#### POST /api/puzzles/:id/complete
- **Purpose**: Mark puzzle as completed and save attempt
- **Request Body**:
```json
{
  "timeSpent": "number (seconds)",
  "movesUsed": "number",
  "hintsUsed": "number",
  "successful": "boolean"
}
```
- **Response**: Updated user progress

### 2. User Progress API

#### GET /api/progress
- **Purpose**: Get user's overall progress and statistics
- **Response**:
```json
{
  "totalPuzzlesSolved": "number",
  "totalPuzzles": "number", 
  "beginnersSolved": "number",
  "intermediateSolved": "number",
  "advancedSolved": "number",
  "averageRating": "number",
  "streak": "number",
  "achievements": [
    {
      "id": "string",
      "name": "string",
      "description": "string", 
      "earned": "boolean",
      "earnedDate": "string (ISO date)"
    }
  ],
  "recentActivity": [
    {
      "date": "string (ISO date)",
      "puzzleId": "string",
      "puzzle": "string (title)",
      "result": "solved|failed",
      "time": "number (seconds)"
    }
  ]
}
```

#### POST /api/progress/achievement
- **Purpose**: Award achievement to user
- **Request Body**:
```json
{
  "achievementId": "string"
}
```

### 3. Game State API

#### POST /api/game/save
- **Purpose**: Save current game state for resume later
- **Request Body**:
```json
{
  "puzzleId": "string",
  "board": "2D array of pieces",
  "moveHistory": "array of move objects",
  "timeSpent": "number",
  "hintsUsed": "number"
}
```

#### GET /api/game/:puzzleId
- **Purpose**: Load saved game state
- **Response**: Saved game state object

## Database Models

### 1. Puzzle Model
```javascript
{
  _id: ObjectId,
  id: String (unique),
  title: String,
  description: String,
  difficulty: String, // "beginner", "intermediate", "advanced"
  timeLimit: Number, // minutes
  rating: Number,
  moves: [String], // solution moves
  position: String, // FEN notation
  solution: String,
  hints: [String],
  category: String, // "tactics", "endgame", "strategy"
  createdAt: Date,
  updatedAt: Date
}
```

### 2. User Progress Model
```javascript
{
  _id: ObjectId,
  userId: String, // For now, use "default_user"
  totalPuzzlesSolved: Number,
  completedPuzzles: [
    {
      puzzleId: String,
      completedAt: Date,
      timeSpent: Number,
      movesUsed: Number,
      hintsUsed: Number,
      successful: Boolean
    }
  ],
  achievements: [
    {
      achievementId: String,
      earnedAt: Date
    }
  ],
  streak: Number,
  lastActiveDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Game State Model (for save/resume)
```javascript
{
  _id: ObjectId,
  userId: String,
  puzzleId: String,
  board: [[String]], // 2D array representing board state
  moveHistory: [Object],
  timeSpent: Number,
  hintsUsed: Number,
  savedAt: Date
}
```

## Frontend Integration Changes

### Files to Update:
1. **Remove mock imports** from all components
2. **Update API calls** in:
   - `PuzzleSelection.js` - GET /api/puzzles
   - `ChessGame.js` - GET /api/puzzles/:id, POST /api/puzzles/:id/complete
   - `ProgressDashboard.js` - GET /api/progress
   - `HomePage.js` - GET /api/progress (for stats)

### API Service Layer
Create `/app/frontend/src/services/api.js`:
```javascript
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const puzzleAPI = {
  getAll: (filters) => axios.get(`${API_BASE}/puzzles`, { params: filters }),
  getById: (id) => axios.get(`${API_BASE}/puzzles/${id}`),
  markComplete: (id, attemptData) => axios.post(`${API_BASE}/puzzles/${id}/complete`, attemptData)
};

export const progressAPI = {
  get: () => axios.get(`${API_BASE}/progress`),
  awardAchievement: (achievementId) => axios.post(`${API_BASE}/progress/achievement`, { achievementId })
};

export const gameAPI = {
  save: (gameState) => axios.post(`${API_BASE}/game/save`, gameState),
  load: (puzzleId) => axios.get(`${API_BASE}/game/${puzzleId}`)
};
```

## Backend Implementation Steps

### Phase 1: Database Setup
1. Create MongoDB models for Puzzle, UserProgress, GameState
2. Seed database with mock puzzle data
3. Create initial user progress document

### Phase 2: Core APIs
1. Implement puzzle CRUD operations
2. Implement progress tracking
3. Achievement system logic
4. Game state save/resume

### Phase 3: Business Logic
1. **Achievement Triggers**:
   - First puzzle solved
   - Complete all puzzles in difficulty level
   - Solve puzzle under time limit
   - Maintain daily streak
   - Advanced-specific achievements

2. **Progress Calculations**:
   - Overall completion percentage
   - Average rating calculation
   - Streak counting logic
   - Recent activity tracking

### Phase 4: Data Migration
1. Replace frontend mock data with API calls
2. Update components to handle loading states
3. Add error handling for API failures
4. Test complete integration

## Error Handling Strategy

### Frontend:
- Loading states during API calls
- Toast notifications for errors
- Graceful fallbacks for offline mode
- Retry mechanisms for failed requests

### Backend:
- Proper HTTP status codes
- Structured error responses
- Input validation
- Database error handling
- Logging for debugging

## Testing Requirements

### Backend APIs:
- Test all CRUD operations
- Verify achievement logic
- Test progress calculations
- Validate input sanitization

### Integration:
- Test complete puzzle solving flow
- Verify progress tracking accuracy
- Test game state persistence
- Validate achievement awards

This contract ensures seamless backend integration while maintaining all existing frontend functionality.