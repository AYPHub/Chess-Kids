import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronRight, Puzzle, Trophy, BookOpen, Star } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Puzzle className="h-8 w-8 text-blue-600" />,
      title: "Interactive Puzzles",
      description: "Solve chess puzzles at your own pace with visual hints"
    },
    {
      icon: <Trophy className="h-8 w-8 text-green-600" />,
      title: "Track Progress",
      description: "See your improvement and earn achievements"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: "Learning Mode",
      description: "Get hints and learn from your mistakes"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12 py-12">
        <div className="mb-6">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Star className="h-4 w-4 mr-1" />
            Perfect for Kids
          </Badge>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Chess Puzzles for
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Young Champions</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Help your kids master chess through fun, interactive puzzles designed for beginners and intermediate players
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate('/puzzles')}
          >
            Start Solving Puzzles
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate('/progress')}
          >
            View Progress
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                {feature.icon}
              </div>
              <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Kids Love Our Chess Puzzles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Puzzles Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">2</div>
            <div className="text-gray-600">Difficulty Levels</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Kid-Friendly</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of kids improving their chess skills every day</p>
        <Button 
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-200"
          onClick={() => navigate('/puzzles')}
        >
          Begin Your Chess Journey
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;