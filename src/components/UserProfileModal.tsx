import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: (userId: string) => void;
}

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

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  isOpen,
  onClose,
  onMessage
}) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUserProfile(userId);
      setProfile(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile || !currentUser) return;
    
    setFollowLoading(true);
    try {
      const response = await apiService.followUser(userId);
      setProfile(prev => prev ? {
        ...prev,
        isFollowing: response.isFollowing,
        followersCount: response.followersCount
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to follow user');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage(userId);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {profile && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {profile.displayName}
                </h3>
                <p className="text-gray-600 text-sm">
                  Member since {formatDate(profile.createdAt)}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {profile.followersCount}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile.followingCount}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              {/* Streak */}
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  🔥 {profile.streak}
                </div>
                <div className="text-sm text-orange-700">Day Streak</div>
              </div>

              {/* Badges */}
              {profile.badges.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                      >
                        🏆 {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {currentUser && currentUser._id !== userId && (
                <div className="flex gap-3">
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      profile.isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {followLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Loading...
                      </div>
                    ) : profile.isFollowing ? (
                      'Unfollow'
                    ) : (
                      'Follow'
                    )}
                  </button>
                  
                  {onMessage && (
                    <button
                      onClick={handleMessage}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Message
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};