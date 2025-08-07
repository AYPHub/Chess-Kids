import React from 'react';
import { pieceSymbols } from '../data/mock';

const ChessBoard = ({ 
  board, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  gameStatus 
}) => {
  const isSquareLight = (row, col) => (row + col) % 2 === 0;
  const isSquareSelected = (row, col) => 
    selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
  const isValidMove = (row, col) => 
    validMoves.some(([r, c]) => r === row && c === col);

  const getSquareClasses = (row, col) => {
    let classes = "w-16 h-16 flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 relative ";
    
    if (isSquareLight(row, col)) {
      classes += "bg-amber-100 ";
    } else {
      classes += "bg-amber-800 ";
    }

    if (isSquareSelected(row, col)) {
      classes += "ring-4 ring-blue-400 ring-inset ";
    }

    if (isValidMove(row, col)) {
      classes += "after:absolute after:inset-0 after:bg-green-400 after:opacity-30 after:rounded-full after:m-2 ";
    }

    classes += "hover:brightness-110 ";

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
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getSquareClasses(rowIndex, colIndex)}
                  onClick={() => gameStatus === 'playing' && onSquareClick(rowIndex, colIndex)}
                >
                  {piece && (
                    <span className={`select-none ${piece === piece.toUpperCase() ? 'text-white drop-shadow-lg' : 'text-gray-800'}`}>
                      {pieceSymbols[piece]}
                    </span>
                  )}
                  
                  {/* Valid move indicator */}
                  {isValidMove(rowIndex, colIndex) && !piece && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full opacity-60"></div>
                    </div>
                  )}
                  
                  {/* Capture indicator */}
                  {isValidMove(rowIndex, colIndex) && piece && (
                    <div className="absolute inset-0 border-4 border-red-500 rounded pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Game Status */}
      {gameStatus !== 'playing' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-blue-800 font-semibold">
            {gameStatus === 'solved' ? '🎉 Puzzle Solved!' : '❌ Puzzle Failed'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;