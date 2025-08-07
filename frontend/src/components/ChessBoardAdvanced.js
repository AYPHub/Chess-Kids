import React, { useState, useEffect } from 'react';

const ChessBoardAdvanced = ({ 
  puzzle,
  onMove,
  onPuzzleSolved,
  gameStatus,
  hintsUsed
}) => {
  const [chess, setChess] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [boardState, setBoardState] = useState(() => {
    // Initialize with empty 8x8 board
    return Array(8).fill(null).map(() => Array(8).fill(null));
  });
  const [moveHistory, setMoveHistory] = useState([]);

  // Initialize chess.js when component mounts
  useEffect(() => {
    const initChess = async () => {
      try {
        const { Chess } = await import('chess.js');
        const chessInstance = new Chess();
        setChess(chessInstance);
        console.log('✅ Chess instance initialized in ChessBoardAdvanced');
      } catch (error) {
        console.error('❌ Failed to initialize chess.js:', error);
      }
    };
    
    initChess();
  }, []);

  // Initialize board when chess instance and puzzle are ready
  useEffect(() => {
    if (!chess || !puzzle) return;
    
    console.log('Loading puzzle in ChessBoardAdvanced:', puzzle.title, puzzle.position);
    
    try {
      if (puzzle.position) {
        chess.load(puzzle.position);
        console.log('✅ Loaded puzzle position');
      } else {
        chess.reset(); // Default starting position
        console.log('✅ Using default starting position');
      }
      
      // Update board display
      updateBoardDisplay();
      setMoveHistory([]);
      setSelectedSquare(null);
      setValidMoves([]);
      
    } catch (error) {
      console.error('❌ Error loading position:', error);
      // Fallback to default position
      chess.reset();
      updateBoardDisplay();
    }
  }, [chess, puzzle]);

  const updateBoardDisplay = () => {
    if (!chess) return;
    
    try {
      const board = chess.board();
      const convertedBoard = board.map(row => 
        row.map(piece => {
          if (!piece) return null;
          return piece.color + piece.type;
        })
      );
      
      console.log('📋 Updated board state:', convertedBoard.flat().filter(p => p).length, 'pieces');
      setBoardState(convertedBoard);
    } catch (error) {
      console.error('Error updating board display:', error);
      setBoardState(Array(8).fill(null).map(() => Array(8).fill(null)));
    }
  };

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing' || !chess) return;

    const square = coordsToSquare(row, col);
    const piece = boardState[row][col];

    // If no square is selected
    if (!selectedSquare) {
      if (piece && isPieceOwnedByCurrentPlayer(piece)) {
        setSelectedSquare(square);
        const moves = chess.moves({ square, verbose: true });
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
    try {
      const move = chess.move({
        from: selectedSquare,
        to: square
      });

      if (move) {
        console.log('✅ Move made:', move.san);
        updateBoardDisplay();
        setSelectedSquare(null);
        setValidMoves([]);
        
        const newMoveHistory = [...moveHistory, move];
        setMoveHistory(newMoveHistory);
        
        // Check if move is part of solution
        const isSolutionMove = puzzle.moves && puzzle.moves.includes(move.san);
        
        // Notify parent component
        if (onMove) {
          onMove({
            move: move,
            isSolutionMove,
            position: chess.fen(),
            gameOver: chess.isGameOver(),
            inCheck: chess.inCheck(),
            inCheckmate: chess.isCheckmate()
          });
        }

        // Check if puzzle is solved
        if (isSolutionMove || chess.isCheckmate()) {
          if (onPuzzleSolved) {
            onPuzzleSolved({
              solved: true,
              moves: newMoveHistory,
              finalPosition: chess.fen()
            });
          }
        }
      }
    } catch (error) {
      // Invalid move, try selecting new piece
      if (piece && isPieceOwnedByCurrentPlayer(piece)) {
        setSelectedSquare(square);
        const moves = chess.moves({ square, verbose: true });
        setValidMoves(moves.map(move => move.to));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  const isPieceOwnedByCurrentPlayer = (piece) => {
    if (!piece || !chess) return false;
    const currentTurn = chess.turn();
    const pieceColor = piece.charAt(0);
    return currentTurn === pieceColor;
  };

  const undoLastMove = () => {
    if (!chess) return false;
    const undone = chess.undo();
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
    if (!chess || !puzzle) return;
    
    try {
      if (puzzle.position) {
        chess.load(puzzle.position);
      } else {
        chess.reset();
      }
      updateBoardDisplay();
      setMoveHistory([]);
      setSelectedSquare(null);
      setValidMoves([]);
    } catch (error) {
      console.error('Error resetting position:', error);
    }
  };

  // Utility functions
  const coordsToSquare = (row, col) => {
    const file = String.fromCharCode(97 + col);
    const rank = (8 - row).toString();
    return file + rank;
  };

  const isSquareLight = (row, col) => (row + col) % 2 === 0;
  const isSquareSelected = (row, col) => {
    const square = coordsToSquare(row, col);
    return selectedSquare === square;
  };
  const isValidMoveSquare = (row, col) => {
    const square = coordsToSquare(row, col);
    return validMoves.includes(square);
  };

  const pieceToUnicode = (piece) => {
    if (!piece || typeof piece !== 'string') return '';
    
    const pieces = {
      'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
      'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
    };
    
    return pieces[piece.toLowerCase()] || '';
  };

  // Expose methods to parent
  useEffect(() => {
    if (window.chessBoard) {
      window.chessBoard.undo = undoLastMove;
      window.chessBoard.reset = resetPosition;
    }
  });

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
        <div className="flex">
          <div className="w-8"></div>
          {files.map((file, index) => (
            <div key={file} className="w-16 h-6 flex items-center justify-center text-sm font-semibold text-gray-600">
              {file}
            </div>
          ))}
        </div>
        
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

  // Don't render until chess is initialized
  if (!chess || boardState.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Initializing chess board...</p>
      </div>
    );
  }

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
                    <span className={`select-none ${
                      piece.charAt(0) === 'w' ? 'text-white drop-shadow-lg' : 'text-gray-800'
                    }`} style={{ fontSize: '2.5rem', lineHeight: '1' }}>
                      {pieceToUnicode(piece)}
                    </span>
                  )}
                  
                  {/* Valid move indicators */}
                  {isValidMoveSquare(rowIndex, colIndex) && !piece && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full opacity-60"></div>
                    </div>
                  )}
                  
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

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && chess && (
        <div className="mt-4 text-xs text-gray-500 max-w-md text-center">
          <p>Turn: {chess.turn() === 'w' ? 'White' : 'Black'}</p>
          <p>Moves: {moveHistory.length}</p>
          <p>Check: {chess.inCheck() ? 'Yes' : 'No'}</p>
          <p>Pieces: {boardState.flat().filter(p => p).length}</p>
        </div>
      )}
    </div>
  );
};

export default ChessBoardAdvanced;