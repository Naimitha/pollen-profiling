export interface PredictionResult {
  class: string;
  confidence: number;
  probabilities?: Record<string, number>;
}

export interface UploadResponse {
  success: boolean;
  prediction?: PredictionResult;
  error?: string;
}