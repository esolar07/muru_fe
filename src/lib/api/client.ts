import {
  ApiResponse,
  SymptomCategory,
  GroupedSymptom,
  QuizSession,
  SubmitSymptomsRequest,
  SubmitSymptomsResponse,
} from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Categories
  async getCategories() {
    return this.request<SymptomCategory[]>('/categories');
  }

  // Symptoms
  async getSymptoms(categoryIds?: number[]) {
    const params = categoryIds?.length
      ? `?categoryIds=${categoryIds.join(',')}`
      : '';
    return this.request<GroupedSymptom[]>(`/symptoms${params}`);
  }

  // Quiz Session
  async submitSymptoms(data: SubmitSymptomsRequest) {
    return this.request<SubmitSymptomsResponse>('/quiz/submit-symptoms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSession(sessionId: string) {
    return this.request<QuizSession>(`/quiz/session/${sessionId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
