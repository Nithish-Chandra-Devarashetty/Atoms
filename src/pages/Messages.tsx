import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  User, 
  Phone, 
  Video, 
  MoreVertical,
  Smile,
  Paperclip,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    displayName: string;
    photoURL?: string;
  }>;
  lastMessage?: {
    _id: string;
    content: string;
    createdAt: string;
    sender: string;
  };
  lastActivity: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    displayName: string;
    photoURL?: string;
  };
  recipient: {
    _id: string;
    displayName: string;
    photoURL?: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

export const Messages: React.FC = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null); // For new conversations
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  useEffect(() => {
    // Check for user parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    if (userId && currentUser) {
      startNewConversation(userId); // This will handle both new and existing conversations
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchConversations = async () => {
    try {
      const response = await apiService.getConversations();
      setConversations(response.conversations);
      
      // If no conversations, fetch suggested users
      if (response.conversations.length === 0) {
        fetchSuggestedUsers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedUsers = async () => {
    if (!currentUser?._id) return;
    
    setLoadingSuggestions(true);
    try {
      const [followersRes, followingRes] = await Promise.all([
        apiService.getFollowers(currentUser._id),
        apiService.getFollowing(currentUser._id)
      ]);
      
      // Combine and deduplicate followers and following
      const allUsers = [
        ...(followersRes.followers || []),
        ...(followingRes.following || [])
      ];
      
      // Remove duplicates
      const uniqueUsers = allUsers.filter((user, index, self) => 
        self.findIndex(u => u._id === user._id) === index
      );
      
      setSuggestedUsers(uniqueUsers);
    } catch (err) {
      console.error('Failed to load suggested users:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await apiService.getMessages(userId);
      setMessages(response.messages);
      // Mark messages as read
      await apiService.markMessagesAsRead(userId);
    } catch (err) {
      // If no messages exist yet (new conversation), just set empty messages
      console.log('No messages found for user, starting new conversation');
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !currentUser) return;

    setSendingMessage(true);
    try {
      const response = await apiService.sendMessage(selectedUserId, newMessage);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      // After first message, clear selectedUserInfo and refresh conversations
      setSelectedUserInfo(null);
      fetchConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const startNewConversation = (userId: string, userInfo?: any) => {
    setSelectedUserId(userId);
    setSelectedUserInfo(userInfo); // Store user info for display
    setMessages([]); // Start with empty messages for new conversation
    // Don't call fetchMessages since there might not be any messages yet
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p._id !== currentUser?._id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant?.displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedConversation = conversations.find(conv => 
    getOtherParticipant(conv)?._id === selectedUserId
  );
  const selectedContact = selectedConversation ? getOtherParticipant(selectedConversation) : selectedUserInfo;

  if (!currentUser) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Sign in to access messages</h2>
          <p className="text-gray-400">You need to be logged in to view your conversations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="h-full flex">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col text-white relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-3xl font-black text-white mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                if (!otherParticipant) return null;

                return (
                  <div
                    key={conversation._id}
                    onClick={() => {
                      setSelectedUserId(otherParticipant._id);
                      setSelectedUserInfo(null); // Clear for existing conversations
                      fetchMessages(otherParticipant._id);
                    }}
                    className={`p-4 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-colors ${
                      selectedUserId === otherParticipant._id ? 'bg-white/20 border-cyan-500/50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        {otherParticipant.photoURL ? (
                          <img
                            src={otherParticipant.photoURL}
                            alt={otherParticipant.displayName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                            {otherParticipant.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white truncate">{otherParticipant.displayName}</h3>
                          <span className="text-xs text-gray-400">
                            {formatTime(conversation.lastActivity)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 truncate">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4">
                {loadingSuggestions ? (
                  <div className="text-center text-gray-400 p-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Loading suggested contacts...</p>
                  </div>
                ) : suggestedUsers.length > 0 ? (
                  <div>
                    <div className="text-center text-gray-400 mb-4">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No conversations yet</p>
                      <p className="text-xs">Start chatting with your connections!</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-sm mb-2">Suggested Contacts</h3>
                      {suggestedUsers.slice(0, 10).map((user: any) => (
                        <div
                          key={user._id}
                          onClick={() => startNewConversation(user._id, user)}
                          className="flex items-center p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="relative">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user.displayName?.[0]?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">{user.displayName}</span>
                            </div>
                            <p className="text-gray-400 text-sm">{user.totalPoints || 0} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 p-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations found</p>
                    <p className="text-sm mt-2">Follow users from the discussion page to start chatting!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white relative z-10">
                <div className="flex items-center">
                  <div className="relative">
                    {selectedContact.photoURL ? (
                      <img
                        src={selectedContact.photoURL}
                        alt={selectedContact.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedContact.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h2 className="font-semibold text-white">{selectedContact.displayName}</h2>
                    <p className="text-sm text-gray-400">Click to view profile</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                      {message.sender._id !== currentUser._id && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {message.sender.photoURL ? (
                            <img
                              src={message.sender.photoURL}
                              alt={message.sender.displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                              {message.sender.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.sender._id === currentUser._id
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === currentUser._id ? 'text-cyan-100' : 'text-gray-400'
                        }`}>
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10 relative z-10">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full p-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      rows={1}
                      disabled={sendingMessage}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center relative z-10">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Start a Conversation</h2>
                <p className="text-gray-400">Select a contact to begin messaging</p>
                <p className="text-gray-500 text-sm mt-2">
                  Visit the discussion page to connect with other users
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};