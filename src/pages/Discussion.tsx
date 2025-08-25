import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { UserProfileModal } from '../components/UserProfileModal';

interface Discussion {
  _id: string;
  author: {
    _id: string;
    displayName: string;
    photoURL?: string;
  };
  content: string;
  tags: string[];
  likes: string[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

interface Reply {
  _id: string;
  author: {
    _id: string;
    displayName: string;
    photoURL?: string;
  };
  content: string;
  likes: string[];
  createdAt: string;
}

export const Discussion: React.FC = () => {
  const { currentUser } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchDiscussions();
  }, [searchQuery, selectedTags]);

  const fetchDiscussions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getDiscussions(1, searchQuery, selectedTags);
      setDiscussions(response.discussions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newDiscussion.trim()) return;

    setSubmitting(true);
    try {
      const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await apiService.createDiscussion(newDiscussion, tags);
      setDiscussions(prev => [response.discussion, ...prev]);
      setNewDiscussion('');
      setNewTags('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create discussion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeDiscussion = async (discussionId: string) => {
    if (!currentUser) return;

    try {
      const response = await apiService.likeDiscussion(discussionId);
      setDiscussions(prev => prev.map(discussion => 
        discussion._id === discussionId 
          ? {
              ...discussion,
              likes: response.liked 
                ? [...discussion.likes, currentUser._id]
                : discussion.likes.filter(id => id !== currentUser._id)
            }
          : discussion
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like discussion');
    }
  };

  const handleReply = async (discussionId: string) => {
    if (!currentUser || !replyContent[discussionId]?.trim()) return;

    try {
      const response = await apiService.replyToDiscussion(discussionId, replyContent[discussionId]);
      setDiscussions(prev => prev.map(discussion => 
        discussion._id === discussionId 
          ? { ...discussion, replies: [...discussion.replies, response.reply] }
          : discussion
      ));
      setReplyContent(prev => ({ ...prev, [discussionId]: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reply');
    }
  };

  const toggleReplies = (discussionId: string) => {
    setShowReplies(prev => ({ ...prev, [discussionId]: !prev[discussionId] }));
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowProfileModal(true);
  };

  const handleMessage = (userId: string) => {
    // Navigate to messages page with the selected user
    window.location.href = `/messages?user=${userId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailableTags = () => {
    const allTags = discussions.flatMap(d => d.tags);
    return [...new Set(allTags)];
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Discussion Forum</h1>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Tag Filter */}
        {getAvailableTags().length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Filter by tags:</span>
            {getAvailableTags().map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Discussion Form */}
      {currentUser && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Start a Discussion</h2>
          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <textarea
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
              placeholder="What would you like to discuss?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (comma-separated, e.g., javascript, react, help)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={submitting || !newDiscussion.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Posting...' : 'Post Discussion'}
            </button>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Discussions List */}
      <div className="space-y-6">
        {discussions.map((discussion) => (
          <div key={discussion._id} className="bg-white rounded-lg shadow-md p-6">
            {/* Discussion Header */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-10 h-10 flex-shrink-0">
                {discussion.author.photoURL ? (
                  <img
                    src={discussion.author.photoURL}
                    alt={discussion.author.displayName}
                    className="w-full h-full rounded-full object-cover cursor-pointer"
                    onClick={() => handleUserClick(discussion.author._id)}
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
                    onClick={() => handleUserClick(discussion.author._id)}
                  >
                    {discussion.author.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <button
                    onClick={() => handleUserClick(discussion.author._id)}
                    className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {discussion.author.displayName}
                  </button>
                  <span className="text-gray-500 text-sm">
                    {formatDate(discussion.createdAt)}
                  </span>
                </div>
                {discussion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {discussion.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Discussion Content */}
            <div className="mb-4">
              <p className="text-gray-800 whitespace-pre-wrap">{discussion.content}</p>
            </div>

            {/* Discussion Actions */}
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => handleLikeDiscussion(discussion._id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  currentUser && discussion.likes.includes(currentUser._id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                disabled={!currentUser}
              >
                <span>❤️</span>
                <span>{discussion.likes.length}</span>
              </button>
              <button
                onClick={() => toggleReplies(discussion._id)}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>💬</span>
                <span>{discussion.replies.length}</span>
              </button>
            </div>

            {/* Reply Form */}
            {currentUser && (
              <div className="mb-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 flex-shrink-0">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        {currentUser.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={replyContent[discussion._id] || ''}
                      onChange={(e) => setReplyContent(prev => ({ 
                        ...prev, 
                        [discussion._id]: e.target.value 
                      }))}
                      placeholder="Write a reply..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleReply(discussion._id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleReply(discussion._id)}
                      disabled={!replyContent[discussion._id]?.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {showReplies[discussion._id] && discussion.replies.length > 0 && (
              <div className="border-l-2 border-gray-200 pl-4 space-y-3">
                {discussion.replies.map((reply) => (
                  <div key={reply._id} className="flex space-x-3">
                    <div className="w-8 h-8 flex-shrink-0">
                      {reply.author.photoURL ? (
                        <img
                          src={reply.author.photoURL}
                          alt={reply.author.displayName}
                          className="w-full h-full rounded-full object-cover cursor-pointer"
                          onClick={() => handleUserClick(reply.author._id)}
                        />
                      ) : (
                        <div 
                          className="w-full h-full rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
                          onClick={() => handleUserClick(reply.author._id)}
                        >
                          {reply.author.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <button
                          onClick={() => handleUserClick(reply.author._id)}
                          className="font-medium text-gray-800 hover:text-blue-600 transition-colors text-sm"
                        >
                          {reply.author.displayName}
                        </button>
                        <span className="text-gray-500 text-xs">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && discussions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No discussions yet</h3>
          <p className="text-gray-500 mb-4">
            {currentUser 
              ? "Be the first to start a discussion!" 
              : "Sign in to join the conversation!"
            }
          </p>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileModal
          userId={selectedUserId}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedUserId(null);
          }}
          onMessage={handleMessage}
        />
      )}
    </div>
  );
};