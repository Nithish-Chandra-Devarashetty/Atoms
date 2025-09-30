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
  onNotificationsMarkedAllRead?: (data: { unreadCount?: number; modified?: number; affectedId?: string }) => void;
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

  // Always use the latest callbacks to avoid stale closures across re-renders
  const handlersRef = useRef({
    onPrivateMessageReceived,
    onConversationUpdated,
    onDiscussionReplyReceived,
    onDiscussionCreated,
    onDiscussionLikeUpdated,
    onNotificationCreated,
    onNotificationsMarkedAllRead,
    onContestCreated,
    onUserTypingPrivate,
    onUserTypingDiscussion
  });

  useEffect(() => {
    handlersRef.current = {
      onPrivateMessageReceived,
      onConversationUpdated,
      onDiscussionReplyReceived,
      onDiscussionCreated,
      onDiscussionLikeUpdated,
      onNotificationCreated,
      onNotificationsMarkedAllRead,
      onContestCreated,
      onUserTypingPrivate,
      onUserTypingDiscussion
    };
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
    onUserTypingDiscussion
  ]);

  // Build a Socket.IO base URL that matches the API host but without the trailing /api
  const getSocketBaseUrl = () => {
    // 0) Explicit socket host override (use when API and WS have different origins)
    const explicitSocketUrl = (import.meta as any)?.env?.VITE_SOCKET_URL;
    if (explicitSocketUrl) {
      try {
        const url = new URL(explicitSocketUrl);
        const base = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
        console.log('🔗 WebSocket URL from VITE_SOCKET_URL:', base);
        return base;
      } catch (e) {
        console.error('❌ Invalid VITE_SOCKET_URL:', explicitSocketUrl, e);
      }
    }
    // 1) If VITE_API_URL is provided, derive the origin from it (best for production)
    const envApi = (import.meta as any)?.env?.VITE_API_URL;
    if (envApi) {
      try {
        const url = new URL(envApi);
        // Remove /api suffix if present to get the root URL for socket.io
        const baseUrl = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
        console.log('🔗 Production WebSocket URL derived from VITE_API_URL:', baseUrl);
        return baseUrl;
      } catch (e) {
        console.error('❌ Failed to parse VITE_API_URL for WebSocket:', envApi, e);
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
          const localUrl = `${protocol}//${host}:5000`;
          console.log('🔗 Local dev WebSocket URL:', localUrl);
          return localUrl;
        }
      }
    } catch (e) {
      console.error('❌ Error detecting local environment:', e);
    }

    // 3) Fallbacks
    try {
      const fallback = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:5000/api';
      const url = new URL(fallback);
      const fallbackUrl = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
      console.log('🔗 Fallback WebSocket URL:', fallbackUrl);
      return fallbackUrl;
    } catch (e) {
      console.error('❌ All WebSocket URL strategies failed, using localhost fallback:', e);
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
  console.log('🔌 Connecting to WebSocket at:', socketBaseUrl);
  console.log('🔌 Environment:', (import.meta as any)?.env?.MODE, 'Production:', (import.meta as any)?.env?.PROD);
  
  const socket = io(socketBaseUrl, {
      withCredentials: true,
      // Prefer websocket in prod; some hosts require explicit websocket-only
      transports: (import.meta as any)?.env?.PROD ? ['websocket'] : ['websocket', 'polling'],
      // Allow overriding socket path if the server is mounted on a sub-path
      path: (import.meta as any)?.env?.VITE_SOCKET_PATH || '/socket.io',
      auth: currentUser?._id ? { userId: currentUser._id } : undefined,
      reconnection: true,
      reconnectionAttempts: 10, // Reduced for production
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000, // Increased timeout for production
      // Force new connection to avoid cached connection issues
      forceNew: true,
      // Additional production-friendly options
      upgrade: true,
      rememberUpgrade: true
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully!');
      console.log('✅ Socket ID:', socket.id);
      console.log('✅ Transport:', socket.io.engine.transport.name);
      console.log('✅ Socket URL:', socketBaseUrl);
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
      console.error('❌ Error type:', error.type);
      console.error('❌ Error message:', error.message);
      console.error('❌ Attempted URL:', socketBaseUrl);
      console.error('❌ Transport:', socket.io.engine?.transport?.name || 'unknown');
      setError(`Failed to connect to real-time server: ${error.message || error.type || 'Unknown error'}`);
      setIsConnected(false);
    });

    // Message event handlers
  socket.on('private-message-received', (message: any) => {
      console.log('💌 Private message received via WebSocket:', message);
      handlersRef.current.onPrivateMessageReceived?.(message);
    });

  socket.on('conversation-updated', (data: any) => {
      console.log('🗂️ Conversation updated via WebSocket:', data);
      handlersRef.current.onConversationUpdated?.(data);
    });

  socket.on('discussion-reply-received', (data: any) => {
      console.log('💬 Discussion reply received via WebSocket:', data);
      handlersRef.current.onDiscussionReplyReceived?.(data);
    });

  socket.on('discussion-created', (data: any) => {
      console.log('🆕 Discussion created via WebSocket:', data);
      handlersRef.current.onDiscussionCreated?.(data);
    });

  socket.on('discussion-like-updated', (data: any) => {
      console.log('👍 Discussion like updated via WebSocket:', data);
      handlersRef.current.onDiscussionLikeUpdated?.(data);
    });

    // Notifications
  socket.on('notification-created', (data: any) => {
      console.log('🔔 Notification created via WebSocket:', data);
      handlersRef.current.onNotificationCreated?.(data);
    });

  socket.on('notifications-marked-all-read', (data: any) => {
      console.log('✅ All notifications marked as read via WebSocket:', data);
      handlersRef.current.onNotificationsMarkedAllRead?.(data);
    });

    // Some server flows emit a partial variant when single items are read
    socket.on('notifications-marked-all-read-partial', (data: any) => {
      console.log('✅ Notifications partial read update via WebSocket:', data);
      handlersRef.current.onNotificationsMarkedAllRead?.(data);
    });

    // Contests
  socket.on('contest-created', (data: any) => {
      console.log('🏁 Contest created via WebSocket:', data);
      if (onContestCreated) {
        onContestCreated(data);
      }
    });

    // Typing indicator handlers
  socket.on('user-typing-private', (data: any) => {
      console.log('⌨️ User typing (private):', data);
      handlersRef.current.onUserTypingPrivate?.(data);
    });

  socket.on('user-typing-discussion', (data: any) => {
      console.log('⌨️ User typing (discussion):', data);
      handlersRef.current.onUserTypingDiscussion?.(data);
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
