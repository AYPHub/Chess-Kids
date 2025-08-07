import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from puzzle_data import CHESS_PUZZLES
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_puzzles():
    """Seed the database with comprehensive chess puzzles"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    puzzles_collection = db.puzzles
    
    print(f"🔄 Starting to seed {len(CHESS_PUZZLES)} chess puzzles...")
    
    # Clear existing puzzles
    await puzzles_collection.delete_many({})
    print("🗑️  Cleared existing puzzles")
    
    # Insert new puzzles
    puzzles_to_insert = []
    
    for puzzle_data in CHESS_PUZZLES:
        puzzle = {
            "id": puzzle_data["id"],
            "title": puzzle_data["title"],
            "description": puzzle_data["description"], 
            "difficulty": puzzle_data["difficulty"],
            "time_limit": puzzle_data["time_limit"],
            "rating": puzzle_data["rating"],
            "moves": puzzle_data["solution"],  # Store as moves array
            "position": puzzle_data["fen"],    # FEN position
            "solution": " ".join(puzzle_data["solution"]),  # Solution as string
            "hints": puzzle_data["hints"],
            "category": puzzle_data["category"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        puzzles_to_insert.append(puzzle)
    
    # Batch insert
    result = await puzzles_collection.insert_many(puzzles_to_insert)
    
    print(f"✅ Successfully inserted {len(result.inserted_ids)} puzzles!")
    
    # Print summary
    difficulty_counts = {}
    category_counts = {}
    
    for puzzle in CHESS_PUZZLES:
        difficulty = puzzle["difficulty"]
        category = puzzle["category"]
        
        difficulty_counts[difficulty] = difficulty_counts.get(difficulty, 0) + 1
        category_counts[category] = category_counts.get(category, 0) + 1
    
    print("\n📊 Puzzle Distribution:")
    print("By Difficulty:")
    for difficulty, count in difficulty_counts.items():
        print(f"  {difficulty.capitalize()}: {count} puzzles")
    
    print("\nBy Category:")
    for category, count in category_counts.items():
        print(f"  {category.capitalize()}: {count} puzzles")
    
    # Close connection
    client.close()
    print("\n🎉 Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_puzzles())