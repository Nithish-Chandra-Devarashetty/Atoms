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
    <div className={`h-screen pt-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="h-full flex">
        {/* Contacts Sidebar */}
        <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border-r flex flex-col transition-colors duration-300`}>
          {/* Header */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Messages</h1>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} w-5 h-5`} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300`}
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
                  className={`p-4 border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors ${
                    selectedContact === contact.id ? `${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}` : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                        {contact.avatar}
                      </div>
                      {contact.online && (
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} rounded-full`}></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>{contact.name}</h3>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{contact.timestamp}</span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && (
                      <div className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {contact.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageCircle className={`w-12 h-12 mx-auto mb-4 opacity-50`} />
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
              <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border-b flex items-center justify-between transition-colors duration-300`}>
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      {selectedContactData.avatar}
                    </div>
                    {selectedContactData.online && (
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} rounded-full`}></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedContactData.name}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedContactData.online ? 'Online' : 'Last seen 2h ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === 'me'
                          ? 'bg-blue-600 text-white'
                          : `${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} border`
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t transition-colors duration-300`}>
                <div className="flex items-end space-x-2">
                  <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded-lg transition-colors`}>
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className={`w-full p-3 pr-12 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'} rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300`}
                      rows={1}
                    />
                    <button className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
              <div className="text-center">
                <MessageCircle className={`w-16 h-16 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-4`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Start a Conversation</h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select a contact to begin messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};