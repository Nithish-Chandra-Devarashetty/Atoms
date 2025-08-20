import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  User, 
  Clock,
  Plus,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';

interface Post {
  id: string;
  _id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  tags: string[];
  liked: boolean;
  authorId?: string;
}

export const Discussion: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {

  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const allTags = ['JavaScript', 'React', 'CSS', 'HTML', 'DSA', 'Arrays', 'Python', 'Node.js', 'Database', 'SQL'];

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      const response = await apiService.getDiscussions();
      const formattedPosts = response.discussions.map((discussion: any) => ({
        id: discussion._id,
        _id: discussion._id,
        author: discussion.author.displayName,
        avatar: discussion.author.photoURL ? '👤' : '👤',
        content: discussion.content,
        timestamp: formatTimestamp(discussion.createdAt),
        likes: discussion.likes.length,
        replies: discussion.replies.length,
        tags: discussion.tags,
        liked: currentUser ? discussion.likes.includes(currentUser._id) : false,
        authorId: discussion.author._id
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Failed to load discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      alert('Please log in to like posts');
      return;
    }

    // Optimistic update
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));

    try {
      await apiService.likeDiscussion(postId);
    } catch (error) {
      console.error('Failed to like discussion:', error);
      // Revert optimistic update
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      ));
    }
  };

  const handleSubmitPost = async () => {
    if (!currentUser) {
      alert('Please log in to create posts');
      return;
    }

    if (!newPost.trim()) return;

    setSubmitting(true);
    try {
      const response = await apiService.createDiscussion(newPost, selectedTags);
      
      // Add new post to the beginning of the list
      const newPostData: Post = {
        id: response.discussion._id,
        _id: response.discussion._id,
        author: currentUser.displayName,
        avatar: currentUser.photoURL ? '👤' : '👤',
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        replies: 0,
        tags: selectedTags,
        liked: false,
        authorId: currentUser._id
      };
      
      setPosts([newPostData, ...posts]);
      setNewPost('');
      setSelectedTags([]);
    } catch (error) {
      console.error('Failed to create discussion:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Discussion Forum
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Connect with fellow learners, ask questions, and share knowledge
          </p>
        </div>

        {/* Search and Filter */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 mb-8 z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* New Post */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 mb-8 z-10">
          <h2 className="text-xl font-black text-white mb-4">Start a Discussion</h2>
          
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? Ask a question, share a tip, or start a discussion..."
            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            rows={4}
          />
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {selectedTags.length > 0 && `Tags: ${selectedTags.join(', ')}`}
              </span>
              <button
                onClick={handleSubmitPost}
                disabled={!newPost.trim() || submitting || !currentUser}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>

        {!currentUser && (
          <div className="relative bg-yellow-500/10 border border-yellow-500/30 p-4 mb-8 text-center z-10">
            <p className="text-yellow-300">Please log in to create posts and participate in discussions.</p>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6 relative z-10">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading discussions...</div>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
            <div key={post.id} className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden">
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg mr-3 clip-path-hexagon">
                    {post.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{post.author}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.timestamp}
                    </div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-300 relative z-10">
                  <User className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-gray-200 mb-4 leading-relaxed relative z-10">{post.content}</p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors font-medium ${
                      post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors font-medium">
                    <Reply className="w-5 h-5" />
                    <span>{post.replies}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors font-medium">
                    <MessageCircle className="w-5 h-5" />
                    <span>Reply</span>
                  </button>
                </div>
                
                <button className="text-gray-500 hover:text-gray-300">
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <div className="text-gray-400">No discussions found</div>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8 relative z-10">
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 transition-colors">
            Load More Discussions
          </button>
        </div>
      </div>
    </div>
  );
};