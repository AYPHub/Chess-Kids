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
import ChessBoard from './ChessBoard';
import { mockPuzzles, initialChessBoard } from '../data/mock';

const ChessGame = () => {
  const { puzzleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const puzzle = mockPuzzles.find(p => p.id === puzzleId);
  const [gameState, setGameState] = useState({
    board: initialChessBoard,
    currentTurn: 'white',
    moveHistory: [],
    selectedSquare: null,
    validMoves: [],
    gameStatus: 'playing', // playing, solved, failed
    hintsUsed: 0,
    timeSpent: 0,
    showHint: false
  });

  useEffect(() => {
    if (!puzzle) {
      navigate('/puzzles');
      return;
    }

    // Initialize puzzle-specific board state
    setGameState(prev => ({
      ...prev,
      // In a real app, this would parse the FEN position
      board: initialChessBoard,
      timeSpent: 0
    }));

    // Start timer
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [puzzle, navigate]);

  const handleSquareClick = (row, col) => {
    const { board, selectedSquare, validMoves, currentTurn } = gameState;
    const piece = board[row][col];

    // If no square is selected, select this square if it has a piece
    if (!selectedSquare) {
      if (piece && ((currentTurn === 'white' && piece === piece.toUpperCase()) ||
                    (currentTurn === 'black' && piece === piece.toLowerCase()))) {
        setGameState(prev => ({
          ...prev,
          selectedSquare: [row, col],
          validMoves: getValidMovesForPiece(board, row, col)
        }));
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare[0] === row && selectedSquare[1] === col) {
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: []
      }));
      return;
    }

    // Check if this is a valid move
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
    
    if (isValidMove) {
      makeMove(selectedSquare, [row, col]);
    } else {
      // Select new piece if it belongs to current player
      if (piece && ((currentTurn === 'white' && piece === piece.toUpperCase()) ||
                    (currentTurn === 'black' && piece === piece.toLowerCase()))) {
        setGameState(prev => ({
          ...prev,
          selectedSquare: [row, col],
          validMoves: getValidMovesForPiece(board, row, col)
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          selectedSquare: null,
          validMoves: []
        }));
      }
    }
  };

  const makeMove = (from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    
    // Make the move
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    const moveNotation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}-${String.fromCharCode(97 + toCol)}${8 - toRow}`;
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentTurn: prev.currentTurn === 'white' ? 'black' : 'white',
      moveHistory: [...prev.moveHistory, { from, to, piece, notation: moveNotation }],
      selectedSquare: null,
      validMoves: []
    }));

    // Check if puzzle is solved (simplified)
    checkPuzzleSolution(moveNotation);
  };

  const getValidMovesForPiece = (board, row, col) => {
    // Simplified move generation for demo
    const moves = [];
    const piece = board[row][col];
    
    if (!piece) return moves;
    
    // Basic moves for demonstration
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol];
        
        // Can move to empty square or capture opponent
        if (!targetPiece || 
            (piece === piece.toUpperCase() && targetPiece === targetPiece.toLowerCase()) ||
            (piece === piece.toLowerCase() && targetPiece === targetPiece.toUpperCase())) {
          moves.push([newRow, newCol]);
        }
      }
    });
    
    return moves;
  };

  const checkPuzzleSolution = (move) => {
    // Simplified solution checking
    if (puzzle.solution.includes(move) || gameState.moveHistory.length >= 2) {
      setGameState(prev => ({ ...prev, gameStatus: 'solved' }));
      toast({
        title: "Puzzle Solved! 🎉",
        description: `Great job! You solved "${puzzle.title}" in ${formatTime(gameState.timeSpent)}`,
      });
    }
  };

  const undoMove = () => {
    if (gameState.moveHistory.length === 0) return;
    
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const newBoard = gameState.board.map(row => [...row]);
    
    // Undo the move
    const [fromRow, fromCol] = lastMove.from;
    const [toRow, toCol] = lastMove.to;
    
    newBoard[fromRow][fromCol] = lastMove.piece;
    newBoard[toRow][toCol] = null; // Simplified - doesn't handle captures
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentTurn: prev.currentTurn === 'white' ? 'black' : 'white',
      moveHistory: prev.moveHistory.slice(0, -1),
      selectedSquare: null,
      validMoves: []
    }));
  };

  const showHint = () => {
    if (gameState.hintsUsed >= puzzle.hints.length) return;
    
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      showHint: true
    }));

    toast({
      title: "Hint",
      description: puzzle.hints[gameState.hintsUsed],
    });
  };

  const resetPuzzle = () => {
    setGameState({
      board: initialChessBoard,
      currentTurn: 'white',
      moveHistory: [],
      selectedSquare: null,
      validMoves: [],
      gameStatus: 'playing',
      hintsUsed: 0,
      timeSpent: 0,
      showHint: false
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!puzzle) return null;

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
          <Badge className={puzzle.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
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
                <Progress value={(gameState.timeSpent / (puzzle.timeLimit * 60)) * 100} />
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