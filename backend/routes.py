from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from .services import PuzzleService, ProgressService, AchievementService, GameStateService
from .models import PuzzleAttempt, AchievementRequest

# Create router with /api prefix
router = APIRouter(prefix="/api")


# Puzzle routes
@router.get("/puzzles")
async def get_puzzles(
    difficulty: Optional[str] = Query(None, regex="^(beginner|intermediate|advanced)$"),
    completed: Optional[bool] = None
):
    """Get all puzzles, optionally filtered by difficulty and completion status"""
    try:
        puzzles = await PuzzleService.get_all_puzzles(difficulty, completed)
        return {"puzzles": puzzles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/puzzles/{puzzle_id}")
async def get_puzzle(puzzle_id: str):
    """Get specific puzzle by ID"""
    try:
        puzzle = await PuzzleService.get_puzzle_by_id(puzzle_id)
        if not puzzle:
            raise HTTPException(status_code=404, detail="Puzzle not found")
        return puzzle
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/puzzles/{puzzle_id}/complete")
async def complete_puzzle(puzzle_id: str, attempt: PuzzleAttempt):
    """Mark puzzle as completed and update progress"""
    try:
        result = await PuzzleService.complete_puzzle(puzzle_id, attempt)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Progress routes
@router.get("/progress")
async def get_progress():
    """Get user's overall progress and statistics"""
    try:
        progress = await ProgressService.get_progress_response()
        return progress
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/progress/achievement")
async def award_achievement(request: AchievementRequest):
    """Manually award achievement to user"""
    try:
        result = await AchievementService.award_specific_achievement("default_user", request.achievement_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Game state routes
@router.post("/game/save")
async def save_game_state(game_state_data: Dict[str, Any]):
    """Save current game state for resume later"""
    try:
        required_fields = ["puzzle_id", "board", "move_history", "time_spent", "hints_used"]
        for field in required_fields:
            if field not in game_state_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        result = await GameStateService.save_game_state(game_state_data)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/game/{puzzle_id}")
async def load_game_state(puzzle_id: str):
    """Load saved game state"""
    try:
        game_state = await GameStateService.load_game_state(puzzle_id)
        if not game_state:
            raise HTTPException(status_code=404, detail="No saved game state found")
        return game_state
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Health check
@router.get("/health")
async def health_check():
    """API health check"""
    return {"status": "healthy", "message": "Chess Puzzles API is running"}