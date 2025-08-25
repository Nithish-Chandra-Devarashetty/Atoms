import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
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

  useEffect(() => {
    if (userId && userId !== currentUser?._id) {
      fetchUserProfile();
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
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const badges = profile.badges.map((badge: string) => ({
    name: badge.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon: badge.includes('quiz') ? '🏅' : badge.includes('silver') ? '🥈' : badge.includes('gold') ? '🥇' : '💎',
    type: badge.includes('quiz') ? 'feast' : badge.includes('silver') ? 'silver' : badge.includes('gold') ? 'gold' : 'diamond',
    earned: true
  }));

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

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white relative overflow-hidden">
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
                  <div className="text-3xl font-black text-cyan-400">#{profile.totalPoints}</div>
                  <div className="text-gray-300 text-sm">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">{profile.totalPoints}</div>
                  <div className="text-gray-300 text-sm">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400">{profile.followersCount}</div>
                  <div className="text-gray-300 text-sm">Followers</div>
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
                  className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
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
                  className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        {badges.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8 text-white">
            <h2 className="text-3xl font-black mb-8">Achievement Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge: any, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-lg text-center"
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="font-black text-sm">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Progress */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-white">
          <h2 className="text-3xl font-black mb-8">Learning Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-lg">
              <Code className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-2">Web Dev</h3>
              <p className="text-sm opacity-80">Building modern web applications</p>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-lg">
              <BookOpen className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-2">Core CS</h3>
              <p className="text-sm opacity-80">Computer science fundamentals</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg">
              <Brain className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-2">DSA</h3>
              <p className="text-sm opacity-80">Data structures & algorithms</p>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-lg">
              <Calculator className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-black mb-2">Aptitude</h3>
              <p className="text-sm opacity-80">Logical reasoning & math</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
