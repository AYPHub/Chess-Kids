import React, { useState, useEffect } from 'react';

const SimpleChessTest = () => {
  const [boardState, setBoardState] = useState([]);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const runTest = async () => {
      const results = [];
      
      try {
        results.push('🔧 Starting chess.js test...');
        
        // Test 1: Import chess.js
        const { Chess } = await import('chess.js');
        results.push('✅ chess.js imported successfully');
        
        // Test 2: Create instance
        const chess = new Chess();
        results.push('✅ Chess instance created');
        
        // Test 3: Get board
        const board = chess.board();
        results.push(`✅ Board retrieved, size: ${board.length}x${board[0].length}`);
        
        // Test 4: Convert board
        const convertedBoard = board.map(row => 
          row.map(piece => {
            if (!piece) return null;
            return piece.color + piece.type;
          })
        );
        
        // Count pieces
        const pieceCount = convertedBoard.flat().filter(p => p).length;
        results.push(`✅ Board converted, found ${pieceCount} pieces`);
        
        // Test 5: Load FEN
        const testFen = '2r3k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1';
        chess.load(testFen);
        const fenBoard = chess.board();
        const fenConverted = fenBoard.map(row => 
          row.map(piece => {
            if (!piece) return null;
            return piece.color + piece.type;
          })
        );
        
        const fenPieceCount = fenConverted.flat().filter(p => p).length;
        results.push(`✅ FEN position loaded, found ${fenPieceCount} pieces`);
        
        setBoardState(fenConverted);
        
        // Test piece symbols
        const pieces = {
          'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
          'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
        };
        
        const samplePieces = fenConverted.flat().filter(p => p).slice(0, 3);
        results.push(`✅ Sample pieces: ${samplePieces.map(p => `${p}=${pieces[p]}`).join(', ')}`);
        
      } catch (error) {
        results.push(`❌ Error: ${error.message}`);
        console.error('Chess test error:', error);
      }
      
      setTestResults(results);
    };
    
    runTest();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-4">Chess.js Integration Test</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Test Results:</h4>
        <ul className="text-sm">
          {testResults.map((result, index) => (
            <li key={index} className="py-1">{result}</li>
          ))}
        </ul>
      </div>
      
      {boardState.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold">Board State (8x8):</h4>
          <div className="grid grid-cols-8 gap-1 w-64 h-64 border">
            {boardState.map((row, rowIndex) => 
              row.map((piece, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex items-center justify-center text-2xl ${
                    (rowIndex + colIndex) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                  }`}
                >
                  {piece && (
                    <span className={piece.charAt(0) === 'w' ? 'text-white' : 'text-black'}>
                      {piece.charAt(0) === 'w' && piece.charAt(1) === 'k' && '♔'}
                      {piece.charAt(0) === 'w' && piece.charAt(1) === 'q' && '♕'}
                      {piece.charAt(0) === 'w' && piece.charAt(1) === 'r' && '♖'}
                      {piece.charAt(0) === 'w' && piece.charAt(1) === 'b' && '♗'}
                      {piece.charAt(0) === 'w' && piece.charAt(1) === 'n' && '♘'}
                      {piece.charAt(0) === 'w' && piece.charAt(1) === 'p' && '♙'}
                      {piece.charAt(0) === 'b' && piece.charAt(1) === 'k' && '♚'}
                      {piece.charAt(0) === 'b' && piece.charAt(1) === 'q' && '♛'}
                      {piece.charAt(0) === 'b' && piece.charAt(1) === 'r' && '♜'}
                      {piece.charAt(0) === 'b' && piece.charAt(1) === 'b' && '♝'}
                      {piece.charAt(0) === 'b' && piece.charAt(1) === 'n' && '♞'}
                      {piece.charAt(0) === 'b' && piece.charAt(1) === 'p' && '♟'}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChessTest;