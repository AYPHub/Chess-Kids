import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  RotateCcw, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Timer, 
  Star,
  Eye,
  Undo2
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAPI, useFetch } from '../hooks/useAPI';
import ChessBoardAdvanced from './ChessBoardAdvanced';
import { puzzleAPI, gameAPI } from '../services/api';
import LoadingSpinner, { LoadingCard } from './LoadingSpinner';
import { ErrorCard } from './ErrorBoundary';

const ChessGame = () => {
  const { puzzleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleAPICall } = useAPI();
  
  // Fetch puzzle data
  const { data: puzzle, isLoading: puzzleLoading, error: puzzleError, refetch } = 
    useFetch(() => puzzleAPI.getById(puzzleId), [puzzleId]);

  const [gameState, setGameState] = useState({
    gameStatus: 'playing', // playing, solved, failed
    hintsUsed: 0,
    timeSpent: 0,
    movesPlayed: 0,
    currentPosition: null,
    solutionProgress: 0
  });

  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!puzzle) return;

    // Initialize game state
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      timeSpent: 0,
      hintsUsed: 0,
      movesPlayed: 0,
      currentPosition: puzzle.position,
      solutionProgress: 0
    }));

    // Load saved game state if exists
    loadSavedGameState();

    // Start timer
    const newTimer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);
    
    setTimer(newTimer);

    return () => {
      if (newTimer) clearInterval(newTimer);
    };
  }, [puzzle]);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const loadSavedGameState = async () => {
    const result = await handleAPICall(
      () => gameAPI.load(puzzleId),
      { showToast: false }
    );
    
    if (result.data) {
      const savedState = result.data;
      setGameState(prev => ({
        ...prev,
        timeSpent: savedState.time_spent || 0,
        hintsUsed: savedState.hints_used || 0,
        movesPlayed: savedState.move_history?.length || 0
      }));
    }
  };

  const saveGameState = async (moveHistory, hintsUsed) => {
    const gameStateToSave = {
      puzzle_id: puzzleId,
      board: [], // Will be managed by chess engine
      move_history: moveHistory || [],
      time_spent: gameState.timeSpent,
      hints_used: hintsUsed || gameState.hintsUsed
    };

    await handleAPICall(
      () => gameAPI.save(gameStateToSave),
      { showToast: false }
    );
  };

  const handleChessMove = (moveData) => {
    const { move, isSolutionMove, position, gameOver, inCheck, inCheckmate } = moveData;
    
    setGameState(prev => ({
      ...prev,
      movesPlayed: prev.movesPlayed + 1,
      currentPosition: position
    }));

    // Auto-save game state
    saveGameState([move], gameState.hintsUsed);

    // Check win conditions
    if (inCheckmate || gameOver) {
      handlePuzzleCompletion(true);
    }
  };

  const handlePuzzleCompletion = async (solved) => {
    // Clear timer
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    setGameState(prev => ({ 
      ...prev, 
      gameStatus: solved ? 'solved' : 'failed' 
    }));
    
    if (solved) {
      // Submit completion to backend
      const attemptData = {
        time_spent: gameState.timeSpent,
        moves_used: gameState.movesPlayed,
        hints_used: gameState.hintsUsed,
        successful: true
      };
      
      const result = await handleAPICall(
        () => puzzleAPI.markComplete(puzzleId, attemptData),
        {
          successMessage: `🎉 Great job! You solved "${puzzle.title}" in ${formatTime(gameState.timeSpent)}!`,
          errorMessage: 'Failed to save puzzle completion'
        }
      );
    }
  };

  const showHint = () => {
    if (!puzzle || gameState.hintsUsed >= puzzle.hints.length) return;
    
    const newHintsUsed = gameState.hintsUsed + 1;
    
    setGameState(prev => ({
      ...prev,
      hintsUsed: newHintsUsed
    }));

    toast({
      title: "💡 Hint",
      description: puzzle.hints[gameState.hintsUsed],
      duration: 8000,
    });

    // Save updated hints count
    saveGameState([], newHintsUsed);
  };

  const undoMove = () => {
    if (window.chessBoard && window.chessBoard.undo) {
      const success = window.chessBoard.undo();
      if (success) {
        setGameState(prev => ({
          ...prev,
          movesPlayed: Math.max(0, prev.movesPlayed - 1)
        }));
      }
    }
  };

  const resetPuzzle = () => {
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }

    // Reset chess board
    if (window.chessBoard && window.chessBoard.reset) {
      window.chessBoard.reset();
    }

    // Reset game state
    setGameState({
      gameStatus: 'playing',
      hintsUsed: 0,
      timeSpent: 0,
      movesPlayed: 0,
      currentPosition: puzzle?.position || null,
      solutionProgress: 0
    });

    // Start new timer
    const newTimer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);
    
    setTimer(newTimer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (puzzleLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <LoadingCard>Loading chess puzzle...</LoadingCard>
      </div>
    );
  }

  // Error state
  if (puzzleError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ErrorCard error={puzzleError} onRetry={refetch} />
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ErrorCard 
          error={{ message: 'Puzzle not found' }} 
          onRetry={() => navigate('/puzzles')} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/puzzles')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Puzzles</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{puzzle.title}</h1>
            <p className="text-gray-600">{puzzle.description}</p>
            <p className="text-sm text-gray-500 mt-1">Category: {puzzle.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={
            puzzle.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            puzzle.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
            'bg-red-100 text-red-700'
          }>
            {puzzle.difficulty}
          </Badge>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 mr-1" />
            {puzzle.rating}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chess Board */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <ChessBoardAdvanced
              puzzle={puzzle}
              onMove={handleChessMove}
              onPuzzleSolved={(data) => handlePuzzleCompletion(data.solved)}
              gameStatus={gameState.gameStatus}
              hintsUsed={gameState.hintsUsed}
            />
          </Card>
        </div>

        {/* Game Controls */}
        <div className="space-y-4">
          {/* Time and Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Timer className="h-5 w-5 mr-2" />
                Game Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Time</span>
                  <span className="font-mono">{formatTime(gameState.timeSpent)}</span>
                </div>
                <Progress value={Math.min(100, (gameState.timeSpent / (puzzle.time_limit * 60)) * 100)} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Moves</span>
                  <span>{gameState.movesPlayed}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Hints Used</span>
                  <span>{gameState.hintsUsed}/{puzzle.hints.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Puzzle Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Puzzle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Time Limit:</span> {puzzle.time_limit} minutes
              </div>
              <div className="text-sm">
                <span className="font-medium">Rating:</span> {puzzle.rating}
              </div>
              <div className="text-sm">
                <span className="font-medium">Type:</span> {puzzle.category}
              </div>
              <div className="text-sm">
                <span className="font-medium">Difficulty:</span>{' '}
                <span className="capitalize">{puzzle.difficulty}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={showHint}
                className="w-full"
                variant="outline"
                disabled={gameState.hintsUsed >= puzzle.hints.length || gameState.gameStatus === 'solved'}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Get Hint ({gameState.hintsUsed}/{puzzle.hints.length})
              </Button>
              
              <Button 
                onClick={undoMove}
                className="w-full"
                variant="outline"
                disabled={gameState.movesPlayed === 0 || gameState.gameStatus === 'solved'}
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Undo Move
              </Button>
              
              <Button 
                onClick={resetPuzzle}
                className="w-full"
                variant="outline"
                disabled={gameState.gameStatus === 'solved'}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Puzzle
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          {gameState.gameStatus === 'solved' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">Puzzle Solved!</h3>
                  <p className="text-sm text-green-600 mb-2">
                    Completed in {formatTime(gameState.timeSpent)}
                  </p>
                  <p className="text-xs text-green-600 mb-4">
                    {gameState.movesPlayed} moves • {gameState.hintsUsed} hints used
                  </p>
                  <Button 
                    onClick={() => navigate('/puzzles')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Next Puzzle
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solution Hints */}
          {puzzle.hints && puzzle.hints.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Available Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {puzzle.hints.slice(0, gameState.hintsUsed).map((hint, index) => (
                    <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                      <strong>Hint {index + 1}:</strong> {hint}
                    </div>
                  ))}
                  {gameState.hintsUsed === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      Click "Get Hint" to reveal helpful tips!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;

  // Loading state
  if (puzzleLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <LoadingCard>Loading puzzle...</LoadingCard>
      </div>
    );
  }

  // Error state
  if (puzzleError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ErrorCard error={puzzleError} onRetry={refetch} />
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ErrorCard 
          error={{ message: 'Puzzle not found' }} 
          onRetry={() => navigate('/puzzles')} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/puzzles')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Puzzles</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{puzzle.title}</h1>
            <p className="text-gray-600">{puzzle.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={
            puzzle.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            puzzle.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
            'bg-red-100 text-red-700'
          }>
            {puzzle.difficulty}
          </Badge>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 mr-1" />
            {puzzle.rating}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chess Board */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <ChessBoard
              board={gameState.board}
              selectedSquare={gameState.selectedSquare}
              validMoves={gameState.validMoves}
              onSquareClick={handleSquareClick}
              gameStatus={gameState.gameStatus}
            />
          </Card>
        </div>

        {/* Game Controls */}
        <div className="space-y-4">
          {/* Time and Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Timer className="h-5 w-5 mr-2" />
                Game Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Time</span>
                  <span className="font-mono">{formatTime(gameState.timeSpent)}</span>
                </div>
                <Progress value={(gameState.timeSpent / (puzzle.time_limit * 60)) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Moves</span>
                  <span>{gameState.moveHistory.length}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Hints Used</span>
                  <span>{gameState.hintsUsed}/{puzzle.hints.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={showHint}
                className="w-full"
                variant="outline"
                disabled={gameState.hintsUsed >= puzzle.hints.length || gameState.gameStatus === 'solved'}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Get Hint ({gameState.hintsUsed}/{puzzle.hints.length})
              </Button>
              
              <Button 
                onClick={undoMove}
                className="w-full"
                variant="outline"
                disabled={gameState.moveHistory.length === 0}
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Undo Move
              </Button>
              
              <Button 
                onClick={resetPuzzle}
                className="w-full"
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Puzzle
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          {gameState.gameStatus === 'solved' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">Puzzle Solved!</h3>
                  <p className="text-sm text-green-600 mb-4">
                    Completed in {formatTime(gameState.timeSpent)}
                  </p>
                  <Button 
                    onClick={() => navigate('/puzzles')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Next Puzzle
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Move History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Move History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {gameState.moveHistory.length === 0 ? (
                  <p className="text-sm text-gray-500">No moves yet</p>
                ) : (
                  gameState.moveHistory.map((move, index) => (
                    <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {index + 1}. {move.notation}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;