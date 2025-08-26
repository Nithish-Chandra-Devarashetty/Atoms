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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Discussion Forum
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Connect with fellow learners, share knowledge, and get help from the community
          </p>
        </div>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto relative z-10">

        {/* Search and Filter */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8 z-10">
          <h2 className="text-3xl font-black text-white mb-6">Search & Filter</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Tag Filter */}
            {getAvailableTags().length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-300 mr-2">Filter by tags:</span>
                {getAvailableTags().map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Discussion Form */}
        {currentUser && (
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8 z-10">
            <h2 className="text-3xl font-black text-white mb-6">Start a Discussion</h2>
            <form onSubmit={handleCreateDiscussion} className="space-y-6">
              <textarea
                value={newDiscussion}
                onChange={(e) => setNewDiscussion(e.target.value)}
                placeholder="What would you like to discuss?"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                rows={4}
                required
              />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Tags (comma-separated, e.g., javascript, react, help)"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={submitting || !newDiscussion.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 font-semibold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
              >
                {submitting ? 'Posting...' : 'Post Discussion'}
              </button>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 backdrop-blur-sm mb-8 relative z-10">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12 relative z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-6 relative z-10">
          {discussions.map((discussion) => (
            <div key={discussion._id} className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
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
                      className="w-full h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
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
                      className="font-semibold text-white hover:text-cyan-400 transition-colors text-base"
                    >
                      {discussion.author.displayName}
                    </button>
                    <span className="text-gray-400">
                      {formatDate(discussion.createdAt)}
                    </span>
                  </div>
                  {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {discussion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm px-3 py-1 border border-cyan-500/30 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Discussion Content */}
              <div className="mb-6">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">{discussion.content}</p>
              </div>

              {/* Discussion Actions */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleLikeDiscussion(discussion._id)}
                  className={`flex items-center space-x-2 px-4 py-2 backdrop-blur-sm transition-all duration-200 ${
                    currentUser && discussion.likes.includes(currentUser._id)
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                  }`}
                disabled={!currentUser}
              >
                <span>❤️</span>
                <span>{discussion.likes.length}</span>
              </button>
                <button
                  onClick={() => toggleReplies(discussion._id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-gray-300 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
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
                      className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleReply(discussion._id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleReply(discussion._id)}
                      disabled={!replyContent[discussion._id]?.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 font-semibold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {showReplies[discussion._id] && discussion.replies.length > 0 && (
              <div className="border-l-2 border-cyan-500/30 pl-6 space-y-4 bg-white/5 backdrop-blur-sm p-4">
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
                          className="font-medium text-white hover:text-cyan-400 transition-colors"
                        >
                          {reply.author.displayName}
                        </button>
                        <span className="text-gray-400 text-sm">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{reply.content}</p>
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
      </div>
    </div>
  );
};