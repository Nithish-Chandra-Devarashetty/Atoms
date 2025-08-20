const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, displayName: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password, displayName })
    });
    return this.handleResponse(response);
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
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
}

export const apiService = new ApiService();