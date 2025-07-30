import React, { useState } from 'react';
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
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  tags: string[];
  liked: boolean;
}

export const Discussion: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      avatar: '👩‍💻',
      content: 'Can someone explain the difference between let, const, and var in JavaScript? I keep getting confused about their scope and hoisting behavior.',
      timestamp: '2 hours ago',
      likes: 12,
      replies: 8,
      tags: ['JavaScript', 'Variables', 'Scope'],
      liked: false
    },
    {
      id: '2',
      author: 'Mike Rodriguez',
      avatar: '👨‍🔬',
      content: 'Just solved the "Two Sum" problem on LeetCode! The key insight was using a HashMap to store complements. Here\'s my approach...',
      timestamp: '4 hours ago',
      likes: 25,
      replies: 15,
      tags: ['DSA', 'Arrays', 'HashMap'],
      liked: true
    },
    {
      id: '3',
      author: 'Emma Wilson',
      avatar: '👩‍🎓',
      content: 'Struggling with CSS Grid vs Flexbox. When should I use which? Any good resources or rules of thumb?',
      timestamp: '6 hours ago',
      likes: 18,
      replies: 12,
      tags: ['CSS', 'Layout', 'Grid', 'Flexbox'],
      liked: false
    },
    {
      id: '4',
      author: 'Alex Kumar',
      avatar: '👨‍💼',
      content: 'Quick tip: When working with React hooks, always put them at the top level of your component. Don\'t call them inside loops or conditions!',
      timestamp: '1 day ago',
      likes: 34,
      replies: 6,
      tags: ['React', 'Hooks', 'Best Practices'],
      liked: true
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = ['JavaScript', 'React', 'CSS', 'HTML', 'DSA', 'Arrays', 'Python', 'Node.js', 'Database', 'SQL'];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        author: 'You',
        avatar: '👤',
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        replies: 0,
        tags: selectedTags,
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setSelectedTags([]);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Discussion Forum
          </h1>
          <p className="text-xl text-gray-600">
            Connect with fellow learners, ask questions, and share knowledge
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* New Post */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Start a Discussion</h2>
          
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? Ask a question, share a tip, or start a discussion..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {selectedTags.length > 0 && `Tags: ${selectedTags.join(', ')}`}
              </span>
              <button
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg mr-3">
                    {post.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.timestamp}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <User className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Reply className="w-5 h-5" />
                    <span>{post.replies}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>Reply</span>
                  </button>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Load More Discussions
          </button>
        </div>
      </div>
    </div>
  );
};