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

  // Keep latest callbacks in refs to avoid stale closures
  const callbacksRef = useRef({
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
  });

  useEffect(() => {
    callbacksRef.current.onPrivateMessageReceived = onPrivateMessageReceived;
    callbacksRef.current.onConversationUpdated = onConversationUpdated;
    callbacksRef.current.onDiscussionReplyReceived = onDiscussionReplyReceived;
    callbacksRef.current.onDiscussionCreated = onDiscussionCreated;
    callbacksRef.current.onDiscussionLikeUpdated = onDiscussionLikeUpdated;
    callbacksRef.current.onNotificationCreated = onNotificationCreated;
    callbacksRef.current.onNotificationsMarkedAllRead = onNotificationsMarkedAllRead;
    callbacksRef.current.onContestCreated = onContestCreated;
    callbacksRef.current.onUserTypingPrivate = onUserTypingPrivate;
    callbacksRef.current.onUserTypingDiscussion = onUserTypingDiscussion;
  }, [
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
  ]);

  // Build a Socket.IO base URL that matches the API host but without the trailing /api
  const getSocketBaseUrl = () => {
    // 1) If VITE_API_URL is provided, derive the origin from it (best for production)
    const envApi = (import.meta as any)?.env?.VITE_API_URL;
    if (envApi) {
      try {
        const url = new URL(envApi);
        return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
      } catch {
        // fall through to other strategies
      }
    }

    // 2) For local dev, prefer same host with backend port 5000
    try {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname; // localhost or 192.168.x.x
        const isLocal = host === 'localhost' || host === '127.0.0.1' || /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(host);
        if (isLocal) {
          const protocol = window.location.protocol;
          return `${protocol}//${host}:5000`;
        }
      }
    } catch {
      // ignore
    }

    // 3) Fallbacks
    try {
      const fallback = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:5000/api';
      const url = new URL(fallback);
      return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
    } catch {
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

  socket.on('connect_error', (error: any) => {
      console.error('❌ WebSocket connection error:', error);
      setError('Failed to connect to real-time server');
      setIsConnected(false);
    });

    // Message event handlers
  socket.on('private-message-received', (message: any) => {
      console.log('💌 Private message received via WebSocket:', message);
      const cb = callbacksRef.current.onPrivateMessageReceived;
      if (cb) {
        cb(message);
      }
    });

  socket.on('conversation-updated', (data: any) => {
      console.log('🗂️ Conversation updated via WebSocket:', data);
      const cb = callbacksRef.current.onConversationUpdated;
      if (cb) {
        cb(data);
      }
    });

  socket.on('discussion-reply-received', (data: any) => {
      console.log('💬 Discussion reply received via WebSocket:', data);
      const cb = callbacksRef.current.onDiscussionReplyReceived;
      if (cb) {
        cb(data);
      }
    });

  socket.on('discussion-created', (data: any) => {
      console.log('🆕 Discussion created via WebSocket:', data);
      const cb = callbacksRef.current.onDiscussionCreated;
      if (cb) {
        cb(data);
      }
    });

  socket.on('discussion-like-updated', (data: any) => {
      console.log('👍 Discussion like updated via WebSocket:', data);
      const cb = callbacksRef.current.onDiscussionLikeUpdated;
      if (cb) {
        cb(data);
      }
    });

    // Notifications
  socket.on('notification-created', (data: any) => {
      console.log('🔔 Notification created via WebSocket:', data);
      const cb = callbacksRef.current.onNotificationCreated;
      if (cb) {
        cb(data);
      }
    });

  socket.on('notifications-marked-all-read', (data: any) => {
      console.log('✅ All notifications marked as read via WebSocket:', data);
      const cb = callbacksRef.current.onNotificationsMarkedAllRead;
      if (cb) {
        cb(data);
      }
    });

    // Contests
  socket.on('contest-created', (data: any) => {
      console.log('🏁 Contest created via WebSocket:', data);
      const cb = callbacksRef.current.onContestCreated;
      if (cb) {
        cb(data);
      }
    });

    // Typing indicator handlers
  socket.on('user-typing-private', (data: any) => {
      console.log('⌨️ User typing (private):', data);
      const cb = callbacksRef.current.onUserTypingPrivate;
      if (cb) {
        cb(data);
      }
    });

  socket.on('user-typing-discussion', (data: any) => {
      console.log('⌨️ User typing (discussion):', data);
      const cb = callbacksRef.current.onUserTypingDiscussion;
      if (cb) {
        cb(data);
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
