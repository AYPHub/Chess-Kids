from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


class PuzzleModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    difficulty: str  # "beginner", "intermediate", "advanced"
    time_limit: int  # minutes
    rating: int
    moves: List[str]  # solution moves
    position: str  # FEN notation
    solution: str
    hints: List[str]
    category: str = "tactics"  # "tactics", "endgame", "strategy"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class PuzzleCreate(BaseModel):
    title: str
    description: str
    difficulty: str
    time_limit: int
    rating: int
    moves: List[str]
    position: str
    solution: str
    hints: List[str]
    category: str = "tactics"


class CompletedPuzzle(BaseModel):
    puzzle_id: str
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    time_spent: int  # seconds
    moves_used: int
    hints_used: int
    successful: bool


class Achievement(BaseModel):
    achievement_id: str
    earned_at: datetime = Field(default_factory=datetime.utcnow)


class UserProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"  # For now, single user app
    total_puzzles_solved: int = 0
    completed_puzzles: List[CompletedPuzzle] = []
    achievements: List[Achievement] = []
    streak: int = 0
    last_active_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class PuzzleAttempt(BaseModel):
    time_spent: int  # seconds
    moves_used: int
    hints_used: int
    successful: bool


class GameState(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"
    puzzle_id: str
    board: List[List[Optional[str]]]  # 2D array representing board state
    move_history: List[Dict[str, Any]]
    time_spent: int  # seconds
    hints_used: int
    saved_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class ProgressResponse(BaseModel):
    total_puzzles_solved: int
    total_puzzles: int
    beginners_solved: int
    intermediate_solved: int
    advanced_solved: int
    average_rating: float
    streak: int
    achievements: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]


class AchievementRequest(BaseModel):
    achievement_id: str


# Achievement definitions
ACHIEVEMENTS = {
    "first_puzzle": {
        "name": "First Puzzle",
        "description": "Solved your first puzzle!",
        "condition": lambda progress: progress.total_puzzles_solved >= 1
    },
    "beginner_master": {
        "name": "Beginner Master", 
        "description": "Completed all beginner puzzles",
        "condition": lambda progress: len([p for p in progress.completed_puzzles 
                                         if any(puzzle.difficulty == "beginner" and puzzle.id == p.puzzle_id 
                                               for puzzle in get_all_puzzles())]) >= 15
    },
    "intermediate_master": {
        "name": "Intermediate Master",
        "description": "Completed all intermediate puzzles", 
        "condition": lambda progress: len([p for p in progress.completed_puzzles
                                         if any(puzzle.difficulty == "intermediate" and puzzle.id == p.puzzle_id
                                               for puzzle in get_all_puzzles())]) >= 20
    },
    "advanced_master": {
        "name": "Advanced Master",
        "description": "Completed all advanced puzzles",
        "condition": lambda progress: len([p for p in progress.completed_puzzles
                                         if any(puzzle.difficulty == "advanced" and puzzle.id == p.puzzle_id
                                               for puzzle in get_all_puzzles())]) >= 15
    },
    "quick_solver": {
        "name": "Quick Solver",
        "description": "Solved a puzzle in under 30 seconds",
        "condition": lambda progress: any(p.time_spent < 30 and p.successful for p in progress.completed_puzzles)
    },
    "streak_3": {
        "name": "3-Day Streak", 
        "description": "Solved puzzles 3 days in a row",
        "condition": lambda progress: progress.streak >= 3
    },
    "tactical_genius": {
        "name": "Tactical Genius",
        "description": "Solved 5 advanced puzzles", 
        "condition": lambda progress: len([p for p in progress.completed_puzzles
                                         if any(puzzle.difficulty == "advanced" and puzzle.id == p.puzzle_id and p.successful
                                               for puzzle in get_all_puzzles())]) >= 5
    },
    "endgame_expert": {
        "name": "Endgame Expert",
        "description": "Mastered endgame techniques",
        "condition": lambda progress: len([p for p in progress.completed_puzzles
                                         if p.puzzle_id in ["a3", "a4"] and p.successful]) >= 2  # Endgame puzzles
    }
}

def get_all_puzzles():
    """Placeholder - will be replaced with actual database query"""
    return []