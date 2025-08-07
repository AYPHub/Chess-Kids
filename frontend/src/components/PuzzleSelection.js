import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Star, Play, Clock, Trophy } from 'lucide-react';
import { mockPuzzles } from '../data/mock';

const PuzzleSelection = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');

  const filteredPuzzles = mockPuzzles.filter(puzzle => puzzle.difficulty === selectedDifficulty);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyStats = (difficulty) => {
    const puzzles = mockPuzzles.filter(p => p.difficulty === difficulty);
    return {
      total: puzzles.length,
      completed: puzzles.filter(p => p.completed).length
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Challenge</h1>
        <p className="text-lg text-gray-600">Select puzzles that match your skill level</p>
      </div>

      {/* Difficulty Tabs */}
      <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty} className="mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-xl grid-cols-3 bg-gray-100">
            <TabsTrigger value="beginner" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Beginner
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Intermediate
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Advanced
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Level Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Beginner Level</CardTitle>
              <Trophy className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {getDifficultyStats('beginner').completed}/{getDifficultyStats('beginner').total}
              </div>
              <p className="text-xs text-green-600">Puzzles completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Intermediate Level</CardTitle>
              <Star className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {getDifficultyStats('intermediate').completed}/{getDifficultyStats('intermediate').total}
              </div>
              <p className="text-xs text-blue-600">Puzzles completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Advanced Level</CardTitle>
              <Star className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {getDifficultyStats('advanced').completed}/{getDifficultyStats('advanced').total}
              </div>
              <p className="text-xs text-red-600">Puzzles completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Puzzle Grid */}
        <TabsContent value="beginner" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles.map((puzzle) => (
              <Card key={puzzle.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getDifficultyColor(puzzle.difficulty)}>
                      {puzzle.difficulty}
                    </Badge>
                    {puzzle.completed && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{puzzle.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {puzzle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {puzzle.timeLimit}m
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1" />
                      {puzzle.rating}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                    onClick={() => navigate(`/play/${puzzle.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {puzzle.completed ? 'Play Again' : 'Start Puzzle'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles.map((puzzle) => (
              <Card key={puzzle.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getDifficultyColor(puzzle.difficulty)}>
                      {puzzle.difficulty}
                    </Badge>
                    {puzzle.completed && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{puzzle.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {puzzle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {puzzle.timeLimit}m
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1" />
                      {puzzle.rating}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                    onClick={() => navigate(`/play/${puzzle.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {puzzle.completed ? 'Play Again' : 'Start Puzzle'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        <TabsContent value="advanced" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPuzzles.map((puzzle) => (
              <Card key={puzzle.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getDifficultyColor(puzzle.difficulty)}>
                      {puzzle.difficulty}
                    </Badge>
                    {puzzle.completed && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{puzzle.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {puzzle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {puzzle.timeLimit}m
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1" />
                      {puzzle.rating}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                    onClick={() => navigate(`/play/${puzzle.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {puzzle.completed ? 'Play Again' : 'Start Puzzle'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PuzzleSelection;