import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Send, 
  Search, 
  X,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { RealTimeIndicator } from '../components/RealTimeIndicator';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

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
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null); // For new conversations
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  // Real-time updates for messages and conversations
  const handleMessagesUpdate = (newMessages: Message[]) => {
    console.log('🔄 Handling messages update:', newMessages.length, 'messages received');
    console.log('Current messages count:', messages.length);
    
    if (newMessages && newMessages.length >= 0) {
      // Check for differences
      const currentIds = messages.map(m => m._id).sort().join(',');
      const newIds = newMessages.map(m => m._id).sort().join(',');
      
      if (currentIds !== newIds || newMessages.length !== messages.length) {
        console.log('✅ Messages have changed, updating...');
        setMessages(newMessages);
      }
    }
  };

  const handleConversationsUpdate = (newConversations: Conversation[]) => {
    console.log('🔄 Handling conversations update:', newConversations.length, 'conversations received');
    console.log('Current conversations count:', conversations.length);
    
    if (newConversations && newConversations.length >= 0) {
      // Check for differences
      const currentIds = conversations.map(c => c._id).sort().join(',');
      const newIds = newConversations.map(c => c._id).sort().join(',');
      
      if (currentIds !== newIds || newConversations.length !== conversations.length) {
        console.log('✅ Conversations have changed, updating...');
        setConversations(newConversations);
      } else {
        // Check for lastMessage changes
        const hasChanges = newConversations.some(newConv => {
          const currentConv = conversations.find(c => c._id === newConv._id);
          if (!currentConv) return true;
          
          return (
            newConv.lastMessage?._id !== currentConv.lastMessage?._id ||
            newConv.lastActivity !== currentConv.lastActivity
          );
        });
        
        if (hasChanges) {
          console.log('✅ Conversation content has changed, updating...');
          setConversations(newConversations);
        }
      }
    }
  };

  const { lastFetchTimes, isEnabled } = useRealTimeUpdates({
    onMessagesUpdate: handleMessagesUpdate,
    shouldFetchMessages: !!selectedUserId,
    selectedUserId: selectedUserId || undefined,
    
    onConversationsUpdate: handleConversationsUpdate,
    shouldFetchConversations: true,
    
    interval: 2000, // Poll every 2 seconds for messages
    enabled: !loading && !sendingMessage // Don't poll while loading or sending
  });

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
      
      // Immediately fetch latest messages to ensure real-time sync
      setTimeout(() => {
        if (selectedUserId) {
          fetchMessages(selectedUserId);
        }
      }, 500);
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
            Messages
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Connect with fellow learners and stay in touch with your network
          </p>
          
          {/* Real-time indicator */}
          <div className="mt-4 flex justify-center">
            <RealTimeIndicator 
              isConnected={isEnabled}
              lastUpdate={lastFetchTimes.conversations || lastFetchTimes.messages}
              className="text-sm"
            />
          </div>
        </div>

        {/* Main Content - Mobile First Design */}
        <div className="max-w-6xl mx-auto h-[calc(100vh-300px)] lg:h-[calc(100vh-200px)]">
          <div className="lg:flex lg:space-x-6 space-y-6 lg:space-y-0 relative z-10 h-full">
            
            {/* Conversations Sidebar - Mobile responsive */}
            <div className={`lg:w-1/3 ${selectedContact ? 'hidden lg:block' : 'block'} bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col`}>
              {/* Search and New Message */}
              <div className="flex-shrink-0 p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-white">Conversations</h2>
                  <button
                    onClick={() => {
                      setShowNewMessageModal(true);
                      if (suggestedUsers.length === 0) {
                        fetchSuggestedUsers();
                      }
                    }}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg"
                    title="New Message"
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex-shrink-0 mx-6 mt-4 p-4 bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
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
                          setSelectedUserInfo(null);
                          fetchMessages(otherParticipant._id);
                        }}
                        className={`p-6 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300 ${
                          selectedUserId === otherParticipant._id ? 'bg-white/20 border-cyan-500/50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {otherParticipant.photoURL ? (
                              <img
                                src={otherParticipant.photoURL}
                                alt={otherParticipant.displayName}
                                className="w-12 h-12 rounded-full object-cover shadow-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                {otherParticipant.displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-white truncate text-lg">{otherParticipant.displayName}</h3>
                              <span className="text-xs text-gray-400 font-medium">
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
                  <div className="p-8">
                    {loadingSuggestions ? (
                      <div className="text-center text-gray-400 p-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Loading suggested contacts...</p>
                      </div>
                    ) : suggestedUsers.length > 0 ? (
                      <div>
                        <div className="text-center text-gray-400 mb-6">
                          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-semibold">No conversations yet</p>
                          <p className="text-sm">Start chatting with your connections!</p>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-white font-bold text-lg mb-4">Suggested Contacts</h3>
                          {suggestedUsers.slice(0, 5).map((user: any) => (
                            <div
                              key={user._id}
                              onClick={() => startNewConversation(user._id, user)}
                              className="flex items-center p-4 hover:bg-white/5 cursor-pointer transition-all duration-300 border border-white/10"
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
                                <span className="text-white font-semibold">{user.displayName}</span>
                                <p className="text-gray-400 text-sm">{user.totalPoints || 0} points</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 p-8">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold mb-2">No conversations found</p>
                        <p className="text-sm">Follow users from the discussion page to start chatting!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedContact && showMobileConversations ? 'hidden' : 'flex'} lg:flex h-full max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-150px)] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden`}>
          {selectedContact ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex-shrink-0 p-4 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white relative z-10">
                {/* Back button for mobile */}
                <button
                  onClick={() => {
                    setShowMobileConversations(true);
                    setSelectedUserId(null);
                  }}
                  className="lg:hidden mr-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                
                <div 
                  className="flex items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors flex-1"
                  onClick={() => {
                    // Get the user ID to navigate to - use selectedUserId first, then fallback to selectedContact._id
                    const targetUserId = selectedUserId || selectedContact._id;
                    // Make sure we're not navigating to our own profile
                    if (targetUserId && targetUserId !== currentUser._id) {
                      navigate(`/profile?user=${targetUserId}`);
                    }
                  }}
                >
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
                    <h2 className="font-semibold text-white hover:text-cyan-400 transition-colors">{selectedContact.displayName}</h2>
                    <p className="text-sm text-gray-400 hidden sm:block">Click to view profile</p>
                  </div>
                </div>
              </div>

              {/* Messages - Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/20 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end space-x-2 max-w-[80%] sm:max-w-xs lg:max-w-md">
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
                        className={`px-4 py-3 rounded-xl shadow-lg ${
                          message.sender._id === currentUser._id
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender._id === currentUser._id ? 'text-cyan-100' : 'text-gray-300'
                        }`}>
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at Bottom */}
              <div className="flex-shrink-0 p-4 bg-white/5 backdrop-blur-md border-t border-white/10 relative z-10">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/15 transition-all duration-300"
                      rows={1}
                      disabled={sendingMessage}
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px'
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex-shrink-0"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center relative z-10 p-8">
              <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 max-w-md">
                <MessageCircle className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-3">Start a Conversation</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">Select a contact from the sidebar to begin messaging</p>
                <p className="text-gray-400 text-sm">
                  Visit the discussion page to connect with other users and start new conversations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">New Message</h2>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-96">
              {loadingSuggestions ? (
                <div className="text-center text-gray-400 p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                  <p>Loading contacts...</p>
                </div>
              ) : suggestedUsers.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm mb-4">Choose someone to start a conversation with:</p>
                  {suggestedUsers.map((user: any) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        startNewConversation(user._id, user);
                        setShowNewMessageModal(false);
                      }}
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
              ) : (
                <div className="text-center text-gray-400 p-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No contacts found</p>
                  <p className="text-sm">Follow users from the discussion page to start chatting!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default Messages;