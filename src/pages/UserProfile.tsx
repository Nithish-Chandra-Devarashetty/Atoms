import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import BadgeDisplay from '../components/BadgeDisplay';
import { 
  Users, 
  Target, 
  Calendar,
  BookOpen,
  Code,
  Brain,
  Calculator,
  MessageCircle,
  UserPlus,
  UserMinus,
  ArrowLeft
} from 'lucide-react';

interface UserProfile {
  _id: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  badges: string[];
  streak: number;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [badgeMetadata, setBadgeMetadata] = useState<any>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);

  useEffect(() => {
    if (userId && userId !== currentUser?._id) {
      fetchUserProfile();
      loadBadgeMetadata();
    } else if (userId === currentUser?._id) {
      // Redirect to own profile page
      navigate('/profile');
    }
  }, [userId, currentUser, navigate]);

  const fetchUserProfile = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
  const response = await apiService.getUserProfile(userId);
  setProfile(response.user);
  setRecentQuizzes(response.recentQuizzes || []);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadBadgeMetadata = async () => {
    try {
      const response = await apiService.getBadgeMetadata();
      setBadgeMetadata(response.badges);
    } catch (e) {
      // non-fatal
    }
  };

  const handleFollow = async () => {
    if (!profile || !userId) return;
    
    setFollowLoading(true);
    try {
      const response = await apiService.followUser(userId);
      setProfile(prev => prev ? {
        ...prev,
        isFollowing: response.isFollowing,
        followersCount: response.followersCount
      } : null);
    } catch (error) {
      console.error('Failed to follow user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    if (userId) {
      navigate(`/messages?user=${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Profile not found'}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Compute progress like Profile page from embedded progress data
  const progressData = (profile as any)?.progress || {};
  const progress = {
    webdev: {
      completed: progressData.webdev ? Object.values(progressData.webdev).filter((p: any) => p?.quizPassed).length : 0,
      total: 6
    },
    core: {
      completed: (progressData.core?.os?.topicsCompleted?.length || 0) +
                 (progressData.core?.dbms?.topicsCompleted?.length || 0) +
                 (progressData.core?.cn?.topicsCompleted?.length || 0),
      total: 29
    },
    dsa: {
      completed: progressData.dsa?.solvedProblems?.length || 0,
      total: 150
    },
    aptitude: {
      completed: progressData.aptitude?.completedTopics?.length || 0,
      total: 8
    }
  };
  const pct = (c: number, t: number) => (t > 0 ? Math.round((c / t) * 100) : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Profile Header - glassmorphism, square corners */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8 text-white relative overflow-hidden">
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white transform rotate-45"></div>
            <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white transform rotate-12"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-white transform -rotate-12"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Photo */}
            <div className="relative">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-6xl font-bold">
                  {profile.displayName[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-white mb-2">{profile.displayName}</h1>
              <p className="text-gray-300 mb-4">Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
              
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-cyan-400">{profile.totalPoints}</div>
                  <div className="text-gray-300 text-sm">Total Points</div>
                </div>
                <div className="text-center">
          <div className="text-3xl font-black text-green-400">{profile.followersCount}</div>
          <div className="text-gray-300 text-sm">Followers</div>
                </div>
                <div className="text-center">
          <div className="text-3xl font-black text-purple-400">{profile.followingCount}</div>
          <div className="text-gray-300 text-sm">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-orange-400">{profile.streak}</div>
                  <div className="text-gray-300 text-sm">Day Streak</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-300 mb-6">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{profile.followingCount} Following</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center justify-center px-6 py-3 font-semibold transition-colors ${
                    profile.isFollowing
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {followLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : profile.isFollowing ? (
                    <UserMinus className="w-5 h-5 mr-2" />
                  ) : (
                    <UserPlus className="w-5 h-5 mr-2" />
                  )}
                  {profile.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  onClick={handleMessage}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges - glassmorphism */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8 text-white">
          <h2 className="text-3xl font-black mb-8">Achievement Badges</h2>
          {profile.badges?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {profile.badges.map((badgeId: string, idx: number) => (
                <BadgeDisplay key={idx} badgeId={badgeId} metadata={badgeMetadata} showName={true} className="mx-auto" />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">No badges yet</div>
          )}
        </div>

        {/* Learning Progress - glassmorphism with bars */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 text-white">
          <h2 className="text-3xl font-black text-white mb-8">Learning Progress</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Code className="w-6 h-6 text-cyan-400 mr-3" />
                <div>
                  <div className="font-semibold text-white">Web Development</div>
                  <div className="text-sm text-gray-300">{progress.webdev.completed}/{progress.webdev.total} modules</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-white/20 h-2">
                  <div className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${pct(progress.webdev.completed, progress.webdev.total)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-300">{pct(progress.webdev.completed, progress.webdev.total)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-green-400 mr-3" />
                <div>
                  <div className="font-semibold text-white">Core CS</div>
                  <div className="text-sm text-gray-300">{progress.core.completed}/{progress.core.total} topics</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-white/20 h-2">
                  <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-400" style={{ width: `${pct(progress.core.completed, progress.core.total)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-300">{pct(progress.core.completed, progress.core.total)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-6 h-6 text-purple-400 mr-3" />
                <div>
                  <div className="font-semibold text-white">DSA Practice</div>
                  <div className="text-sm text-gray-300">{progress.dsa.completed}/{progress.dsa.total} problems</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-white/20 h-2">
                  <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400" style={{ width: `${pct(progress.dsa.completed, progress.dsa.total)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-300">{pct(progress.dsa.completed, progress.dsa.total)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="w-6 h-6 text-orange-400 mr-3" />
                <div>
                  <div className="font-semibold text-white">Aptitude</div>
                  <div className="text-sm text-gray-300">{progress.aptitude.completed}/{progress.aptitude.total} topics</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-white/20 h-2">
                  <div className="h-2 bg-gradient-to-r from-orange-400 to-red-400" style={{ width: `${pct(progress.aptitude.completed, progress.aptitude.total)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-300">{pct(progress.aptitude.completed, progress.aptitude.total)}%</span>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity - glassmorphism */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 text-white mt-8">
          <h2 className="text-3xl font-black text-white mb-8">Recent Activity</h2>
          {recentQuizzes.length ? (
            <div className="space-y-4">
              {recentQuizzes.slice(0, 6).map((quiz: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-cyan-400 mr-3" />
                    <div>
                      <div className="font-medium text-white">{quiz.subject} Quiz</div>
                      <div className="text-sm text-gray-300">Score: {Math.round((quiz.score / quiz.totalQuestions) * 100)}%</div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
};
