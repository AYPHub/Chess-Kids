import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  TrendingUp, 
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { useFetch } from '../hooks/useAPI';
import { progressAPI } from '../services/api';
import LoadingSpinner, { LoadingCard } from './LoadingSpinner';
import { ErrorCard } from './ErrorBoundary';

const ProgressDashboard = () => {
  const { data: progress, isLoading, error, refetch } = useFetch(() => progressAPI.get(), []);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Chess Journey</h1>
          <p className="text-lg text-gray-600">Track your progress and celebrate your achievements</p>
        </div>
        <LoadingCard>Loading your progress...</LoadingCard>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Chess Journey</h1>
          <p className="text-lg text-gray-600">Track your progress and celebrate your achievements</p>
        </div>
        <ErrorCard error={error} onRetry={refetch} />
      </div>
    );
  }

  if (!progress) return null;

  const completionRate = (progress.total_puzzles_solved / progress.total_puzzles) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Chess Journey</h1>
        <p className="text-lg text-gray-600">Track your progress and celebrate your achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Puzzles Solved</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{progress.total_puzzles_solved}</div>
            <p className="text-xs text-blue-600">out of {progress.total_puzzles} total</p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{progress.streak}</div>
            <p className="text-xs text-green-600">days in a row</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{progress.average_rating}</div>
            <p className="text-xs text-purple-600">skill level</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Achievements</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {progress.achievements.filter(a => a.earned).length}
            </div>
            <p className="text-xs text-orange-600">earned so far</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress by Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Progress by Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Beginner</span>
                <span className="text-sm text-gray-600">{progress.beginners_solved}/4</span>
              </div>
              <Progress value={(progress.beginners_solved / 4) * 100} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Intermediate</span>
                <span className="text-sm text-gray-600">{progress.intermediate_solved}/4</span>
              </div>
              <Progress value={(progress.intermediate_solved / 4) * 100} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Advanced</span>
                <span className="text-sm text-gray-600">{progress.advanced_solved}/6</span>
              </div>
              <Progress value={(progress.advanced_solved / 6) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    achievement.earned 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    achievement.earned ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${
                      achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </div>
                    <div className={`text-xs ${
                      achievement.earned ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Earned!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.recent_activity.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No activity yet. Start solving puzzles!
                </p>
              ) : (
                progress.recent_activity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.result === 'solved' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {activity.result === 'solved' ? (
                          <Trophy className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{activity.puzzle}</div>
                        <div className="text-xs text-gray-600">{new Date(activity.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">{formatTime(activity.time)}</div>
                      <Badge variant={activity.result === 'solved' ? 'default' : 'destructive'} className="text-xs">
                        {activity.result}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Section */}
      <div className="mt-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">Keep Going, Champion!</h2>
        <p className="text-lg opacity-90 mb-4">
          You've solved {progress.total_puzzles_solved} puzzles! 
          {progress.total_puzzles_solved < 5 && " You're just getting started!"}
          {progress.total_puzzles_solved >= 5 && progress.total_puzzles_solved < 10 && " You're making great progress!"}
          {progress.total_puzzles_solved >= 10 && " You're becoming a chess master!"}
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            Next goal: {progress.total_puzzles_solved + 1} puzzles
          </div>
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            Keep your {progress.streak}-day streak alive!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
  
  const completionRate = (progress.totalPuzzlesSolved / progress.totalPuzzles) * 100;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Chess Journey</h1>
        <p className="text-lg text-gray-600">Track your progress and celebrate your achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Puzzles Solved</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{progress.totalPuzzlesSolved}</div>
            <p className="text-xs text-blue-600">out of {progress.totalPuzzles} total</p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{progress.streak}</div>
            <p className="text-xs text-green-600">days in a row</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{progress.averageRating}</div>
            <p className="text-xs text-purple-600">skill level</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Achievements</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {progress.achievements.filter(a => a.earned).length}
            </div>
            <p className="text-xs text-orange-600">earned so far</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress by Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Progress by Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Beginner</span>
                <span className="text-sm text-gray-600">{progress.beginnersSolved}/4</span>
              </div>
              <Progress value={(progress.beginnersSolved / 4) * 100} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Intermediate</span>
                <span className="text-sm text-gray-600">{progress.intermediateSolved}/4</span>
              </div>
              <Progress value={(progress.intermediateSolved / 4) * 100} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Advanced</span>
                <span className="text-sm text-gray-600">{progress.advancedSolved}/6</span>
              </div>
              <Progress value={(progress.advancedSolved / 6) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    achievement.earned 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    achievement.earned ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${
                      achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </div>
                    <div className={`text-xs ${
                      achievement.earned ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Earned!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.result === 'solved' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {activity.result === 'solved' ? (
                        <Trophy className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{activity.puzzle}</div>
                      <div className="text-xs text-gray-600">{activity.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{formatTime(activity.time)}</div>
                    <Badge variant={activity.result === 'solved' ? 'default' : 'destructive'} className="text-xs">
                      {activity.result}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Section */}
      <div className="mt-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">Keep Going, Champion!</h2>
        <p className="text-lg opacity-90 mb-4">
          You've solved {progress.totalPuzzlesSolved} puzzles! 
          {progress.totalPuzzlesSolved < 5 && " You're just getting started!"}
          {progress.totalPuzzlesSolved >= 5 && progress.totalPuzzlesSolved < 10 && " You're making great progress!"}
          {progress.totalPuzzlesSolved >= 10 && " You're becoming a chess master!"}
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            Next goal: {progress.totalPuzzlesSolved + 1} puzzles
          </div>
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            Keep your {progress.streak}-day streak alive!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;