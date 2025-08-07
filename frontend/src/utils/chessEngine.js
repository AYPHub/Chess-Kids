import { Chess } from 'chess.js';

// Chess engine utilities for proper chess logic
export class ChessEngine {
  constructor(fen = null) {
    try {
      this.chess = fen ? new Chess(fen) : new Chess();
    } catch (error) {
      console.error('Invalid FEN in constructor:', error);
      this.chess = new Chess(); // Fallback to default position
    }
  }

  // Load position from FEN
  loadPosition(fen) {
    if (!fen || typeof fen !== 'string') {
      console.warn('Invalid FEN position provided:', fen);
      this.chess = new Chess(); // Reset to default position
      return false;
    }

    try {
      const validation = Chess.validateFen(fen);
      if (!validation.valid) {
        console.error('Invalid FEN position:', fen, validation.error);
        this.chess = new Chess(); // Reset to default position
        return false;
      }
      
      this.chess.load(fen);
      return true;
    } catch (error) {
      console.error('Error loading FEN position:', error);
      this.chess = new Chess(); // Reset to default position
      return false;
    }
  }

  // Get current board state as 2D array
  getBoard() {
    const board = this.chess.board();
    return board.map(row => 
      row.map(piece => piece ? `${piece.color}${piece.type}` : null)
    );
  }

  // Get legal moves for a square
  getLegalMoves(square) {
    const moves = this.chess.moves({ square, verbose: true });
    return moves.map(move => ({
      from: move.from,
      to: move.to,
      piece: move.piece,
      captured: move.captured,
      promotion: move.promotion,
      san: move.san
    }));
  }

  // Make a move
  makeMove(move) {
    try {
      const result = this.chess.move(move);
      return result;
    } catch (error) {
      console.error('Invalid move:', error);
      return null;
    }
  }

  // Undo last move
  undoMove() {
    return this.chess.undo();
  }

  // Check if game is over
  isGameOver() {
    return this.chess.isGameOver();
  }

  // Check if in check
  inCheck() {
    return this.chess.inCheck();
  }

  // Check if in checkmate
  inCheckmate() {
    return this.chess.isCheckmate();
  }

  // Check if in stalemate
  inStalemate() {
    return this.chess.isStalemate();
  }

  // Get current turn
  getTurn() {
    return this.chess.turn(); // 'w' or 'b'
  }

  // Get FEN string
  getFEN() {
    return this.chess.fen();
  }

  // Get move history
  getHistory() {
    return this.chess.history({ verbose: true });
  }

  // Reset to initial position
  reset() {
    this.chess.reset();
  }

  // Validate FEN
  static validateFEN(fen) {
    return Chess.validateFen(fen);
  }

  // Convert piece notation for display
  static pieceToUnicode(piece) {
    const pieces = {
      'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
      'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
    };
    return pieces[piece] || '';
  }

  // Convert square notation (e.g., 'e4' to [4, 4])
  static squareToCoords(square) {
    const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
    const rank = 8 - parseInt(square[1]); // '8' = 0, '7' = 1, etc.
    return [rank, file];
  }

  // Convert coordinates to square notation (e.g., [4, 4] to 'e4')
  static coordsToSquare(row, col) {
    const file = String.fromCharCode(97 + col);
    const rank = (8 - row).toString();
    return file + rank;
  }

  // Check if move is in solution
  checkSolution(move, solutionMoves) {
    if (!Array.isArray(solutionMoves)) return false;
    return solutionMoves.some(solution => 
      move.san === solution || 
      move.from + move.to === solution ||
      `${move.from}-${move.to}` === solution
    );
  }

  // Get all legal moves for current position
  getAllLegalMoves() {
    return this.chess.moves({ verbose: true });
  }

  // Check if position is valid
  isValidPosition() {
    return this.chess.isGameOver() === false || 
           this.chess.isCheckmate() || 
           this.chess.isStalemate();
  }
}