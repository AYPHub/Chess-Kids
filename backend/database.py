from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
from datetime import datetime, timedelta
from models import PuzzleModel, UserProgress, GameState, CompletedPuzzle, Achievement

# MongoDB client
client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

# Collections
puzzles_collection = db.puzzles
progress_collection = db.user_progress  
game_state_collection = db.game_states


class PuzzleDatabase:
    @staticmethod
    async def create_puzzle(puzzle: PuzzleModel) -> PuzzleModel:
        """Create a new puzzle"""
        puzzle_dict = puzzle.dict()
        await puzzles_collection.insert_one(puzzle_dict)
        return puzzle

    @staticmethod
    async def get_puzzle(puzzle_id: str) -> Optional[PuzzleModel]:
        """Get puzzle by ID"""
        puzzle_data = await puzzles_collection.find_one({"id": puzzle_id})
        if puzzle_data:
            return PuzzleModel(**puzzle_data)
        return None

    @staticmethod
    async def get_all_puzzles(difficulty: Optional[str] = None) -> List[PuzzleModel]:
        """Get all puzzles, optionally filtered by difficulty"""
        query = {}
        if difficulty:
            query["difficulty"] = difficulty
            
        puzzles_data = await puzzles_collection.find(query).to_list(1000)
        return [PuzzleModel(**puzzle) for puzzle in puzzles_data]

    @staticmethod
    async def update_puzzle(puzzle_id: str, update_data: Dict[str, Any]) -> Optional[PuzzleModel]:
        """Update puzzle"""
        update_data["updated_at"] = datetime.utcnow()
        result = await puzzles_collection.update_one(
            {"id": puzzle_id}, 
            {"$set": update_data}
        )
        if result.modified_count:
            return await PuzzleDatabase.get_puzzle(puzzle_id)
        return None

    @staticmethod
    async def delete_puzzle(puzzle_id: str) -> bool:
        """Delete puzzle"""
        result = await puzzles_collection.delete_one({"id": puzzle_id})
        return result.deleted_count > 0


class ProgressDatabase:
    @staticmethod
    async def get_user_progress(user_id: str = "default_user") -> Optional[UserProgress]:
        """Get user progress"""
        progress_data = await progress_collection.find_one({"user_id": user_id})
        if progress_data:
            return UserProgress(**progress_data)
        return None

    @staticmethod
    async def create_user_progress(user_id: str = "default_user") -> UserProgress:
        """Create initial user progress"""
        progress = UserProgress(user_id=user_id)
        await progress_collection.insert_one(progress.dict())
        return progress

    @staticmethod
    async def get_or_create_progress(user_id: str = "default_user") -> UserProgress:
        """Get existing progress or create new one"""
        progress = await ProgressDatabase.get_user_progress(user_id)
        if not progress:
            progress = await ProgressDatabase.create_user_progress(user_id)
        return progress

    @staticmethod
    async def update_progress(user_id: str, completed_puzzle: CompletedPuzzle) -> UserProgress:
        """Update progress when puzzle is completed"""
        progress = await ProgressDatabase.get_or_create_progress(user_id)
        
        # Add completed puzzle if not already completed
        existing_completion = next((p for p in progress.completed_puzzles if p.puzzle_id == completed_puzzle.puzzle_id), None)
        if not existing_completion and completed_puzzle.successful:
            progress.completed_puzzles.append(completed_puzzle)
            progress.total_puzzles_solved += 1
        
        # Update streak logic
        today = datetime.utcnow().date()
        last_active = progress.last_active_date.date() if progress.last_active_date else None
        
        if last_active:
            days_diff = (today - last_active).days
            if days_diff == 1:  # Consecutive day
                progress.streak += 1
            elif days_diff > 1:  # Streak broken
                progress.streak = 1
            # Same day doesn't change streak
        else:
            progress.streak = 1
            
        progress.last_active_date = datetime.utcnow()
        progress.updated_at = datetime.utcnow()
        
        # Save to database
        await progress_collection.update_one(
            {"user_id": user_id},
            {"$set": progress.dict()},
            upsert=True
        )
        
        return progress

    @staticmethod
    async def add_achievement(user_id: str, achievement_id: str) -> UserProgress:
        """Add achievement to user"""
        progress = await ProgressDatabase.get_or_create_progress(user_id)
        
        # Check if achievement already earned
        if not any(a.achievement_id == achievement_id for a in progress.achievements):
            achievement = Achievement(achievement_id=achievement_id)
            progress.achievements.append(achievement)
            progress.updated_at = datetime.utcnow()
            
            await progress_collection.update_one(
                {"user_id": user_id},
                {"$set": progress.dict()},
                upsert=True
            )
        
        return progress


class GameStateDatabase:
    @staticmethod
    async def save_game_state(game_state: GameState) -> GameState:
        """Save current game state"""
        await game_state_collection.update_one(
            {"user_id": game_state.user_id, "puzzle_id": game_state.puzzle_id},
            {"$set": game_state.dict()},
            upsert=True
        )
        return game_state

    @staticmethod
    async def load_game_state(user_id: str, puzzle_id: str) -> Optional[GameState]:
        """Load saved game state"""
        state_data = await game_state_collection.find_one({
            "user_id": user_id, 
            "puzzle_id": puzzle_id
        })
        if state_data:
            return GameState(**state_data)
        return None

    @staticmethod
    async def delete_game_state(user_id: str, puzzle_id: str) -> bool:
        """Delete saved game state (when puzzle is completed)"""
        result = await game_state_collection.delete_one({
            "user_id": user_id,
            "puzzle_id": puzzle_id
        })
        return result.deleted_count > 0


# Initialize database with sample data
async def init_database():
    """Initialize database with sample puzzles"""
    # Check if puzzles already exist
    existing_count = await puzzles_collection.count_documents({})
    if existing_count > 0:
        return
    
    # Sample puzzles data (from mock.js)
    sample_puzzles = [
        # Beginner puzzles
        {
            "id": "b1",
            "title": "Checkmate in 1",
            "description": "Find the winning move to checkmate the king",
            "difficulty": "beginner",
            "time_limit": 5,
            "rating": 800,
            "moves": ["Qh7#"],
            "position": "rnbqk1nr/pppp1ppp/4p3/2b5/2B1P3/8/PPPP1PbP/RNBQK1NR",
            "solution": "Qh7#",
            "hints": ["Look for a move with your queen", "The king is vulnerable on h7"],
            "category": "tactics"
        },
        {
            "id": "b2",
            "title": "Capture the Queen",
            "description": "Win material by capturing the undefended queen",
            "difficulty": "beginner",
            "time_limit": 3,
            "rating": 750,
            "moves": ["Rxd8+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Rxd8+",
            "hints": ["Look for undefended pieces", "Your rook can capture safely"],
            "category": "tactics"
        },
        {
            "id": "b3",
            "title": "Fork with Knight",
            "description": "Use your knight to attack two pieces at once",
            "difficulty": "beginner",
            "time_limit": 4,
            "rating": 850,
            "moves": ["Ne7+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Ne7+",
            "hints": ["Knights can jump over pieces", "Look for a move that attacks both king and queen"],
            "category": "tactics"
        },
        {
            "id": "b4",
            "title": "Pin the Piece",
            "description": "Immobilize an opponent piece with a pin",
            "difficulty": "beginner",
            "time_limit": 3,
            "rating": 800,
            "moves": ["Bb5+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Bb5+",
            "hints": ["Look for pieces on the same line", "Your bishop can create problems"],
            "category": "tactics"
        },
        
        # Intermediate puzzles
        {
            "id": "i1",
            "title": "Checkmate in 2",
            "description": "Find the sequence of moves to deliver checkmate in 2 moves",
            "difficulty": "intermediate",
            "time_limit": 8,
            "rating": 1200,
            "moves": ["Qd8+", "Qh8#"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Qd8+ Kg7 Qh8#",
            "hints": ["Force the king to a worse square", "Look for a way to trap the king"],
            "category": "tactics"
        },
        {
            "id": "i2",
            "title": "Tactical Combination",
            "description": "Find the tactical sequence to win material",
            "difficulty": "intermediate",
            "time_limit": 10,
            "rating": 1350,
            "moves": ["Rxe6+", "Qxf7+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Rxe6+ Kh8 Qxf7",
            "hints": ["Sacrifice for position", "Look for multiple threats"],
            "category": "tactics"
        },
        {
            "id": "i3",
            "title": "Back Rank Mate",
            "description": "Exploit the weakness of the back rank",
            "difficulty": "intermediate",
            "time_limit": 6,
            "rating": 1100,
            "moves": ["Rd8+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Rd8#",
            "hints": ["The king has no escape squares", "Your rook can deliver mate"],
            "category": "tactics"
        },
        {
            "id": "i4",
            "title": "Double Attack",
            "description": "Create two threats simultaneously",
            "difficulty": "intermediate",
            "time_limit": 7,
            "rating": 1250,
            "moves": ["Nd5"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Nd5",
            "hints": ["One move, two threats", "Your knight is very active"],
            "category": "tactics"
        },
        
        # Advanced puzzles
        {
            "id": "a1",
            "title": "Checkmate in 3",
            "description": "Find the precise sequence to force checkmate in 3 moves",
            "difficulty": "advanced",
            "time_limit": 15,
            "rating": 1600,
            "moves": ["Qd8+", "Kh7", "Qh8+", "Kg6", "Qh6#"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Qd8+ Kh7 Qh8+ Kg6 Qh6#",
            "hints": ["Force the king to a specific square", "Look for a mating net", "Calculate all opponent responses"],
            "category": "tactics"
        },
        {
            "id": "a2",
            "title": "Complex Sacrifice",
            "description": "Sacrifice material for a winning attack",
            "difficulty": "advanced",
            "time_limit": 12,
            "rating": 1750,
            "moves": ["Rxh7+", "Kxh7", "Qh5+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Rxh7+ Kxh7 Qh5+ Kg8 Bxg7",
            "hints": ["Material is less important than king safety", "Open lines to the king", "Calculate the entire sequence"],
            "category": "tactics"
        },
        {
            "id": "a3",
            "title": "Endgame Technique",
            "description": "Convert your advantage in the endgame",
            "difficulty": "advanced",
            "time_limit": 20,
            "rating": 1500,
            "moves": ["Kf6", "Kf8", "g6"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Kf6 Kf8 g6 Ke8 g7",
            "hints": ["King and pawn vs king requires precise technique", "Opposition is key", "Support your pawn advance"],
            "category": "endgame"
        },
        {
            "id": "a4",
            "title": "Positional Masterpiece",
            "description": "Find the quiet move that improves your position decisively",
            "difficulty": "advanced",
            "time_limit": 18,
            "rating": 1650,
            "moves": ["Re8+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Re8+",
            "hints": ["Not all winning moves are captures or checks", "Improve piece coordination", "Look for long-term advantages"],
            "category": "strategy"
        },
        {
            "id": "a5",
            "title": "Multi-Piece Coordination",
            "description": "Coordinate multiple pieces for a devastating attack",
            "difficulty": "advanced",
            "time_limit": 25,
            "rating": 1800,
            "moves": ["Nf7", "Qxf7", "Bxf7+"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "Nf7 Qxf7 Bxf7+ Kh8 Ng6#",
            "hints": ["All pieces must work together", "Create multiple threats", "Force opponent into bad moves"],
            "category": "tactics"
        },
        {
            "id": "a6",
            "title": "Strategic Breakthrough",
            "description": "Break through a solid defensive position",
            "difficulty": "advanced",
            "time_limit": 22,
            "rating": 1700,
            "moves": ["f4", "exf4", "e5"],
            "position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            "solution": "f4 exf4 e5 dxe5 d6",
            "hints": ["Pawn breaks can shatter defenses", "Create weaknesses in opponent structure", "Think strategically, not just tactically"],
            "category": "strategy"
        }
    ]
    
    # Insert sample puzzles
    for puzzle_data in sample_puzzles:
        puzzle = PuzzleModel(**puzzle_data)
        await PuzzleDatabase.create_puzzle(puzzle)
    
    print(f"Initialized database with {len(sample_puzzles)} sample puzzles")