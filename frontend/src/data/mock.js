// Mock data for chess puzzles and game state

export const mockPuzzles = [
  // Beginner puzzles
  {
    id: 'b1',
    title: 'Checkmate in 1',
    description: 'Find the winning move to checkmate the king',
    difficulty: 'beginner',
    timeLimit: 5,
    rating: 800,
    completed: true,
    moves: ['Qh7#'],
    position: 'rnbqk1nr/pppp1ppp/4p3/2b5/2B1P3/8/PPPP1PbP/RNBQK1NR',
    solution: 'Qh7#',
    hints: ['Look for a move with your queen', 'The king is vulnerable on h7']
  },
  {
    id: 'b2',
    title: 'Capture the Queen',
    description: 'Win material by capturing the undefended queen',
    difficulty: 'beginner',
    timeLimit: 3,
    rating: 750,
    completed: false,
    moves: ['Rxd8+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Rxd8+',
    hints: ['Look for undefended pieces', 'Your rook can capture safely']
  },
  {
    id: 'b3',
    title: 'Fork with Knight',
    description: 'Use your knight to attack two pieces at once',
    difficulty: 'beginner',
    timeLimit: 4,
    rating: 850,
    completed: true,
    moves: ['Ne7+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Ne7+',
    hints: ['Knights can jump over pieces', 'Look for a move that attacks both king and queen']
  },
  {
    id: 'b4',
    title: 'Pin the Piece',
    description: 'Immobilize an opponent piece with a pin',
    difficulty: 'beginner',
    timeLimit: 3,
    rating: 800,
    completed: false,
    moves: ['Bb5+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Bb5+',
    hints: ['Look for pieces on the same line', 'Your bishop can create problems']
  },

  // Intermediate puzzles
  {
    id: 'i1',
    title: 'Checkmate in 2',
    description: 'Find the sequence of moves to deliver checkmate in 2 moves',
    difficulty: 'intermediate',
    timeLimit: 8,
    rating: 1200,
    completed: true,
    moves: ['Qd8+', 'Qh8#'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Qd8+ Kg7 Qh8#',
    hints: ['Force the king to a worse square', 'Look for a way to trap the king']
  },
  {
    id: 'i2',
    title: 'Tactical Combination',
    description: 'Find the tactical sequence to win material',
    difficulty: 'intermediate',
    timeLimit: 10,
    rating: 1350,
    completed: false,
    moves: ['Rxe6+', 'Qxf7+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Rxe6+ Kh8 Qxf7',
    hints: ['Sacrifice for position', 'Look for multiple threats']
  },
  {
    id: 'i3',
    title: 'Back Rank Mate',
    description: 'Exploit the weakness of the back rank',
    difficulty: 'intermediate',
    timeLimit: 6,
    rating: 1100,
    completed: true,
    moves: ['Rd8+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Rd8#',
    hints: ['The king has no escape squares', 'Your rook can deliver mate']
  },
  {
    id: 'i4',
    title: 'Double Attack',
    description: 'Create two threats simultaneously',
    difficulty: 'intermediate',
    timeLimit: 7,
    rating: 1250,
    completed: false,
    moves: ['Nd5'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Nd5',
    hints: ['One move, two threats', 'Your knight is very active']
  },

  // Advanced puzzles
  {
    id: 'a1',
    title: 'Checkmate in 3',
    description: 'Find the precise sequence to force checkmate in 3 moves',
    difficulty: 'advanced',
    timeLimit: 15,
    rating: 1600,
    completed: true,
    moves: ['Qd8+', 'Kh7', 'Qh8+', 'Kg6', 'Qh6#'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Qd8+ Kh7 Qh8+ Kg6 Qh6#',
    hints: ['Force the king to a specific square', 'Look for a mating net', 'Calculate all opponent responses']
  },
  {
    id: 'a2',
    title: 'Complex Sacrifice',
    description: 'Sacrifice material for a winning attack',
    difficulty: 'advanced',
    timeLimit: 12,
    rating: 1750,
    completed: false,
    moves: ['Rxh7+', 'Kxh7', 'Qh5+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Rxh7+ Kxh7 Qh5+ Kg8 Bxg7',
    hints: ['Material is less important than king safety', 'Open lines to the king', 'Calculate the entire sequence']
  },
  {
    id: 'a3',
    title: 'Endgame Technique',
    description: 'Convert your advantage in the endgame',
    difficulty: 'advanced',
    timeLimit: 20,
    rating: 1500,
    completed: true,
    moves: ['Kf6', 'Kf8', 'g6'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Kf6 Kf8 g6 Ke8 g7',
    hints: ['King and pawn vs king requires precise technique', 'Opposition is key', 'Support your pawn advance']
  },
  {
    id: 'a4',
    title: 'Positional Masterpiece',
    description: 'Find the quiet move that improves your position decisively',
    difficulty: 'advanced',
    timeLimit: 18,
    rating: 1650,
    completed: false,
    moves: ['Re8+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Re8+',
    hints: ['Not all winning moves are captures or checks', 'Improve piece coordination', 'Look for long-term advantages']
  },
  {
    id: 'a5',
    title: 'Multi-Piece Coordination',
    description: 'Coordinate multiple pieces for a devastating attack',
    difficulty: 'advanced',
    timeLimit: 25,
    rating: 1800,
    completed: false,
    moves: ['Nf7', 'Qxf7', 'Bxf7+'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'Nf7 Qxf7 Bxf7+ Kh8 Ng6#',
    hints: ['All pieces must work together', 'Create multiple threats', 'Force opponent into bad moves']
  },
  {
    id: 'a6',
    title: 'Strategic Breakthrough',
    description: 'Break through a solid defensive position',
    difficulty: 'advanced',
    timeLimit: 22,
    rating: 1700,
    completed: true,
    moves: ['f4', 'exf4', 'e5'],
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    solution: 'f4 exf4 e5 dxe5 d6',
    hints: ['Pawn breaks can shatter defenses', 'Create weaknesses in opponent structure', 'Think strategically, not just tactically']
  }
];

export const mockUserProgress = {
  totalPuzzlesSolved: 6,
  totalPuzzles: 14,
  beginnersSolved: 2,
  intermediateSolved: 2,
  advancedSolved: 2,
  averageRating: 1125,
  streak: 3,
  achievements: [
    { id: 'first_puzzle', name: 'First Puzzle', description: 'Solved your first puzzle!', earned: true },
    { id: 'beginner_master', name: 'Beginner Master', description: 'Completed all beginner puzzles', earned: false },
    { id: 'intermediate_master', name: 'Intermediate Master', description: 'Completed all intermediate puzzles', earned: false },
    { id: 'advanced_master', name: 'Advanced Master', description: 'Completed all advanced puzzles', earned: false },
    { id: 'quick_solver', name: 'Quick Solver', description: 'Solved a puzzle in under 30 seconds', earned: true },
    { id: 'streak_3', name: '3-Day Streak', description: 'Solved puzzles 3 days in a row', earned: true },
    { id: 'tactical_genius', name: 'Tactical Genius', description: 'Solved 5 advanced puzzles', earned: false },
    { id: 'endgame_expert', name: 'Endgame Expert', description: 'Mastered endgame techniques', earned: true }
  ],
  recentActivity: [
    { date: '2024-01-15', puzzle: 'Checkmate in 1', result: 'solved', time: 45 },
    { date: '2024-01-14', puzzle: 'Strategic Breakthrough', result: 'solved', time: 340 },
    { date: '2024-01-14', puzzle: 'Fork with Knight', result: 'solved', time: 78 },
    { date: '2024-01-13', puzzle: 'Back Rank Mate', result: 'solved', time: 92 },
    { date: '2024-01-12', puzzle: 'Checkmate in 3', result: 'solved', time: 456 },
    { date: '2024-01-12', puzzle: 'Checkmate in 2', result: 'solved', time: 156 }
  ]
};

// Chess board initial state and utilities
export const initialChessBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

export const pieceSymbols = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

export const isWhitePiece = (piece) => {
  return piece && piece === piece.toUpperCase();
};

export const isBlackPiece = (piece) => {
  return piece && piece === piece.toLowerCase();
};

export const getValidMoves = (board, row, col) => {
  // Simplified valid moves calculation for demo
  const moves = [];
  const piece = board[row][col];
  
  if (!piece) return moves;
  
  // Add some basic valid moves for demonstration
  // In a real implementation, this would contain proper chess logic
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
      
      // Simple validation - can move to empty square or capture opponent
      if (!targetPiece || 
          (isWhitePiece(piece) && isBlackPiece(targetPiece)) ||
          (isBlackPiece(piece) && isWhitePiece(targetPiece))) {
        moves.push([newRow, newCol]);
      }
    }
  });
  
  return moves;
};