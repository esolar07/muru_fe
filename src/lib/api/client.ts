import {
  ApiResponse,
  SymptomCategory,
  GroupedSymptom,
  QuizSession,
  SubmitSymptomsRequest,
  SubmitSymptomsResponse,
  Formula,
  Recommendation,
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

  async updateCategory(id: number, data: { name: string; details?: string }) {
    return this.request<SymptomCategory>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Symptoms
  async getSymptoms(categoryIds?: number[]) {
    const params = categoryIds?.length
      ? `?categoryIds=${categoryIds.join(',')}`
      : '';
    return this.request<GroupedSymptom[]>(`/symptoms${params}`);
  }

  async updateSymptom(id: number, data: { highIndications: string[]; lowIndications: string[]; symptomCategoryId?: number }) {
    return this.request<any>(`/symptoms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
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

  // Formulas
  async getFormulas() {
    return this.request<Formula[]>('/formulas');
  }

  async getFormulaById(id: number) {
    return this.request<Formula>(`/formulas/${id}`);
  }

  async updateFormula(id: number, data: {
    name: string;
    name2: string;
    name3: string;
    name4?: string;
    shortDescription?: string;
    supports?: string;
    specialDetails?: string;
    extraDetails?: string;
    symptomCategoryId?: number;
  }) {
    return this.request<Formula>(`/formulas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Recommendations
  async getPendingRecommendations() {
    return this.request<Recommendation[]>('/recommendations/pending');
  }

  async updateRecommendationStatus(id: number, status: 'pending' | 'approved' | 'denied') {
    return this.request<Recommendation>(`/recommendations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
