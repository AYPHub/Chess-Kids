import React, { useState, useEffect } from 'react';
import { ChessEngine } from '../utils/chessEngine';

const ChessBoardAdvanced = ({ 
  puzzle,
  onMove,
  onPuzzleSolved,
  gameStatus,
  hintsUsed
}) => {
  const [chessEngine] = useState(() => new ChessEngine());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [boardState, setBoardState] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);

  // Initialize board when puzzle changes
  useEffect(() => {
    if (!puzzle) {
      console.log('No puzzle provided to ChessBoardAdvanced');
      return;
    }

    if (!puzzle.position) {
      console.warn('Puzzle has no position field:', puzzle);
      // Use default starting position if no FEN provided
      const success = chessEngine.loadPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      if (success) {
        updateBoardDisplay();
        setMoveHistory([]);
        setSelectedSquare(null);
        setValidMoves([]);
      }
      return;
    }

    console.log('Loading puzzle position:', puzzle.position);
    const success = chessEngine.loadPosition(puzzle.position);
    if (success) {
      updateBoardDisplay();
      setMoveHistory([]);
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      console.error('Failed to load puzzle position:', puzzle.position);
      // Fallback to default position
      const fallbackSuccess = chessEngine.loadPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      if (fallbackSuccess) {
        updateBoardDisplay();
        setMoveHistory([]);
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  }, [puzzle]);

  const updateBoardDisplay = () => {
    try {
      const board = chessEngine.getBoard();
      setBoardState(board);
    } catch (error) {
      console.error('Error updating board display:', error);
      // Set empty board as fallback
      setBoardState(Array(8).fill(null).map(() => Array(8).fill(null)));
    }
  };

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing') return;

    const square = ChessEngine.coordsToSquare(row, col);
    const piece = boardState[row][col];

    // If no square is selected
    if (!selectedSquare) {
      if (piece && isPieceOwnedByCurrentPlayer(piece)) {
        setSelectedSquare(square);
        const moves = chessEngine.getLegalMoves(square);
        setValidMoves(moves.map(move => move.to));
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Try to make a move
    const move = {
      from: selectedSquare,
      to: square
    };

    const result = chessEngine.makeMove(move);
    
    if (result) {
      // Valid move made
      updateBoardDisplay();
      setSelectedSquare(null);
      setValidMoves([]);
      
      const newMoveHistory = [...moveHistory, result];
      setMoveHistory(newMoveHistory);
      
      // Check if move is part of solution
      const isSolutionMove = chessEngine.checkSolution(result, puzzle.moves);
      
      // Notify parent component
      if (onMove) {
        onMove({
          move: result,
          isSolutionMove,
          position: chessEngine.getFEN(),
          gameOver: chessEngine.isGameOver(),
          inCheck: chessEngine.inCheck(),
          inCheckmate: chessEngine.inCheckmate()
        });
      }

      // Check if puzzle is solved
      if (isSolutionMove && checkPuzzleCompletion(result, newMoveHistory)) {
        if (onPuzzleSolved) {
          onPuzzleSolved({
            solved: true,
            moves: newMoveHistory,
            finalPosition: chessEngine.getFEN()
          });
        }
      }
    } else {
      // Invalid move, try selecting new piece
      if (piece && isPieceOwnedByCurrentPlayer(piece)) {
        setSelectedSquare(square);
        const moves = chessEngine.getLegalMoves(square);
        setValidMoves(moves.map(move => move.to));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  const isPieceOwnedByCurrentPlayer = (piece) => {
    if (!piece) return false;
    const currentTurn = chessEngine.getTurn();
    const pieceColor = piece.charAt(0); // 'w' or 'b'
    return currentTurn === pieceColor;
  };

  const checkPuzzleCompletion = (lastMove, history) => {
    // Simple completion check - can be made more sophisticated
    if (chessEngine.inCheckmate()) {
      return true;
    }
    
    // Check if the move sequence matches the solution
    if (puzzle.moves && puzzle.moves.length > 0) {
      const solutionMoves = puzzle.moves;
      const playedMoves = history.map(move => move.san);
      
      // Check if we've played all solution moves correctly
      return playedMoves.length >= solutionMoves.length &&
             solutionMoves.every((solMove, index) => 
               playedMoves[index] && 
               (playedMoves[index] === solMove || 
                playedMoves[index].replace(/[+#]/, '') === solMove.replace(/[+#]/, ''))
             );
    }
    
    return false;
  };

  const undoLastMove = () => {
    const undone = chessEngine.undoMove();
    if (undone) {
      updateBoardDisplay();
      setMoveHistory(prev => prev.slice(0, -1));
      setSelectedSquare(null);
      setValidMoves([]);
      return true;
    }
    return false;
  };

  const resetPosition = () => {
    if (!puzzle) return;
    
    if (puzzle.position) {
      const success = chessEngine.loadPosition(puzzle.position);
      if (!success) {
        // Fallback to default position
        chessEngine.loadPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      }
    } else {
      // Use default position if no puzzle position
      chessEngine.loadPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }
    
    updateBoardDisplay();
    setMoveHistory([]);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  // Expose methods to parent
  useEffect(() => {
    if (window.chessBoard) {
      window.chessBoard.undo = undoLastMove;
      window.chessBoard.reset = resetPosition;
    }
  });

  const isSquareLight = (row, col) => (row + col) % 2 === 0;
  const isSquareSelected = (row, col) => {
    const square = ChessEngine.coordsToSquare(row, col);
    return selectedSquare === square;
  };
  const isValidMoveSquare = (row, col) => {
    const square = ChessEngine.coordsToSquare(row, col);
    return validMoves.includes(square);
  };

  const getSquareClasses = (row, col) => {
    let classes = "w-16 h-16 flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 relative ";
    
    if (isSquareLight(row, col)) {
      classes += "bg-amber-100 hover:bg-amber-200 ";
    } else {
      classes += "bg-amber-800 hover:bg-amber-700 ";
    }

    if (isSquareSelected(row, col)) {
      classes += "ring-4 ring-blue-400 ring-inset ";
    }

    if (isValidMoveSquare(row, col)) {
      classes += "after:absolute after:inset-0 after:bg-green-400 after:opacity-40 after:rounded-full after:m-2 ";
    }

    return classes;
  };

  const renderCoordinates = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    return (
      <>
        {/* File labels (bottom) */}
        <div className="flex">
          <div className="w-8"></div>
          {files.map((file, index) => (
            <div key={file} className="w-16 h-6 flex items-center justify-center text-sm font-semibold text-gray-600">
              {file}
            </div>
          ))}
        </div>
        
        {/* Rank labels (left side) */}
        <div className="absolute left-0 top-6 flex flex-col">
          {ranks.map((rank, index) => (
            <div key={rank} className="w-8 h-16 flex items-center justify-center text-sm font-semibold text-gray-600">
              {rank}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {renderCoordinates()}
        
        {/* Chess Board */}
        <div className="ml-8 mt-6 border-4 border-gray-800 shadow-2xl">
          {boardState.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getSquareClasses(rowIndex, colIndex)}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece && (
                    <span className={`select-none text-shadow ${
                      piece.charAt(0) === 'w' ? 'text-white drop-shadow-lg' : 'text-gray-800'
                    }`}>
                      {ChessEngine.pieceToUnicode(piece)}
                    </span>
                  )}
                  
                  {/* Valid move indicator for empty squares */}
                  {isValidMoveSquare(rowIndex, colIndex) && !piece && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full opacity-60"></div>
                    </div>
                  )}
                  
                  {/* Capture indicator for occupied squares */}
                  {isValidMoveSquare(rowIndex, colIndex) && piece && (
                    <div className="absolute inset-0 border-4 border-red-500 rounded pointer-events-none opacity-70"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Game Status */}
      {gameStatus === 'solved' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-center text-green-800 font-semibold">
            🎉 Puzzle Solved! Excellent work!
          </p>
        </div>
      )}

      {gameStatus === 'failed' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-center text-red-800 font-semibold">
            Try again! You can do it!
          </p>
        </div>
      )}

      {/* Additional info for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500 max-w-md">
          <p>Turn: {chessEngine.getTurn() === 'w' ? 'White' : 'Black'}</p>
          <p>Moves played: {moveHistory.length}</p>
          <p>In check: {chessEngine.inCheck() ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default ChessBoardAdvanced;