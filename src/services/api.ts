// Automatically determine and normalize the API base URL
const getApiBaseUrl = () => {
  // In development, if we're accessing via LAN IP, point API to same host:5000
  if ((import.meta as any).env?.DEV && typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    if (!isLocalhost) {
      console.log('🌐 Using network API URL for host:', currentHost);
      return `http://${currentHost}:5000/api`;
    }
  }

  // Use env var or localhost fallback
  const raw = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

  // Normalize to ensure it ends with /api
  let normalized = raw;
  try {
    const url = new URL(raw);
    const path = url.pathname.replace(/\/$/, '');
    if (!/\/api$/.test(path)) {
      url.pathname = `${path}/api`;
    }
    normalized = url.toString().replace(/\/$/, '');
  } catch {
    // If not a valid URL string, fallback to string ops
    normalized = raw.replace(/\/$/, '');
    if (!normalized.endsWith('/api')) normalized = `${normalized}/api`;
  }

  console.log('🔗 API Base URL:', normalized);
  return normalized;
};

const API_BASE_URL = getApiBaseUrl();

// Test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    const data = await response.json();
    console.log('✅ API Connection Test Success:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ API Connection Test Failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

type AuthResponse = {
  message: string;
  token: string;
  user: any;
};

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(adminToken && !token && { Authorization: `Bearer ${adminToken}` })
    };
  }

  // AI Quiz endpoints
  async generateAIQuiz(payload: { track: 'webdev' | 'core'; topic: string; n?: number }) {
    const response = await fetch(`${API_BASE_URL}/aiquiz/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ ...payload, n: payload.n ?? 15 })
    });
    return this.handleResponse<{
      setId: string;
      track: string;
      topic: string;
      questions: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
    }>(response);
  }

  private async handleResponse<T = any>(response: Response): Promise<T> {
    let data: any = {};
    
    try {
      data = await response.json();
    } catch (jsonError) {
      console.warn('Failed to parse JSON response:', jsonError);
      data = { error: 'Invalid response format' };
    }
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data
      });
      
      const error = new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
      (error as any).response = { data, status: response.status };
      throw error;
    }
    
    return data as T;
  }

  // Admin endpoints
  async adminLogin(credentials: { username: string; password: string }): Promise<{ message: string; token: string }> {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  private async fetchWithErrorHandling(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      console.log('🔄 Making API request to:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });
      console.log('✅ API response:', response.status, response.statusText);
      return response;
    } catch (networkError) {
      console.error('❌ Network error:', networkError);
      console.error('Failed to connect to API server. Make sure the server is running on the correct port.');
      throw new Error('Network error: Unable to connect to server');
    }
  }

  // Auth endpoints
  async signup(data: { email: string; password: string; displayName: string }): Promise<AuthResponse> {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  // Alias for signup
  async register(email: string, password: string, displayName: string) {
    return this.signup({ email, password, displayName });
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
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

  // Heartbeat to record active time while user is browsing
  async heartbeat(seconds = 30) {
    const response = await fetch(`${API_BASE_URL}/progress/heartbeat`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ seconds })
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

    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/discussions?${params}`);
    return this.handleResponse(response);
  }

  async createDiscussion(content: string, tags: string[] = []) {
    const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/discussions`, {
      method: 'POST',
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

  // markAllNotificationsRead removed per request

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

  // Certificate endpoints
  async generateWebDevCertificate() {
    const response = await fetch(`${API_BASE_URL}/certificates/webdev/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getUserCertificates() {
    const response = await fetch(`${API_BASE_URL}/certificates/user`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async checkWebDevEligibility() {
    const response = await fetch(`${API_BASE_URL}/certificates/webdev/eligibility`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async verifyCertificate(certificateId: string) {
    const response = await fetch(`${API_BASE_URL}/certificates/verify/${certificateId}`);
    return this.handleResponse(response);
  }

  async getSignedWebDevCertificateUrl() {
    const response = await fetch(`${API_BASE_URL}/certificates/webdev/signed-url`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async downloadWebDevCertificate() {
    const response = await fetch(`${API_BASE_URL}/certificates/webdev/download`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }
    
    // Get the PDF blob and create a download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'Certificate.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Badge endpoints
  async getBadgeMetadata() {
    const response = await fetch(`${API_BASE_URL}/badges/metadata`);
    return this.handleResponse(response);
  }

  // Contest endpoints
  async listContests() {
    const response = await fetch(`${API_BASE_URL}/contests`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getContest(contestId: string) {
    const response = await fetch(`${API_BASE_URL}/contests/${contestId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async submitContest(contestId: string, answers: { questionIndex: number; selectedIndex: number }[]) {
    const response = await fetch(`${API_BASE_URL}/contests/${contestId}/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ answers })
    });
    return this.handleResponse(response);
  }

  async getContestResults(contestId: string) {
    const response = await fetch(`${API_BASE_URL}/contests/${contestId}/results`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getMyContestSubmission(contestId: string) {
    const response = await fetch(`${API_BASE_URL}/contests/${contestId}/my-submission`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getMyParticipatedContests() {
    const response = await fetch(`${API_BASE_URL}/contests/me/participated`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createContest(payload: {
    title: string;
    description?: string;
    startTime: string;
    durationMinutes: number;
    questions: { text: string; options: string[]; correctIndex: number }[];
  }) {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/contests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      },
      body: JSON.stringify(payload)
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();