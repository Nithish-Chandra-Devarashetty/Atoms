import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

interface UseWebSocketOptions {
  // For private messages
  onPrivateMessageReceived?: (message: any) => void;
  onConversationUpdated?: (data: { conversation: any }) => void;
  
  // For discussions
  onDiscussionReplyReceived?: (data: { discussionId: string; reply: any }) => void;
  onDiscussionCreated?: (data: { discussion: any }) => void;
  onDiscussionLikeUpdated?: (data: { discussionId: string; likes: string[]; likesCount: number; actorId: string; liked: boolean }) => void;
  
  // For notifications
  onNotificationCreated?: (notification: any) => void;
  onNotificationsMarkedAllRead?: (data: { unreadCount: number; modified: number }) => void;
  // For contests
  onContestCreated?: (contest: any) => void;
  
  // For typing indicators
  onUserTypingPrivate?: (data: { user: any }) => void;
  onUserTypingDiscussion?: (data: { user: any; discussionId: string }) => void;
  
  // Auto-connect flag
  enabled?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onPrivateMessageReceived,
  onConversationUpdated,
    onDiscussionReplyReceived,
  onDiscussionCreated,
  onDiscussionLikeUpdated,
  onNotificationCreated,
  onNotificationsMarkedAllRead,
  onContestCreated,
    onUserTypingPrivate,
    onUserTypingDiscussion,
    enabled = true
  } = options;

  const { currentUser } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build a Socket.IO base URL that matches the API host but without the trailing /api
  const getSocketBaseUrl = () => {
    try {
      // Prefer the same host the app is loaded from (works for LAN/IP dev too)
      if (typeof window !== 'undefined') {
        const protocol = window.location.protocol;
        const host = window.location.hostname; // localhost or 192.168.x.x
        const port = '5000'; // backend server port
        return `${protocol}//${host}:${port}`;
      }
    } catch {
      // ignore
    }

    // Fallback to VITE_API_URL origin (strip any path like /api)
    const envUrl = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const url = new URL(envUrl);
      // Remove path (like /api)
      return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
    } catch {
      // Last resort
      return 'http://localhost:5000';
    }
  };

  useEffect(() => {
    if (!enabled || !currentUser) {
      return;
    }

    console.log('🔌 Initializing WebSocket connection...');
    
  // Initialize socket connection (must point to server root, not /api)
  const socketBaseUrl = getSocketBaseUrl();
  const socket = io(socketBaseUrl, {
      withCredentials: true,
      transports: ((import.meta as any)?.env?.PROD ? ['websocket'] : ['websocket', 'polling']),
      auth: currentUser?._id ? { userId: currentUser._id } : undefined,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      timeout: 8000
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setIsConnected(true);
      setError(null);
      
      // Join user-specific room for private messages
      if (currentUser._id) {
        socket.emit('join-user-room', currentUser._id);
        console.log(`🔗 Joined user room: user-${currentUser._id}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setError('Failed to connect to real-time server');
      setIsConnected(false);
    });

    // Message event handlers
    socket.on('private-message-received', (message) => {
      console.log('💌 Private message received via WebSocket:', message);
      if (onPrivateMessageReceived) {
        onPrivateMessageReceived(message);
      }
    });

    socket.on('conversation-updated', (data) => {
      console.log('🗂️ Conversation updated via WebSocket:', data);
      if (onConversationUpdated) {
        onConversationUpdated(data);
      }
    });

    socket.on('discussion-reply-received', (data) => {
      console.log('💬 Discussion reply received via WebSocket:', data);
      if (onDiscussionReplyReceived) {
        onDiscussionReplyReceived(data);
      }
    });

    socket.on('discussion-created', (data) => {
      console.log('🆕 Discussion created via WebSocket:', data);
      if (onDiscussionCreated) {
        onDiscussionCreated(data);
      }
    });

    socket.on('discussion-like-updated', (data) => {
      console.log('👍 Discussion like updated via WebSocket:', data);
      if (onDiscussionLikeUpdated) {
        onDiscussionLikeUpdated(data);
      }
    });

    // Notifications
    socket.on('notification-created', (data) => {
      console.log('🔔 Notification created via WebSocket:', data);
      if (onNotificationCreated) {
        onNotificationCreated(data);
      }
    });

    socket.on('notifications-marked-all-read', (data) => {
      console.log('✅ All notifications marked as read via WebSocket:', data);
      if (onNotificationsMarkedAllRead) {
        onNotificationsMarkedAllRead(data);
      }
    });

    // Contests
    socket.on('contest-created', (data) => {
      console.log('🏁 Contest created via WebSocket:', data);
      if (onContestCreated) {
        onContestCreated(data);
      }
    });

    // Typing indicator handlers
    socket.on('user-typing-private', (data) => {
      console.log('⌨️ User typing (private):', data);
      if (onUserTypingPrivate) {
        onUserTypingPrivate(data);
      }
    });

    socket.on('user-typing-discussion', (data) => {
      console.log('⌨️ User typing (discussion):', data);
      if (onUserTypingDiscussion) {
        onUserTypingDiscussion(data);
      }
    });

    // Cleanup function
    return () => {
      console.log('🔌 Cleaning up WebSocket connection...');
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [enabled, currentUser]);

  // Helper functions
  const joinDiscussion = (discussionId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-discussion', discussionId);
      console.log(`🔗 Joined discussion: ${discussionId}`);
    }
  };

  const leaveDiscussion = (discussionId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-discussion', discussionId);
      console.log(`👋 Left discussion: ${discussionId}`);
    }
  };

  const sendPrivateMessage = (recipientId: string, message: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('new-private-message', { recipientId, message });
      console.log(`📨 Sent private message to: ${recipientId}`);
    }
  };

  const sendDiscussionMessage = (discussionId: string, message: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('new-discussion-message', { discussionId, message });
      console.log(`📨 Sent discussion message to: ${discussionId}`);
    }
  };

  const emitTypingPrivate = (recipientId: string) => {
    if (socketRef.current?.connected && currentUser) {
      socketRef.current.emit('private-typing', { 
        recipientId, 
        user: { _id: currentUser._id, displayName: currentUser.displayName } 
      });
    }
  };

  const emitTypingDiscussion = (discussionId: string) => {
    if (socketRef.current?.connected && currentUser) {
      socketRef.current.emit('discussion-typing', { 
        discussionId, 
        user: { _id: currentUser._id, displayName: currentUser.displayName } 
      });
    }
  };

  return {
    isConnected,
    error,
    joinDiscussion,
    leaveDiscussion,
    sendPrivateMessage,
    sendDiscussionMessage,
    emitTypingPrivate,
    emitTypingDiscussion
  };
};
