const API_BASE_URL = 'http://localhost:5000/api';

type AuthResponse = {
  message: string;
  token: string;
  user: any;
};

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T = any>(response: Response): Promise<T> {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const error = new Error(data.error || 'Request failed');
      (error as any).response = { data };
      throw error;
    }
    
    return data as T;
  }

  // Auth endpoints
  async signup(data: { email: string; password: string; displayName: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // Alias for signup
  async register(email: string, password: string, displayName: string) {
    return this.signup({ email, password, displayName });
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  async getProfile(): Promise<{ user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async logout(): Promise<void> {
    try {
      // If your backend has a logout endpoint, you can call it here
      // await fetch(`${API_BASE_URL}/auth/logout`, {
      //   method: 'POST',
      //   headers: this.getAuthHeaders()
      // });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async updateProfile(data: { displayName?: string; photoURL?: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // Progress endpoints
  async submitQuiz(data: {
    subject: string;
    topic?: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    answers: Array<{
      questionIndex: number;
      selectedAnswer: number;
      isCorrect: boolean;
    }>;
  }) {
    const response = await fetch(`${API_BASE_URL}/progress/quiz`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async markVideoWatched(subject: string, videoId: string, watchTime?: number) {
    const response = await fetch(`${API_BASE_URL}/progress/video-watched`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ subject, videoId, watchTime })
    });
    return this.handleResponse(response);
  }

  async getProgress() {
    const response = await fetch(`${API_BASE_URL}/progress/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getLeaderboard(timeframe = 'all', category = 'overall') {
    const response = await fetch(
      `${API_BASE_URL}/progress/leaderboard?timeframe=${timeframe}&category=${category}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse(response);
  }

  // Discussion endpoints
  async getDiscussions(page = 1, search?: string, tags?: string[]) {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    if (tags?.length) tags.forEach(tag => params.append('tags', tag));

    const response = await fetch(`${API_BASE_URL}/discussions?${params}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createDiscussion(content: string, tags: string[] = []) {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content, tags })
    });
    return this.handleResponse(response);
  }

  async likeDiscussion(discussionId: string) {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/like`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async replyToDiscussion(discussionId: string, content: string) {
    const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/reply`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return this.handleResponse(response);
  }

  // DSA endpoints
  async markProblemSolved(problemName: string, topic: string, difficulty: string) {
    const response = await fetch(`${API_BASE_URL}/dsa/problem/solved`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ problemName, topic, difficulty })
    });
    return this.handleResponse(response);
  }

  async unmarkProblemSolved(problemName: string, topic: string) {
    const response = await fetch(`${API_BASE_URL}/dsa/problem/unsolved`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ problemName, topic })
    });
    return this.handleResponse(response);
  }

  async getDSAProgress() {
    const response = await fetch(`${API_BASE_URL}/dsa/progress`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async getUserProfile(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async followUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getFollowers(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getFollowing(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/following`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async searchUsers(query: string, page = 1) {
    const params = new URLSearchParams({ query, page: page.toString() });
    const response = await fetch(`${API_BASE_URL}/users/search?${params}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Message endpoints
  async getConversations() {
    const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getMessages(userId: string, page = 1) {
    const params = new URLSearchParams({ page: page.toString() });
    const response = await fetch(`${API_BASE_URL}/messages/${userId}?${params}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async sendMessage(recipientId: string, content: string) {
    const response = await fetch(`${API_BASE_URL}/messages/${recipientId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return this.handleResponse(response);
  }

  async markMessagesAsRead(senderId: string) {
    const response = await fetch(`${API_BASE_URL}/messages/${senderId}/read`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getUnreadCount() {
    const response = await fetch(`${API_BASE_URL}/messages/unread/count`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async deleteMessage(messageId: string) {
    const response = await fetch(`${API_BASE_URL}/messages/message/${messageId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Notification endpoints
  async getNotifications(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markNotificationRead(notificationId: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markAllNotificationsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async deleteNotification(notificationId: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async clearAllNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();