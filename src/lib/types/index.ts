// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Category Types
export interface SymptomCategory {
  id: number;
  name: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

// Symptom Types
export interface Symptom {
  id: number;
  highIndications: string[];
  lowIndications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupedSymptom {
  categoryId: number;
  categoryName: string;
  symptoms: Symptom[];
}

// Quiz Session Types
export interface QuizSession {
  id: number;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  selectedSymptoms?: SelectedSymptom[];
}

export interface SelectedSymptom {
  id: number;
  sessionId: string;
  categoryId: number;
  selectedHighSymptoms: string[];
  selectedLowSymptoms: string[];
  highMatchCount: number;
  lowMatchCount: number;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitSymptomsRequest {
  sessionId?: string;
  symptoms: {
    categoryId: number;
    selectedHighSymptoms: string[];
    selectedLowSymptoms: string[];
  }[];
}

export interface SubmitSymptomsResponse {
  sessionId: string;
  symptomsStored: number;
  symptoms: SelectedSymptom[];
}

// Formula Types
export interface Formula {
  id: number;
  name: string;
  name2: string;
  name3: string;
  name4: string;
  shortDescription: string;
  supports: string;
  specialDetails: string;
  extraDetails: string;
  symptomCategoryId: number;
  createdAt: string;
  updatedAt: string;
  symptomCategory?: {
    id: number;
    name: string;
  };
}

// Recommendation Types
export interface RecommendationStatus {
  id: number;
  name: 'pending' | 'approved' | 'denied';
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: number;
  sessionId: string;
  formulaId: number;
  categoryId: number;
  score: number;
  highMatchCount: number;
  lowMatchCount: number;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  formula: Formula;
  status: RecommendationStatus;
  quizSession?: QuizSession;
}
