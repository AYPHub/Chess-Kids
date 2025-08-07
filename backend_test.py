#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Chess Puzzles Application
Tests all endpoints with realistic chess puzzle data and scenarios
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading backend URL: {e}")
        return "http://localhost:8001"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

class ChessPuzzleAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.puzzle_ids = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
        
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = self.session.get(f"{API_URL}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, f"API is healthy: {data.get('message')}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_get_all_puzzles(self):
        """Test getting all puzzles"""
        try:
            response = self.session.get(f"{API_URL}/puzzles", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                puzzles = data.get("puzzles", [])
                
                if len(puzzles) == 14:  # Expected 14 puzzles
                    # Store puzzle IDs for later tests
                    self.puzzle_ids = [p["id"] for p in puzzles]
                    
                    # Verify puzzle structure
                    sample_puzzle = puzzles[0]
                    required_fields = ["id", "title", "description", "difficulty", "time_limit", 
                                     "rating", "moves", "position", "solution", "hints", "category"]
                    
                    missing_fields = [field for field in required_fields if field not in sample_puzzle]
                    if not missing_fields:
                        self.log_test("Get All Puzzles", True, f"Found {len(puzzles)} puzzles with correct structure")
                        return True
                    else:
                        self.log_test("Get All Puzzles", False, f"Missing fields: {missing_fields}")
                        return False
                else:
                    self.log_test("Get All Puzzles", False, f"Expected 14 puzzles, got {len(puzzles)}")
                    return False
            else:
                self.log_test("Get All Puzzles", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get All Puzzles", False, f"Exception: {str(e)}")
            return False
    
    def test_filter_puzzles_by_difficulty(self):
        """Test filtering puzzles by difficulty"""
        difficulties = ["beginner", "intermediate", "advanced"]
        expected_counts = {"beginner": 4, "intermediate": 4, "advanced": 6}
        
        all_passed = True
        
        for difficulty in difficulties:
            try:
                response = self.session.get(f"{API_URL}/puzzles?difficulty={difficulty}", timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    puzzles = data.get("puzzles", [])
                    expected_count = expected_counts[difficulty]
                    
                    if len(puzzles) == expected_count:
                        # Verify all puzzles have correct difficulty
                        correct_difficulty = all(p["difficulty"] == difficulty for p in puzzles)
                        if correct_difficulty:
                            self.log_test(f"Filter by {difficulty.title()}", True, 
                                        f"Found {len(puzzles)} {difficulty} puzzles")
                        else:
                            self.log_test(f"Filter by {difficulty.title()}", False, 
                                        "Some puzzles have incorrect difficulty")
                            all_passed = False
                    else:
                        self.log_test(f"Filter by {difficulty.title()}", False, 
                                    f"Expected {expected_count}, got {len(puzzles)}")
                        all_passed = False
                else:
                    self.log_test(f"Filter by {difficulty.title()}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Filter by {difficulty.title()}", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_get_specific_puzzle(self):
        """Test getting specific puzzle by ID"""
        if not self.puzzle_ids:
            self.log_test("Get Specific Puzzle", False, "No puzzle IDs available")
            return False
        
        # Test with first puzzle ID
        puzzle_id = self.puzzle_ids[0]
        
        try:
            response = self.session.get(f"{API_URL}/puzzles/{puzzle_id}", timeout=10)
            
            if response.status_code == 200:
                puzzle = response.json()
                
                if puzzle.get("id") == puzzle_id:
                    required_fields = ["id", "title", "description", "difficulty", "completed"]
                    missing_fields = [field for field in required_fields if field not in puzzle]
                    
                    if not missing_fields:
                        self.log_test("Get Specific Puzzle", True, 
                                    f"Retrieved puzzle '{puzzle.get('title')}' successfully")
                        return True
                    else:
                        self.log_test("Get Specific Puzzle", False, f"Missing fields: {missing_fields}")
                        return False
                else:
                    self.log_test("Get Specific Puzzle", False, "Returned puzzle has wrong ID")
                    return False
            else:
                self.log_test("Get Specific Puzzle", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Specific Puzzle", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_puzzle_id(self):
        """Test error handling for invalid puzzle ID"""
        invalid_id = "invalid_puzzle_id_12345"
        
        try:
            response = self.session.get(f"{API_URL}/puzzles/{invalid_id}", timeout=10)
            
            if response.status_code == 404:
                self.log_test("Invalid Puzzle ID Error Handling", True, "Correctly returned 404 for invalid ID")
                return True
            else:
                self.log_test("Invalid Puzzle ID Error Handling", False, 
                            f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Puzzle ID Error Handling", False, f"Exception: {str(e)}")
            return False
    
    def test_complete_puzzle(self):
        """Test puzzle completion"""
        if not self.puzzle_ids:
            self.log_test("Complete Puzzle", False, "No puzzle IDs available")
            return False
        
        puzzle_id = self.puzzle_ids[0]  # Use first beginner puzzle
        
        # Realistic puzzle attempt data
        attempt_data = {
            "time_spent": 45,  # 45 seconds
            "moves_used": 3,
            "hints_used": 1,
            "successful": True
        }
        
        try:
            response = self.session.post(f"{API_URL}/puzzles/{puzzle_id}/complete", 
                                       json=attempt_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Should return updated progress
                if "total_puzzles_solved" in result and result["total_puzzles_solved"] >= 1:
                    self.log_test("Complete Puzzle", True, 
                                f"Puzzle completed successfully, total solved: {result['total_puzzles_solved']}")
                    return True
                else:
                    self.log_test("Complete Puzzle", False, "Invalid progress response")
                    return False
            else:
                self.log_test("Complete Puzzle", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Complete Puzzle", False, f"Exception: {str(e)}")
            return False
    
    def test_get_progress(self):
        """Test getting user progress"""
        try:
            response = self.session.get(f"{API_URL}/progress", timeout=10)
            
            if response.status_code == 200:
                progress = response.json()
                
                required_fields = ["total_puzzles_solved", "total_puzzles", "beginners_solved", 
                                 "intermediate_solved", "advanced_solved", "average_rating", 
                                 "streak", "achievements", "recent_activity"]
                
                missing_fields = [field for field in required_fields if field not in progress]
                
                if not missing_fields:
                    # Verify data types and ranges
                    if (isinstance(progress["total_puzzles"], int) and 
                        progress["total_puzzles"] == 14 and
                        isinstance(progress["achievements"], list)):
                        
                        self.log_test("Get Progress", True, 
                                    f"Progress retrieved: {progress['total_puzzles_solved']}/{progress['total_puzzles']} puzzles")
                        return True
                    else:
                        self.log_test("Get Progress", False, "Invalid data types or values")
                        return False
                else:
                    self.log_test("Get Progress", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Get Progress", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Progress", False, f"Exception: {str(e)}")
            return False
    
    def test_award_achievement(self):
        """Test manually awarding achievement"""
        achievement_data = {
            "achievement_id": "first_puzzle"
        }
        
        try:
            response = self.session.post(f"{API_URL}/progress/achievement", 
                                       json=achievement_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Should return updated progress with achievement
                achievements = result.get("achievements", [])
                first_puzzle_achievement = next((a for a in achievements if a["id"] == "first_puzzle"), None)
                
                if first_puzzle_achievement and first_puzzle_achievement.get("earned"):
                    self.log_test("Award Achievement", True, "First puzzle achievement awarded successfully")
                    return True
                else:
                    self.log_test("Award Achievement", False, "Achievement not found in response")
                    return False
            else:
                self.log_test("Award Achievement", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Award Achievement", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_achievement(self):
        """Test error handling for invalid achievement"""
        achievement_data = {
            "achievement_id": "invalid_achievement_xyz"
        }
        
        try:
            response = self.session.post(f"{API_URL}/progress/achievement", 
                                       json=achievement_data, timeout=10)
            
            if response.status_code == 400:
                self.log_test("Invalid Achievement Error Handling", True, "Correctly returned 400 for invalid achievement")
                return True
            else:
                self.log_test("Invalid Achievement Error Handling", False, 
                            f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Invalid Achievement Error Handling", False, f"Exception: {str(e)}")
            return False
    
    def test_save_game_state(self):
        """Test saving game state"""
        if not self.puzzle_ids:
            self.log_test("Save Game State", False, "No puzzle IDs available")
            return False
        
        puzzle_id = self.puzzle_ids[1]  # Use second puzzle
        
        # Realistic chess board state and game data
        game_state_data = {
            "puzzle_id": puzzle_id,
            "board": [
                ["r", "n", "b", "q", "k", "b", "n", "r"],
                ["p", "p", "p", "p", None, "p", "p", "p"],
                [None, None, None, None, None, None, None, None],
                [None, None, None, None, "p", None, None, None],
                [None, None, None, None, "P", None, None, None],
                [None, None, None, None, None, None, None, None],
                ["P", "P", "P", "P", None, "P", "P", "P"],
                ["R", "N", "B", "Q", "K", "B", "N", "R"]
            ],
            "move_history": [
                {"from": "e2", "to": "e4", "piece": "P", "timestamp": "2024-01-15T10:30:00Z"},
                {"from": "e7", "to": "e5", "piece": "p", "timestamp": "2024-01-15T10:30:15Z"}
            ],
            "time_spent": 120,  # 2 minutes
            "hints_used": 0
        }
        
        try:
            response = self.session.post(f"{API_URL}/game/save", 
                                       json=game_state_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("message") == "Game state saved successfully":
                    self.log_test("Save Game State", True, "Game state saved successfully")
                    return True
                else:
                    self.log_test("Save Game State", False, f"Unexpected response: {result}")
                    return False
            else:
                self.log_test("Save Game State", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Save Game State", False, f"Exception: {str(e)}")
            return False
    
    def test_load_game_state(self):
        """Test loading saved game state"""
        if not self.puzzle_ids:
            self.log_test("Load Game State", False, "No puzzle IDs available")
            return False
        
        puzzle_id = self.puzzle_ids[1]  # Same puzzle we saved state for
        
        try:
            response = self.session.get(f"{API_URL}/game/{puzzle_id}", timeout=10)
            
            if response.status_code == 200:
                game_state = response.json()
                
                required_fields = ["puzzle_id", "board", "move_history", "time_spent", "hints_used"]
                missing_fields = [field for field in required_fields if field not in game_state]
                
                if not missing_fields:
                    if (game_state["puzzle_id"] == puzzle_id and 
                        isinstance(game_state["board"], list) and
                        len(game_state["board"]) == 8):
                        
                        self.log_test("Load Game State", True, 
                                    f"Game state loaded for puzzle {puzzle_id}")
                        return True
                    else:
                        self.log_test("Load Game State", False, "Invalid game state data")
                        return False
                else:
                    self.log_test("Load Game State", False, f"Missing fields: {missing_fields}")
                    return False
            else:
                self.log_test("Load Game State", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Load Game State", False, f"Exception: {str(e)}")
            return False
    
    def test_load_nonexistent_game_state(self):
        """Test loading game state that doesn't exist"""
        nonexistent_puzzle_id = "nonexistent_puzzle_123"
        
        try:
            response = self.session.get(f"{API_URL}/game/{nonexistent_puzzle_id}", timeout=10)
            
            if response.status_code == 404:
                self.log_test("Load Nonexistent Game State", True, "Correctly returned 404 for nonexistent game state")
                return True
            else:
                self.log_test("Load Nonexistent Game State", False, 
                            f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Load Nonexistent Game State", False, f"Exception: {str(e)}")
            return False
    
    def test_save_game_state_missing_fields(self):
        """Test saving game state with missing required fields"""
        incomplete_data = {
            "puzzle_id": "test_puzzle",
            "board": [],
            # Missing move_history, time_spent, hints_used
        }
        
        try:
            response = self.session.post(f"{API_URL}/game/save", 
                                       json=incomplete_data, timeout=10)
            
            if response.status_code == 400:
                self.log_test("Save Game State Missing Fields", True, "Correctly returned 400 for missing fields")
                return True
            else:
                self.log_test("Save Game State Missing Fields", False, 
                            f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Save Game State Missing Fields", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"\n🚀 Starting Chess Puzzles Backend API Tests")
        print(f"📍 Testing API at: {API_URL}")
        print("=" * 60)
        
        # Core functionality tests
        tests = [
            self.test_health_check,
            self.test_get_all_puzzles,
            self.test_filter_puzzles_by_difficulty,
            self.test_get_specific_puzzle,
            self.test_invalid_puzzle_id,
            self.test_complete_puzzle,
            self.test_get_progress,
            self.test_award_achievement,
            self.test_invalid_achievement,
            self.test_save_game_state,
            self.test_load_game_state,
            self.test_load_nonexistent_game_state,
            self.test_save_game_state_missing_fields
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
                time.sleep(0.5)  # Small delay between tests
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected error: {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Chess Puzzles Backend API is working correctly.")
        else:
            print(f"⚠️  {total - passed} tests failed. Please check the issues above.")
        
        return passed == total

def main():
    """Main test execution"""
    tester = ChessPuzzleAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "base_url": BASE_URL,
            "api_url": API_URL,
            "total_tests": len(tester.test_results),
            "passed_tests": sum(1 for r in tester.test_results if r["success"]),
            "results": tester.test_results
        }, f, indent=2)
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)