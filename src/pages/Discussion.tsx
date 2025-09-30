import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

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
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  // Removed old profile modal states; navigation is used instead
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showMinCharsWarning, setShowMinCharsWarning] = useState(false);

  // Real-time updates with WebSocket
  const handleDiscussionReplyReceived = (data: { discussionId: string; reply: Reply }) => {
    console.log('💬 Received new discussion reply:', data);
    
    // Update the specific discussion with the new reply
    setDiscussions(prev => 
      prev.map(discussion => {
        if (discussion._id === data.discussionId) {
          // Check if reply already exists to prevent duplicates
          const replyExists = discussion.replies.some(reply => reply._id === data.reply._id);
          if (!replyExists) {
            return {
              ...discussion,
              replies: [...discussion.replies, data.reply]
            };
          }
        }
        return discussion;
      })
    );
  };

  const { isConnected, joinDiscussion, leaveDiscussion } = useWebSocket({
    onDiscussionReplyReceived: handleDiscussionReplyReceived,
    onDiscussionCreated: (data: { discussion: Discussion }) => {
      setDiscussions(prev => {
        // Avoid duplicates if this client just created it
        if (prev.some(d => d._id === data.discussion._id)) return prev;
        return [data.discussion, ...prev];
      });
      // Immediately join the new discussion room to receive live updates
      if (data?.discussion?._id) {
        joinDiscussion(data.discussion._id);
      }
    },
    onDiscussionLikeUpdated: (data: { discussionId: string; likes: string[]; likesCount: number; actorId: string; liked: boolean }) => {
      setDiscussions(prev => prev.map(d => {
        if (d._id !== data.discussionId) return d;
        return {
          ...d,
          likes: data.likes
        } as Discussion;
      }));
    },
    enabled: !!currentUser
  });

  // Log WebSocket connection status for debugging
  useEffect(() => {
    console.log('🔗 Discussion WebSocket connection status:', isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);

  // Fallback polling when WebSocket is not connected
  useRealTimeUpdates({
    onDiscussionsUpdate: (items: any[]) => setDiscussions(items as any),
    shouldFetchDiscussions: true,
    discussionsSearchQuery: searchQuery,
    discussionsSelectedTags: selectedTags,
    interval: 12000,
    // Always enable a modest polling cadence in production to cover missed WS events
    enabled: !!currentUser
  });

  // Refresh when the tab gains focus or becomes visible (helps resume quickly after background)
  useEffect(() => {
    const onActivate = () => {
      if (document.visibilityState === 'visible') {
        fetchDiscussions();
      }
    };
    window.addEventListener('focus', onActivate);
    document.addEventListener('visibilitychange', onActivate);
    return () => {
      window.removeEventListener('focus', onActivate);
      document.removeEventListener('visibilitychange', onActivate);
    };
  }, [searchQuery, selectedTags]);

  // Join all visible discussions for real-time updates
  useEffect(() => {
    if (discussions.length > 0 && isConnected) {
      console.log(`🔗 Joining ${discussions.length} discussions for real-time updates`);
      discussions.forEach(discussion => {
        joinDiscussion(discussion._id);
        console.log(`📝 Joined discussion: ${discussion._id}`);
      });
    }
    
    // Cleanup: leave discussions when component unmounts or discussions change
    return () => {
      if (discussions.length > 0 && isConnected) {
        discussions.forEach(discussion => {
          leaveDiscussion(discussion._id);
        });
      }
    };
  }, [discussions, isConnected, joinDiscussion, leaveDiscussion]);

  useEffect(() => {
    fetchDiscussions();
  }, [searchQuery, selectedTags]);

  const fetchDiscussions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching discussions...');
      const response = await apiService.getDiscussions(1, searchQuery, selectedTags);
      console.log('✅ Discussions fetched successfully:', response);
      setDiscussions(response.discussions);
    } catch (err) {
      console.error('❌ Error fetching discussions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load discussions';
      setError(`Network Error: ${errorMessage}. Please check your connection to the server.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Client-side validation
    if (newDiscussion.trim().length < 10) {
  // Show inline helper only after user attempts to post
  setShowMinCharsWarning(true);
      return;
    }

    if (newDiscussion.trim().length > 2000) {
      setError('Discussion content must be less than 2000 characters');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Validate tags
      if (tags.length > 5) {
        setError('Maximum 5 tags are allowed');
        return;
      }
      
      for (const tag of tags) {
        if (tag.length > 20) {
          setError(`Tag "${tag}" is too long. Maximum 20 characters per tag.`);
          return;
        }
      }

      console.log('🔄 Creating discussion:', { content: newDiscussion.trim(), tags });
  const response = await apiService.createDiscussion(newDiscussion.trim(), tags);
  console.log('✅ Discussion created successfully:', response);
  // No local prepend; rely on WS 'discussion-created' to add globally (with duplicate guard already in place)
      setNewDiscussion('');
      setNewTags('');
      
  // No immediate fetch; WS will deliver the created discussion
    } catch (err) {
      console.error('❌ Error creating discussion:', err);
      setError(err instanceof Error ? err.message : 'Failed to create discussion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeDiscussion = async (discussionId: string) => {
    if (!currentUser) return;

    try {
  await apiService.likeDiscussion(discussionId);
  // Rely on WebSocket 'discussion-like-updated' to sync likes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like discussion');
    }
  };

  const handleReply = async (discussionId: string) => {
    if (!currentUser || !replyContent[discussionId]?.trim()) return;

    try {
  await apiService.replyToDiscussion(discussionId, replyContent[discussionId]);
  // Rely on WebSocket 'discussion-reply-received' to append reply
      setReplyContent(prev => ({ ...prev, [discussionId]: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reply');
    }
  };

  const toggleReplies = (discussionId: string) => {
    setShowReplies(prev => ({ ...prev, [discussionId]: !prev[discussionId] }));
  };

  const handleUserClick = (userId: string) => {
    if (currentUser && userId === currentUser._id) {
      navigate('/profile');
    } else {
      navigate(`/user/${userId}`);
    }
  };

  // Removed unused handleMessage; messaging is handled on the Messages page directly

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 relative z-10">
          <h1 className="heading-font text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight">
            Discussion Forum
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Connect with fellow learners, share knowledge, and get help from the community
          </p>
        </div>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto relative z-10">

        {/* Search and Filter */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 mb-6 sm:mb-8 z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6">Search & Filter</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2 sm:gap-4">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
            
            {/* Tag Filter */}
            {getAvailableTags().length > 0 && (
              <div className="flex flex-wrap gap-2 items-start sm:items-center">
                <span className="text-gray-300 mr-2 text-sm sm:text-base whitespace-nowrap">Filter by tags:</span>
                <div className="flex flex-wrap gap-2">
                  {getAvailableTags().map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Discussion Form */}
        {currentUser && (
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 mb-6 sm:mb-8 z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6">Start a Discussion</h2>
            <form onSubmit={handleCreateDiscussion} className="space-y-4 sm:space-y-6">
              <div>
                <textarea
                  value={newDiscussion}
                  onChange={(e) => setNewDiscussion(e.target.value)}
                  placeholder="What would you like to discuss? (minimum 10 characters)"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border transition-all resize-none text-sm sm:text-base ${
                    showMinCharsWarning && newDiscussion.trim().length < 10
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-cyan-500'
                  } text-white placeholder-gray-400 focus:ring-2 focus:border-transparent`}
                  rows={4}
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2 sm:gap-0">
                  <div className="text-xs sm:text-sm">
                    {showMinCharsWarning && newDiscussion.trim().length < 10 ? (
                      <span className="text-red-400">
                        {Math.max(0, 10 - newDiscussion.trim().length)} more characters needed
                      </span>
                    ) : newDiscussion.trim().length >= 10 ? (
                      <span className="text-green-400">✓ Minimum length met</span>
                    ) : null}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {newDiscussion.length}/2000 characters
                  </div>
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Tags (comma-separated, e.g., javascript, react, help) - max 5 tags, 20 chars each"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
                {newTags && (
                  <div className="mt-2 text-xs sm:text-sm text-gray-400">
                    Tags: {newTags.split(',').map(tag => tag.trim()).filter(tag => tag).length}/5
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 font-semibold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 text-sm sm:text-base"
              >
                {submitting ? 'Posting...' : 'Post Discussion'}
              </button>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm mb-6 sm:mb-8 relative z-10 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8 sm:py-12 relative z-10">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-cyan-400"></div>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-4 sm:space-y-6 relative z-10">
          {discussions.map((discussion) => (
            <div key={discussion._id} className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 hover:bg-white/10 transition-all duration-200">
              {/* Discussion Header */}
              <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                  {discussion.author.photoURL ? (
                    <img
                      src={discussion.author.photoURL}
                    alt={discussion.author.displayName}
                    className="w-full h-full rounded-full object-cover cursor-pointer"
                    onClick={() => handleUserClick(discussion.author._id)}
                  />
                  ) : (
                    <div 
                      className="w-full h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold cursor-pointer text-sm sm:text-base"
                      onClick={() => handleUserClick(discussion.author._id)}
                    >
                      {discussion.author.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                    <button
                      onClick={() => handleUserClick(discussion.author._id)}
                      className="font-semibold text-white hover:text-cyan-400 transition-colors text-sm sm:text-base text-left"
                    >
                      {discussion.author.displayName}
                    </button>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {formatDate(discussion.createdAt)}
                    </span>
                  </div>
                  {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {discussion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs sm:text-sm px-2 sm:px-3 py-1 border border-cyan-500/30 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Discussion Content */}
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{discussion.content}</p>
              </div>

              {/* Discussion Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
                <button
                  onClick={() => handleLikeDiscussion(discussion._id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 backdrop-blur-sm transition-all duration-200 text-sm sm:text-base ${
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
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-white/10 text-gray-300 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                >
                  <span>💬</span>
                  <span>{discussion.replies.length}</span>
                </button>
            </div>

            {/* Reply Form */}
            {currentUser && (
              <div className="mb-3 sm:mb-4">
                <div className="flex space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                        {currentUser.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      value={replyContent[discussion._id] || ''}
                      onChange={(e) => setReplyContent(prev => ({ 
                        ...prev, 
                        [discussion._id]: e.target.value 
                      }))}
                      placeholder="Write a reply..."
                      className="flex-1 px-2 sm:px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleReply(discussion._id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleReply(discussion._id)}
                      disabled={!replyContent[discussion._id]?.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 sm:px-4 py-2 font-semibold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 text-sm sm:text-base"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {showReplies[discussion._id] && discussion.replies.length > 0 && (
              <div className="border-l-2 border-cyan-500/30 pl-3 sm:pl-6 space-y-3 sm:space-y-4 bg-white/5 backdrop-blur-sm p-3 sm:p-4">
                {discussion.replies.map((reply) => (
                  <div key={reply._id} className="flex space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                      {reply.author.photoURL ? (
                        <img
                          src={reply.author.photoURL}
                          alt={reply.author.displayName}
                          className="w-full h-full rounded-full object-cover cursor-pointer"
                          onClick={() => handleUserClick(reply.author._id)}
                        />
                      ) : (
                        <div 
                          className="w-full h-full rounded-full bg-green-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold cursor-pointer"
                          onClick={() => handleUserClick(reply.author._id)}
                        >
                          {reply.author.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                        <button
                          onClick={() => handleUserClick(reply.author._id)}
                          className="font-medium text-white hover:text-cyan-400 transition-colors text-sm sm:text-base text-left"
                        >
                          {reply.author.displayName}
                        </button>
                        <span className="text-gray-400 text-xs sm:text-sm">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{reply.content}</p>
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
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">💬</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No discussions yet</h3>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            {currentUser 
              ? "Be the first to start a discussion!" 
              : "Sign in to join the conversation!"
            }
          </p>
        </div>
      )}

  {/* User Profile Modal removed in favor of navigation */}
        </div>
      </div>
    </div>
  );
};