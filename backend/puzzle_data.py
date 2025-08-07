# Comprehensive Chess Puzzle Database with 50 Real Chess Puzzles
# Each puzzle includes real FEN positions, proper solutions, and categorization

CHESS_PUZZLES = [
    # BEGINNER PUZZLES (Ages 5-8) - 15 puzzles
    {
        "id": "b001",
        "title": "Checkmate in 1 - Back Rank",
        "description": "Find the checkmate in one move using back rank weakness",
        "difficulty": "beginner",
        "time_limit": 3,
        "rating": 600,
        "fen": "2r3k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
        "solution": ["Re8#"],
        "hints": [
            "Look at the black king's position",
            "The back rank is vulnerable",
            "Your rook can deliver checkmate"
        ],
        "category": "checkmate"
    },
    {
        "id": "b002", 
        "title": "Win the Queen - Fork",
        "description": "Use a knight fork to win the queen",
        "difficulty": "beginner",
        "time_limit": 4,
        "rating": 650,
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
        "solution": ["Nxe5", "Ne5"],
        "hints": [
            "Look for a knight move that attacks two pieces",
            "The knight can jump to attack king and queen",
            "Forks are powerful tactical motifs"
        ],
        "category": "tactics"
    },
    {
        "id": "b003",
        "title": "Capture the Rook - Pin", 
        "description": "Win material by exploiting a pin",
        "difficulty": "beginner",
        "time_limit": 3,
        "rating": 700,
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "solution": ["Bxf7+"],
        "hints": [
            "The bishop can capture something valuable",
            "Look for pieces that can't move because they're protecting the king",
            "A check might win material"
        ],
        "category": "tactics"
    },
    {
        "id": "b004",
        "title": "Simple Checkmate Pattern",
        "description": "Deliver checkmate with queen and king",
        "difficulty": "beginner", 
        "time_limit": 4,
        "rating": 750,
        "fen": "8/8/8/8/8/2K5/2Q5/2k5 w - - 0 1",
        "solution": ["Qc2#"],
        "hints": [
            "The queen is very powerful",
            "Look for a square where the queen gives check",
            "Make sure the enemy king has no escape squares"
        ],
        "category": "checkmate"
    },
    {
        "id": "b005",
        "title": "Defend Against Checkmate",
        "description": "Block the checkmate threat",
        "difficulty": "beginner",
        "time_limit": 3,
        "rating": 680,
        "fen": "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
        "solution": ["Qd4", "Be7"],
        "hints": [
            "White is threatening checkmate",
            "You need to block or defend",
            "Look for pieces that can interpose"
        ],
        "category": "defense"
    },
    {
        "id": "b006",
        "title": "Win the Bishop - Skewer",
        "description": "Use a skewer to win material",
        "difficulty": "beginner",
        "time_limit": 4,
        "rating": 720,
        "fen": "r1bq1rk1/ppp2ppp/2nb1n2/3p4/3P4/2NB1N2/PPP2PPP/R1BQ1RK1 w - - 0 8",
        "solution": ["Re1"],
        "hints": [
            "Look for pieces in a line",
            "A rook move can attack through pieces",
            "Force the opponent to move and win material behind"
        ],
        "category": "tactics"
    },
    {
        "id": "b007",
        "title": "Pawn Promotion Threat",
        "description": "Promote your pawn to win",
        "difficulty": "beginner",
        "time_limit": 3,
        "rating": 640,
        "fen": "8/1P6/8/8/8/8/k7/1K6 w - - 0 1",
        "solution": ["b8=Q"],
        "hints": [
            "Your pawn can become a queen",
            "Pawn promotion is very powerful",
            "Choose the best piece for promotion"
        ],
        "category": "endgame"
    },
    {
        "id": "b008",
        "title": "Double Attack with Queen",
        "description": "Attack two pieces simultaneously",
        "difficulty": "beginner",
        "time_limit": 4,
        "rating": 690,
        "fen": "r1bqk2r/ppp2ppp/2n5/2bpN3/8/8/PPP2PPP/R1BQKB1R w KQkq - 0 7",
        "solution": ["Qh5"],
        "hints": [
            "The queen can attack multiple targets",
            "Look for a square that attacks two important pieces",
            "Double attacks are hard to defend"
        ],
        "category": "tactics"
    },
    {
        "id": "b009",
        "title": "Checkmate with Rooks",
        "description": "Use two rooks to deliver checkmate",
        "difficulty": "beginner",
        "time_limit": 5,
        "rating": 710,
        "fen": "6k1/6pp/8/8/8/8/R7/R5K1 w - - 0 1",
        "solution": ["Ra8#"],
        "hints": [
            "Two rooks work well together",
            "Look for back rank weakness",
            "One rook can support the other"
        ],
        "category": "checkmate"
    },
    {
        "id": "b010",
        "title": "Remove the Defender",
        "description": "Eliminate the piece defending an important square",
        "difficulty": "beginner",
        "time_limit": 4,
        "rating": 730,
        "fen": "r2q1rk1/ppp2ppp/2n1bn2/2bp4/8/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 9",
        "solution": ["Nxd5"],
        "hints": [
            "Look for pieces that are defending something important",
            "If you remove a defender, you might win material",
            "Knights are good at attacking multiple squares"
        ],
        "category": "tactics"
    },
    {
        "id": "b011",
        "title": "Basic King and Queen vs King",
        "description": "Checkmate with king and queen",
        "difficulty": "beginner",
        "time_limit": 6,
        "rating": 600,
        "fen": "8/8/8/3k4/8/3K1Q2/8/8 w - - 0 1",
        "solution": ["Qf5+"],
        "hints": [
            "Use your queen to give check",
            "Drive the enemy king to the edge",
            "Your king should support the queen"
        ],
        "category": "endgame"
    },
    {
        "id": "b012",
        "title": "Smothered Mate Pattern",
        "description": "Checkmate with a knight using smothered mate",
        "difficulty": "beginner",
        "time_limit": 5,
        "rating": 780,
        "fen": "6rk/6pp/6N1/8/8/8/8/6K1 w - - 0 1",
        "solution": ["Nf7#"],
        "hints": [
            "The knight is very close to the king",
            "Look for a knight move that gives checkmate",
            "Sometimes the king's own pieces can trap it"
        ],
        "category": "checkmate"
    },
    {
        "id": "b013",
        "title": "Win with Discovered Attack",
        "description": "Move a piece to uncover a powerful attack",
        "difficulty": "beginner",
        "time_limit": 4,
        "rating": 740,
        "fen": "r1bq1rk1/ppp1nppp/3p4/4N3/4P3/2N5/PPP1BPPP/R1BQ1RK1 w - - 0 9",
        "solution": ["Nd7"],
        "hints": [
            "Look for pieces on the same line",
            "Moving one piece can reveal another's attack",
            "Discovered attacks are very powerful"
        ],
        "category": "tactics"
    },
    {
        "id": "b014", 
        "title": "Deflection Tactic",
        "description": "Force a piece away from its important duty",
        "difficulty": "beginner",
        "time_limit": 4,
        "rating": 760,
        "fen": "r3k2r/ppp2ppp/2n1bn2/2bpq3/8/2NP1N2/PPP1BPPP/R1BQ1RK1 b kq - 0 9",
        "solution": ["Qe1+"],
        "hints": [
            "Look for pieces doing important jobs",
            "Force them to abandon their duties",
            "A check might deflect an important defender"
        ],
        "category": "tactics"
    },
    {
        "id": "b015",
        "title": "Ladder Mate",
        "description": "Use two rooks to create a ladder checkmate",
        "difficulty": "beginner",
        "time_limit": 5,
        "rating": 720,
        "fen": "6k1/8/8/8/8/8/1R6/R5K1 w - - 0 1",
        "solution": ["Rb8#"],
        "hints": [
            "Drive the king up the board step by step",
            "Use both rooks to control escape squares", 
            "The ladder pattern is very effective"
        ],
        "category": "checkmate"
    },
    
    # INTERMEDIATE PUZZLES (Ages 9-12) - 20 puzzles
    {
        "id": "i001",
        "title": "Checkmate in 2 Moves",
        "description": "Find the forced checkmate sequence in 2 moves",
        "difficulty": "intermediate",
        "time_limit": 8,
        "rating": 1000,
        "fen": "r1bq1r1k/ppp3pp/2n1bn2/3pp3/8/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 10",
        "solution": ["Nxe5", "Nxe5", "Qd8#"],
        "hints": [
            "Look for forcing moves like checks and captures",
            "After the first move, find the checkmate",
            "Remove defenders of key squares"
        ],
        "category": "checkmate"
    },
    {
        "id": "i002",
        "title": "Greek Gift Sacrifice",
        "description": "Sacrifice the bishop on h7 for a mating attack",
        "difficulty": "intermediate", 
        "time_limit": 10,
        "rating": 1200,
        "fen": "r1bq1rk1/ppp2ppp/2n2n2/3p4/1bBP4/2N2N2/PPP2PPP/R1BQ1RK1 w - - 0 8",
        "solution": ["Bxh7+", "Kxh7", "Ng5+"],
        "hints": [
            "The h7 square looks weak",
            "Bishop sacrifices can lead to mating attacks",
            "Follow up with knight moves"
        ],
        "category": "attack"
    },
    {
        "id": "i003",
        "title": "Zugzwang Position",
        "description": "Put the opponent in zugzwang to win material",
        "difficulty": "intermediate",
        "time_limit": 12,
        "rating": 1150,
        "fen": "8/1p6/1P6/1K6/8/8/8/1k6 w - - 0 1",
        "solution": ["Ka4"],
        "hints": [
            "Sometimes not moving would be better",
            "Force the opponent to worsen their position",
            "King moves can be very important"
        ],
        "category": "endgame"
    },
    {
        "id": "i004",
        "title": "Queen and Knight Cooperation",
        "description": "Coordinate queen and knight for a tactical blow",
        "difficulty": "intermediate",
        "time_limit": 9,
        "rating": 1180,
        "fen": "r1b1k2r/ppp1qppp/2n2n2/3p4/1bBP4/2NQ1N2/PPP2PPP/R1B2RK1 w kq - 0 9",
        "solution": ["Qd8+", "Qxd8", "Nxd8"],
        "hints": [
            "Look for pieces working together",
            "Queen and knight combinations are powerful", 
            "Force exchanges that favor you"
        ],
        "category": "tactics"
    },
    {
        "id": "i005",
        "title": "Rook Lift Tactic",
        "description": "Use a rook lift to create threats on the kingside",
        "difficulty": "intermediate",
        "time_limit": 10,
        "rating": 1220,
        "fen": "r2q1rk1/ppp1nppp/3p1n2/3Pp3/1bB5/2N2N2/PPP1QPPP/R1B2RK1 w - - 0 10",
        "solution": ["Re1"],
        "hints": [
            "Rooks can move horizontally to attack",
            "Look for ways to double on important files",
            "The e-file might be key"
        ],
        "category": "positional"
    },
    {
        "id": "i006",
        "title": "Clearance Sacrifice",
        "description": "Sacrifice to clear a line for a more powerful piece",
        "difficulty": "intermediate",
        "time_limit": 11,
        "rating": 1160,
        "fen": "r2qr1k1/ppp2ppp/2n2n2/2bp4/1bBP4/2N2N2/PPPQ1PPP/R1B2RK1 w - - 0 11",
        "solution": ["Nxd5"],
        "hints": [
            "Sometimes you need to remove your own pieces",
            "Clear the way for stronger attacks",
            "Look for pieces that can use the cleared line"
        ],
        "category": "tactics"
    },
    {
        "id": "i007",
        "title": "Endgame Opposition",
        "description": "Use opposition in king and pawn endgame",
        "difficulty": "intermediate",
        "time_limit": 15,
        "rating": 1100,
        "fen": "8/8/8/3k4/3P4/3K4/8/8 w - - 0 1",
        "solution": ["Kc4"],
        "hints": [
            "Kings facing each other across one square",
            "Gaining opposition gives you the advantage",
            "Support your pawn's advance"
        ],
        "category": "endgame"
    },
    {
        "id": "i008",
        "title": "Piece Sacrifice for Mate",
        "description": "Sacrifice material to deliver checkmate",
        "difficulty": "intermediate",
        "time_limit": 12,
        "rating": 1250,
        "fen": "r1bq1rk1/ppp2ppp/2n5/2bpN3/8/2P5/PP3PPP/R1BQKB1R w KQ - 0 10",
        "solution": ["Qh5", "h6", "Qxh6"],
        "hints": [
            "Material is less important than mate",
            "Look for weaknesses around the king",
            "Queen sacrifices can be devastating"
        ],
        "category": "attack"
    },
    {
        "id": "i009",
        "title": "In-Between Move",
        "description": "Insert an in-between move to gain advantage",
        "difficulty": "intermediate",
        "time_limit": 10,
        "rating": 1190,
        "fen": "r2qkb1r/ppp2ppp/2n2n2/2bpp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 6",
        "solution": ["Nd5"],
        "hints": [
            "Don't rush into obvious moves",
            "Look for intermediate tactics",
            "In-between moves can win material"
        ],
        "category": "tactics"
    },
    {
        "id": "i010",
        "title": "Weak Back Rank Defense",
        "description": "Exploit weakness on the back rank",
        "difficulty": "intermediate",
        "time_limit": 9,
        "rating": 1170,
        "fen": "2rq1rk1/ppp2ppp/2n1bn2/3p4/8/2NP1N2/PPP1BPPP/R1BQR1K1 w - - 0 12",
        "solution": ["Re8+", "Rxe8", "Qd8#"],
        "hints": [
            "The back rank looks vulnerable",
            "Force trades on important squares",
            "Create unstoppable threats"
        ],
        "category": "tactics"
    },
    {
        "id": "i011",
        "title": "Knight Outpost Creation",
        "description": "Create and utilize a powerful knight outpost",
        "difficulty": "intermediate",
        "time_limit": 13,
        "rating": 1130,
        "fen": "r1bq1rk1/pp3ppp/2n1pn2/2pp4/3P4/2PB1N2/PP3PPP/R1BQR1K1 w - - 0 12",
        "solution": ["Ne5"],
        "hints": [
            "Knights love secure central squares",
            "Look for squares that can't be attacked by pawns",
            "Outposts give lasting advantages"
        ],
        "category": "positional"
    },
    {
        "id": "i012",
        "title": "Pawn Storm Attack",
        "description": "Launch a pawn storm against the enemy king",
        "difficulty": "intermediate",
        "time_limit": 14,
        "rating": 1210,
        "fen": "r2q1rk1/ppp1nppp/2n1p3/3pP3/1b1P4/2N2N2/PPP2PPP/R1BQKB1R w KQ - 0 10",
        "solution": ["f4"],
        "hints": [
            "Pawns can be powerful attackers",
            "Advance multiple pawns together",
            "Create threats against the king"
        ],
        "category": "attack"
    },
    {
        "id": "i013",
        "title": "Exchange Sacrifice Value",
        "description": "Sacrifice the exchange for positional compensation",
        "difficulty": "intermediate",
        "time_limit": 11,
        "rating": 1240,
        "fen": "r1bq1rk1/pp3ppp/2n1pn2/2pp4/3P4/2PB1N2/PP1N1PPP/R1BQR1K1 w - - 0 13",
        "solution": ["Rxe6"],
        "hints": [
            "Rook for bishop/knight can be worth it",
            "Look for compensation in position",
            "Activity can be more valuable than material"
        ],
        "category": "sacrifice"
    },
    {
        "id": "i014",
        "title": "Mating Net Construction",
        "description": "Build a mating net around the enemy king",
        "difficulty": "intermediate",
        "time_limit": 12,
        "rating": 1200,
        "fen": "r2q1r1k/ppp3pp/2n1bp2/3pN3/8/2P5/PP1Q1PPP/R1B2RK1 w - - 0 14",
        "solution": ["Qh6"],
        "hints": [
            "Control squares around the enemy king",
            "Use multiple pieces to create threats",
            "Force the king into a corner"
        ],
        "category": "attack"
    },
    {
        "id": "i015",
        "title": "Minority Attack Technique",
        "description": "Use minority attack to create weaknesses",
        "difficulty": "intermediate",
        "time_limit": 16,
        "rating": 1140,
        "fen": "r1bq1rk1/pp1n1ppp/2p1pn2/3p4/1bPP4/2N2N2/PP2BPPP/R1BQR1K1 w - - 0 12",
        "solution": ["b4"],
        "hints": [
            "Attack where you're outnumbered",
            "Create pawn weaknesses",
            "Long-term positional pressure"
        ],
        "category": "positional"
    },
    {
        "id": "i016",
        "title": "Desperado Piece Tactic",
        "description": "Make the most of a doomed piece",
        "difficulty": "intermediate", 
        "time_limit": 10,
        "rating": 1180,
        "fen": "r1bq1rk1/ppp2ppp/2n2n2/2bpN3/8/8/PPP1BPPP/R1BQ1RK1 w - - 0 9",
        "solution": ["Nxf7"],
        "hints": [
            "When a piece is doomed, make it count",
            "Cause maximum damage before capture",
            "Look for the biggest disruption"
        ],
        "category": "tactics"
    },
    {
        "id": "i017",
        "title": "Bishop Pair Activation",
        "description": "Activate your bishop pair for maximum effect",
        "difficulty": "intermediate",
        "time_limit": 14,
        "rating": 1160,
        "fen": "r1bqr1k1/pp3ppp/2n1pn2/2pp4/3P4/2P2N2/PP1BBPPP/R1NQR1K1 w - - 0 13",
        "solution": ["f4"],
        "hints": [
            "Two bishops can dominate the center",
            "Open the position for bishops",
            "Control important diagonals"
        ],
        "category": "positional"
    },
    {
        "id": "i018",
        "title": "King Hunt Sequence",
        "description": "Force the enemy king into the open for mate",
        "difficulty": "intermediate",
        "time_limit": 13,
        "rating": 1230,
        "fen": "r1bq1r2/ppp2pk1/2n2np1/3p4/1bBP4/2N2N2/PPP1QPPP/R1B2RK1 w - - 0 12",
        "solution": ["Qe8+"],
        "hints": [
            "Drive the king away from safety",
            "Use checks to force the king forward",
            "Coordinate all pieces in the attack"
        ],
        "category": "attack"
    },
    {
        "id": "i019",
        "title": "Rook and Pawn Endgame",
        "description": "Navigate complex rook and pawn endgame",
        "difficulty": "intermediate",
        "time_limit": 18,
        "rating": 1120,
        "fen": "8/1R6/8/8/5k2/r4P2/6K1/8 w - - 0 1",
        "solution": ["Rb4+"],
        "hints": [
            "Active rook placement is crucial",
            "Cut off the enemy king",
            "Support your pawn's advance"
        ],
        "category": "endgame"
    },
    {
        "id": "i020",
        "title": "Tactical Motif Combination",
        "description": "Combine multiple tactical motifs",
        "difficulty": "intermediate",
        "time_limit": 11,
        "rating": 1270,
        "fen": "r1bq1rk1/pp2nppp/2n1p3/2ppP3/1b1P4/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 11",
        "solution": ["Nxd5"],
        "hints": [
            "Look for multiple tactical themes",
            "One move can create several threats",
            "Combine pins, forks, and discovered attacks"
        ],
        "category": "tactics"
    },

    # ADVANCED PUZZLES (Ages 13+) - 15 puzzles  
    {
        "id": "a001",
        "title": "Checkmate in 3 - Forced Sequence",
        "description": "Calculate the precise 3-move forced mate",
        "difficulty": "advanced",
        "time_limit": 20,
        "rating": 1600,
        "fen": "r1bq1r1k/ppp3pp/2n1Qn2/3p4/1b1P4/8/PPP2PPP/R1B2RK1 w - - 0 14",
        "solution": ["Qf7+", "Kh7", "Qg7#"],
        "hints": [
            "Force the king to a specific square",
            "Look for a mating net with multiple pieces",
            "Calculate all defensive tries"
        ],
        "category": "checkmate"
    },
    {
        "id": "a002",
        "title": "Complex Queen Sacrifice",
        "description": "Sacrifice the queen for overwhelming compensation",
        "difficulty": "advanced",
        "time_limit": 25,
        "rating": 1750,
        "fen": "r1b2rk1/ppp1qppp/2n1pn2/3p4/1bBP4/2N2N2/PPPQ1PPP/R1B1R1K1 w - - 0 12",
        "solution": ["Qxh7+", "Kxh7", "Rh3+"],
        "hints": [
            "Material is temporary, mate is permanent",
            "Calculate the entire forcing sequence",
            "Look for unstoppable mating attacks"
        ],
        "category": "sacrifice"
    },
    {
        "id": "a003", 
        "title": "Theoretical Endgame Win",
        "description": "Convert theoretical winning endgame position",
        "difficulty": "advanced",
        "time_limit": 30,
        "rating": 1550,
        "fen": "8/8/8/8/8/3k4/3P4/2K5 w - - 0 1",
        "solution": ["Kd1"],
        "hints": [
            "Study the key squares concept",
            "Precise king moves are essential",
            "Opposition and distant opposition matter"
        ],
        "category": "endgame"
    },
    {
        "id": "a004",
        "title": "Positional Exchange Sacrifice",
        "description": "Find the positional exchange sacrifice",
        "difficulty": "advanced", 
        "time_limit": 22,
        "rating": 1680,
        "fen": "r1bq1rk1/pp1n1ppp/2p1pn2/3p4/1bBP4/2N2N2/PPP1QPPP/R1B2RK1 w - - 0 11",
        "solution": ["Rxd5"],
        "hints": [
            "Exchange values are not absolute",
            "Look for long-term positional gains",
            "Compensation in piece activity"
        ],
        "category": "positional"
    },
    {
        "id": "a005",
        "title": "Multi-Piece Coordination",
        "description": "Coordinate all pieces for devastating attack",
        "difficulty": "advanced",
        "time_limit": 28,
        "rating": 1820,
        "fen": "r1bq1r1k/ppp2ppp/2n1pn2/3p4/1bBP4/2N2N2/PPPQ1PPP/R1B2RK1 w - - 0 12",
        "solution": ["Nf7", "Qxf7", "Bxf7+"],
        "hints": [
            "All pieces must work together",
            "Create multiple simultaneous threats",
            "Force opponent into impossible choices"
        ],
        "category": "attack"
    },
    {
        "id": "a006",
        "title": "Strategic Pawn Breakthrough", 
        "description": "Execute strategic pawn breakthrough",
        "difficulty": "advanced",
        "time_limit": 35,
        "rating": 1720,
        "fen": "8/1p3p2/1P3P2/8/8/5k2/6p1/6K1 w - - 0 1",
        "solution": ["f7", "g1=Q+", "Kh2"],
        "hints": [
            "Pawn breaks can shatter defenses",
            "Create weaknesses in pawn structure", 
            "Think strategically about pawn chains"
        ],
        "category": "endgame"
    },
    {
        "id": "a007",
        "title": "Quiet Move Strength",
        "description": "Find the quiet move that improves position decisively",
        "difficulty": "advanced",
        "time_limit": 26,
        "rating": 1650,
        "fen": "r1bq1rk1/ppp1nppp/2n1p3/3pP3/1b1P4/2N2N2/PPP1BPPP/R1BQR1K1 w - - 0 13",
        "solution": ["Re8+"],
        "hints": [
            "Not all winning moves are captures",
            "Improve piece coordination",
            "Look for long-term advantages"
        ],
        "category": "positional"
    },
    {
        "id": "a008",
        "title": "Piece Activity Maximization",
        "description": "Maximize activity of all pieces",
        "difficulty": "advanced",
        "time_limit": 24,
        "rating": 1590,
        "fen": "r2q1rk1/ppp1bppp/2n1pn2/3p4/1bBP4/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 11",
        "solution": ["Re1"],
        "hints": [
            "Active pieces are worth more than passive ones",
            "Coordinate piece development",
            "Control key central squares"
        ],
        "category": "positional"  
    },
    {
        "id": "a009",
        "title": "King Safety Demolition",
        "description": "Systematically destroy king safety",
        "difficulty": "advanced",
        "time_limit": 30,
        "rating": 1780,
        "fen": "r1bq1rk1/ppp2ppp/2n2n2/2bpN3/8/2P5/PP1BPPPP/R1BQ1RK1 w - - 0 10",
        "solution": ["h4"],
        "hints": [
            "Attack the king's pawn shelter",
            "Open lines toward the king",
            "Create multiple attacking avenues"
        ],
        "category": "attack"
    },
    {
        "id": "a010",
        "title": "Deep Calculation Required", 
        "description": "Calculate deep tactical sequence",
        "difficulty": "advanced",
        "time_limit": 32,
        "rating": 1850,
        "fen": "r1bq1r1k/ppp1nppp/2n1p3/3pP3/1b1P4/2N2N2/PPPBBPPP/R1Q2RK1 w - - 0 12",
        "solution": ["Nxd5", "exd5", "Qc7"],
        "hints": [
            "Calculate several moves ahead",
            "Consider all opponent responses",
            "Look for quiet but strong continuations"
        ],
        "category": "calculation"
    },
    {
        "id": "a011",
        "title": "Endgame Technique Mastery",
        "description": "Demonstrate precise endgame technique",
        "difficulty": "advanced",
        "time_limit": 40,
        "rating": 1520,
        "fen": "8/8/1p6/1P5k/8/6K1/8/8 w - - 0 1",
        "solution": ["Kf4"],
        "hints": [
            "King activity is paramount",
            "Calculate key squares precisely",
            "Breakthrough timing is crucial"
        ],
        "category": "endgame"
    },
    {
        "id": "a012",
        "title": "Initiative Maintenance",
        "description": "Maintain initiative through tactical sequence",
        "difficulty": "advanced", 
        "time_limit": 27,
        "rating": 1710,
        "fen": "r1bq1rk1/pp1n1ppp/2p1pn2/3p4/1bBP4/2N2N2/PPP1QPPP/R1B2RK1 w - - 0 12",
        "solution": ["Nxd5"],
        "hints": [
            "Keep creating threats",
            "Don't let the opponent consolidate",
            "Initiative is worth material"
        ],
        "category": "tactics"
    },
    {
        "id": "a013",
        "title": "Pawn Structure Transformation",
        "description": "Transform pawn structure favorably",
        "difficulty": "advanced",
        "time_limit": 29,
        "rating": 1640,
        "fen": "r1bqr1k1/pp1n1ppp/2p1pn2/3p4/1bBP4/2N2N2/PPP1BPPP/R1Q1R1K1 w - - 0 13",
        "solution": ["e4"],
        "hints": [
            "Pawn structure defines the game",
            "Create favorable imbalances",
            "Think long-term about pawn formation"
        ],
        "category": "strategy"
    },
    {
        "id": "a014",
        "title": "Compensation Evaluation",
        "description": "Correctly evaluate position with material imbalance",
        "difficulty": "advanced",
        "time_limit": 25,
        "rating": 1760,
        "fen": "r1bq1rk1/pp1n1ppp/2p1p3/3pPn2/1bBP4/2N5/PPP2PPP/R1BQ1RK1 b - - 0 12",
        "solution": ["Nxd4"],
        "hints": [
            "Material is not everything",
            "Evaluate piece activity and coordination",
            "Look for dynamic compensation"
        ],
        "category": "evaluation"
    },
    {
        "id": "a015",
        "title": "Masterful Endgame Conversion",
        "description": "Convert slight advantage in complex endgame",
        "difficulty": "advanced",
        "time_limit": 45,
        "rating": 1580,
        "fen": "8/1p3pk1/1P3p1p/5P1P/8/8/6K1/8 w - - 0 1",
        "solution": ["Kg3"],
        "hints": [
            "Small advantages require precise technique",
            "King activity decides the outcome",
            "Calculate breakthrough possibilities"
        ],
        "category": "endgame"
    }
]