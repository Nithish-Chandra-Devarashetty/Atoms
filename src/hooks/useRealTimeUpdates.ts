import { useEffect, useRef } from 'react';
import { apiService } from '../services/api';

interface UseRealTimeUpdatesOptions {
  // For discussions
  onDiscussionsUpdate?: (discussions: any[]) => void;
  shouldFetchDiscussions?: boolean;
  discussionsSearchQuery?: string;
  discussionsSelectedTags?: string[];
  
  // For messages
  onMessagesUpdate?: (messages: any[]) => void;
  shouldFetchMessages?: boolean;
  selectedUserId?: string;
  
  // For conversations
  onConversationsUpdate?: (conversations: any[]) => void;
  shouldFetchConversations?: boolean;
  
  // For notifications
  onNotificationsUpdate?: (notifications: any[]) => void;
  shouldFetchNotifications?: boolean;
  
  // Polling interval in milliseconds (default: 5 seconds for more responsive updates)
  interval?: number;
  
  // Enable/disable real-time updates
  enabled?: boolean;
}

export const useRealTimeUpdates = (options: UseRealTimeUpdatesOptions) => {
  const {
    onDiscussionsUpdate,
    shouldFetchDiscussions = false,
    discussionsSearchQuery = '',
    discussionsSelectedTags = [],
    
    onMessagesUpdate,
    shouldFetchMessages = false,
    selectedUserId,
    
    onConversationsUpdate,
    shouldFetchConversations = false,
    
    onNotificationsUpdate,
    shouldFetchNotifications = false,
    
    interval = 5000, // 5 seconds for faster updates
    enabled = true
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<{ [key: string]: number }>({});

  const fetchDiscussions = async () => {
    try {
      console.log('🔄 Fetching discussions for real-time update...');
      const response = await apiService.getDiscussions(1, discussionsSearchQuery, discussionsSelectedTags);
      if (response.discussions && onDiscussionsUpdate) {
        console.log('✅ Discussions fetched:', response.discussions.length, 'items');
        onDiscussionsUpdate(response.discussions);
      }
      lastFetchTimeRef.current.discussions = Date.now();
    } catch (error) {
      console.error('❌ Real-time discussions fetch failed:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUserId) return;
    
    try {
      console.log('🔄 Fetching messages for real-time update...');
      const response = await apiService.getMessages(selectedUserId, 1);
      if (response.messages && onMessagesUpdate) {
        console.log('✅ Messages fetched:', response.messages.length, 'items');
        onMessagesUpdate(response.messages);
      }
      lastFetchTimeRef.current.messages = Date.now();
    } catch (error) {
      console.error('❌ Real-time messages fetch failed:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      console.log('🔄 Fetching conversations for real-time update...');
      const response = await apiService.getConversations();
      if (response.conversations && onConversationsUpdate) {
        console.log('✅ Conversations fetched:', response.conversations.length, 'items');
        onConversationsUpdate(response.conversations);
      }
      lastFetchTimeRef.current.conversations = Date.now();
    } catch (error) {
      console.error('❌ Real-time conversations fetch failed:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      console.log('🔄 Fetching notifications for real-time update...');
      const response = await apiService.getNotifications(1, 10);
      if (response.notifications && onNotificationsUpdate) {
        console.log('✅ Notifications fetched:', response.notifications.length, 'items');
        onNotificationsUpdate(response.notifications);
      }
      lastFetchTimeRef.current.notifications = Date.now();
    } catch (error) {
      console.error('❌ Real-time notifications fetch failed:', error);
    }
  };

  const performUpdates = async () => {
    console.log('🔄 Performing real-time updates check...');
    
    // Fetch updates more aggressively - don't wait for full interval for each type
    if (shouldFetchDiscussions) {
      await fetchDiscussions();
    }
    
    if (shouldFetchMessages) {
      await fetchMessages();
    }
    
    if (shouldFetchConversations) {
      await fetchConversations();
    }
    
    if (shouldFetchNotifications) {
      await fetchNotifications();
    }
  };

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(performUpdates, interval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    enabled,
    interval,
    shouldFetchDiscussions,
    shouldFetchMessages,
    shouldFetchConversations,
    shouldFetchNotifications,
    selectedUserId,
    discussionsSearchQuery,
    JSON.stringify(discussionsSelectedTags) // Convert array to string for dependency check
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Function to manually trigger updates
  const triggerUpdate = () => {
    if (enabled) {
      performUpdates();
    }
  };

  return {
    triggerUpdate,
    lastFetchTimes: lastFetchTimeRef.current,
    isEnabled: enabled,
    interval
  };
};
