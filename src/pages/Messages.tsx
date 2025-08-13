import React, { useState } from 'react';
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

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export const Messages: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useTheme();

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      lastMessage: 'Thanks for helping with the React hooks!',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      avatar: '👨‍🔬',
      lastMessage: 'Did you solve the binary tree problem?',
      timestamp: '1h ago',
      unread: 0,
      online: true
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: '👩‍🎓',
      lastMessage: 'The CSS Grid tutorial was amazing!',
      timestamp: '3h ago',
      unread: 1,
      online: false
    },
    {
      id: '4',
      name: 'Alex Kumar',
      avatar: '👨‍💼',
      lastMessage: 'Let\'s study together for the aptitude test',
      timestamp: '1d ago',
      unread: 0,
      online: false
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      content: 'Hey! I saw your post about React hooks. Could you help me understand useEffect?',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: '2',
      senderId: 'me',
      content: 'Sure! useEffect is used for side effects in functional components. What specific part are you struggling with?',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      content: 'I don\'t understand the dependency array. When should I include variables in it?',
      timestamp: '10:35 AM',
      type: 'text'
    },
    {
      id: '4',
      senderId: 'me',
      content: 'Great question! You should include any value from component scope that\'s used inside useEffect. This includes props, state, and derived values.',
      timestamp: '10:37 AM',
      type: 'text'
    },
    {
      id: '5',
      senderId: '1',
      content: 'Thanks for helping with the React hooks!',
      timestamp: '10:45 AM',
      type: 'text'
    }
  ];

  const selectedContactData = contacts.find(c => c.id === selectedContact);
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="h-full flex">
        {/* Contacts Sidebar */}
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
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`p-4 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-colors ${
                    selectedContact === contact.id ? 'bg-white/20 border-cyan-500/50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg clip-path-hexagon">
                        {contact.avatar}
                      </div>
                      {contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white truncate">{contact.name}</h3>
                        <span className="text-xs text-gray-400">{contact.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && (
                      <div className="ml-2 w-5 h-5 bg-cyan-500 text-white text-xs flex items-center justify-center">
                        {contact.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContactData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white relative z-10">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white clip-path-hexagon">
                      {selectedContactData.avatar}
                    </div>
                    {selectedContactData.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h2 className="font-semibold text-white">{selectedContactData.name}</h2>
                    <p className="text-sm text-gray-400">
                      {selectedContactData.online ? 'Online' : 'Last seen 2h ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 ${
                        message.senderId === 'me'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'me' ? 'text-cyan-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10 relative z-10">
                <div className="flex items-end space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full p-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      rows={1}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};