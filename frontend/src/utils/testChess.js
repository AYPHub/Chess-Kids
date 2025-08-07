// Test chess.js integration
import { Chess } from 'chess.js';

export const testChessEngine = () => {
  try {
    console.log('Testing chess.js...');
    
    // Test 1: Basic initialization
    const chess = new Chess();
    console.log('✅ Chess instance created');
    
    // Test 2: Get initial board
    const board = chess.board();
    console.log('✅ Board retrieved:', board);
    
    // Test 3: Convert to our format
    const convertedBoard = board.map(row => 
      row.map(piece => {
        if (!piece) return null;
        return piece.color + piece.type;
      })
    );
    console.log('✅ Converted board:', convertedBoard);
    
    // Test 4: Load FEN position
    const testFen = '2r3k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1';
    chess.load(testFen);
    const fenBoard = chess.board();
    console.log('✅ FEN board loaded:', fenBoard);
    
    // Test 5: Unicode conversion
    const pieceSymbols = {
      'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
      'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
    };
    
    const firstPiece = convertedBoard.find(row => row.find(piece => piece));
    const flatPieces = convertedBoard.flat().filter(piece => piece);
    console.log('✅ Found pieces:', flatPieces);
    
    return {
      success: true,
      board: convertedBoard,
      pieces: flatPieces.map(piece => ({
        piece,
        symbol: pieceSymbols[piece] || '?'
      }))
    };
    
  } catch (error) {
    console.error('❌ Chess test failed:', error);
    return { success: false, error: error.message };
  }
};