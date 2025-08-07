from typing import List, Optional, Dict, Any
from datetime import datetime
from .database import PuzzleDatabase, ProgressDatabase, GameStateDatabase
from .models import (
    PuzzleModel, UserProgress, GameState, CompletedPuzzle, 
    PuzzleAttempt, ProgressResponse, ACHIEVEMENTS
)


class PuzzleService:
    @staticmethod
    async def get_all_puzzles(difficulty: Optional[str] = None, completed: Optional[bool] = None) -> List[Dict[str, Any]]:
        """Get all puzzles with completion status"""
        puzzles = await PuzzleDatabase.get_all_puzzles(difficulty)
        progress = await ProgressDatabase.get_or_create_progress()
        
        # Convert to dict and add completion status
        result = []
        for puzzle in puzzles:
            puzzle_dict = puzzle.dict()
            
            # Check if puzzle is completed
            is_completed = any(cp.puzzle_id == puzzle.id and cp.successful for cp in progress.completed_puzzles)
            puzzle_dict['completed'] = is_completed
            
            # Filter by completion status if requested
            if completed is not None and completed != is_completed:
                continue
                
            result.append(puzzle_dict)
        
        return result

    @staticmethod
    async def get_puzzle_by_id(puzzle_id: str) -> Optional[Dict[str, Any]]:
        """Get single puzzle with completion status"""
        puzzle = await PuzzleDatabase.get_puzzle(puzzle_id)
        if not puzzle:
            return None
            
        progress = await ProgressDatabase.get_or_create_progress()
        puzzle_dict = puzzle.dict()
        
        # Add completion status
        is_completed = any(cp.puzzle_id == puzzle.id and cp.successful for cp in progress.completed_puzzles)
        puzzle_dict['completed'] = is_completed
        
        return puzzle_dict

    @staticmethod
    async def complete_puzzle(puzzle_id: str, attempt: PuzzleAttempt, user_id: str = "default_user") -> Dict[str, Any]:
        """Mark puzzle as completed and update progress"""
        puzzle = await PuzzleDatabase.get_puzzle(puzzle_id)
        if not puzzle:
            raise ValueError(f"Puzzle {puzzle_id} not found")
        
        # Create completed puzzle record
        completed_puzzle = CompletedPuzzle(
            puzzle_id=puzzle_id,
            time_spent=attempt.time_spent,
            moves_used=attempt.moves_used,
            hints_used=attempt.hints_used,
            successful=attempt.successful
        )
        
        # Update progress
        progress = await ProgressDatabase.update_progress(user_id, completed_puzzle)
        
        # Check and award achievements
        await AchievementService.check_and_award_achievements(user_id, progress)
        
        # Delete saved game state since puzzle is completed
        await GameStateDatabase.delete_game_state(user_id, puzzle_id)
        
        # Return updated progress
        return await ProgressService.get_progress_response(user_id)


class ProgressService:
    @staticmethod
    async def get_progress_response(user_id: str = "default_user") -> Dict[str, Any]:
        """Get formatted progress response"""
        progress = await ProgressDatabase.get_or_create_progress(user_id)
        all_puzzles = await PuzzleDatabase.get_all_puzzles()
        
        # Count puzzles by difficulty
        beginner_puzzles = [p for p in all_puzzles if p.difficulty == "beginner"]
        intermediate_puzzles = [p for p in all_puzzles if p.difficulty == "intermediate"]
        advanced_puzzles = [p for p in all_puzzles if p.difficulty == "advanced"]
        
        # Count completed puzzles by difficulty
        beginners_solved = len([cp for cp in progress.completed_puzzles 
                               if any(p.id == cp.puzzle_id and p.difficulty == "beginner" 
                                     for p in all_puzzles) and cp.successful])
        
        intermediate_solved = len([cp for cp in progress.completed_puzzles 
                                  if any(p.id == cp.puzzle_id and p.difficulty == "intermediate" 
                                        for p in all_puzzles) and cp.successful])
        
        advanced_solved = len([cp for cp in progress.completed_puzzles 
                              if any(p.id == cp.puzzle_id and p.difficulty == "advanced" 
                                    for p in all_puzzles) and cp.successful])
        
        # Calculate average rating
        successful_puzzles = [cp for cp in progress.completed_puzzles if cp.successful]
        if successful_puzzles:
            total_rating = sum(next((p.rating for p in all_puzzles if p.id == cp.puzzle_id), 0) 
                              for cp in successful_puzzles)
            average_rating = total_rating / len(successful_puzzles)
        else:
            average_rating = 0
        
        # Format achievements
        formatted_achievements = []
        for achievement_id, achievement_info in ACHIEVEMENTS.items():
            earned = any(a.achievement_id == achievement_id for a in progress.achievements)
            earned_date = None
            if earned:
                earned_achievement = next(a for a in progress.achievements if a.achievement_id == achievement_id)
                earned_date = earned_achievement.earned_at.isoformat()
                
            formatted_achievements.append({
                "id": achievement_id,
                "name": achievement_info["name"],
                "description": achievement_info["description"],
                "earned": earned,
                "earned_date": earned_date
            })
        
        # Format recent activity
        recent_activity = []
        sorted_completions = sorted(progress.completed_puzzles, 
                                   key=lambda x: x.completed_at, reverse=True)[:10]
        
        for completion in sorted_completions:
            puzzle = next((p for p in all_puzzles if p.id == completion.puzzle_id), None)
            if puzzle:
                recent_activity.append({
                    "date": completion.completed_at.isoformat(),
                    "puzzle_id": completion.puzzle_id,
                    "puzzle": puzzle.title,
                    "result": "solved" if completion.successful else "failed",
                    "time": completion.time_spent
                })
        
        return {
            "total_puzzles_solved": progress.total_puzzles_solved,
            "total_puzzles": len(all_puzzles),
            "beginners_solved": beginners_solved,
            "intermediate_solved": intermediate_solved,
            "advanced_solved": advanced_solved,
            "average_rating": round(average_rating, 1),
            "streak": progress.streak,
            "achievements": formatted_achievements,
            "recent_activity": recent_activity
        }


class AchievementService:
    @staticmethod
    async def check_and_award_achievements(user_id: str, progress: UserProgress):
        """Check conditions and award achievements"""
        all_puzzles = await PuzzleDatabase.get_all_puzzles()
        
        for achievement_id, achievement_info in ACHIEVEMENTS.items():
            # Skip if already earned
            if any(a.achievement_id == achievement_id for a in progress.achievements):
                continue
            
            # Check condition with mock implementation
            try:
                # Create a mock function to get puzzles for condition checking
                def get_all_puzzles():
                    return all_puzzles
                
                # Replace global function temporarily 
                import sys
                current_module = sys.modules[__name__]
                setattr(current_module, 'get_all_puzzles', get_all_puzzles)
                
                if achievement_info["condition"](progress):
                    await ProgressDatabase.add_achievement(user_id, achievement_id)
                    print(f"Achievement awarded: {achievement_info['name']}")
                    
            except Exception as e:
                print(f"Error checking achievement {achievement_id}: {e}")

    @staticmethod
    async def award_specific_achievement(user_id: str, achievement_id: str) -> Dict[str, Any]:
        """Manually award specific achievement"""
        if achievement_id not in ACHIEVEMENTS:
            raise ValueError(f"Achievement {achievement_id} not found")
        
        await ProgressDatabase.add_achievement(user_id, achievement_id)
        return await ProgressService.get_progress_response(user_id)


class GameStateService:
    @staticmethod
    async def save_game_state(game_state_data: Dict[str, Any], user_id: str = "default_user") -> Dict[str, str]:
        """Save current game state"""
        game_state = GameState(
            user_id=user_id,
            puzzle_id=game_state_data["puzzle_id"],
            board=game_state_data["board"],
            move_history=game_state_data["move_history"],
            time_spent=game_state_data["time_spent"],
            hints_used=game_state_data["hints_used"]
        )
        
        await GameStateDatabase.save_game_state(game_state)
        return {"message": "Game state saved successfully"}

    @staticmethod
    async def load_game_state(puzzle_id: str, user_id: str = "default_user") -> Optional[Dict[str, Any]]:
        """Load saved game state"""
        game_state = await GameStateDatabase.load_game_state(user_id, puzzle_id)
        if game_state:
            return game_state.dict()
        return None