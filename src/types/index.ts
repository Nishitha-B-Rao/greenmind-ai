export interface AssessmentResult {
  _id?: string;
  userId?: string;
  carbonScore: number;
  riskLevel: string;
  topEmissionSource: string;
  recommendations: string[];
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  status?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnalysisResult {
  estimatedFoodImpact: string;
  highestOffender: string;
  reason: string;
  ecoAlternative: string;
}

export interface ScanResult {
  success?: boolean;
  analysis?: AnalysisResult | null;
  error?: string;
}
