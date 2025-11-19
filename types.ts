export interface MoodAnalysis {
  sentimentScore: number; // 1 to 10
  emotionalTone: string[];
  empatheticResponse: string;
  actionableAdvice: string[];
  colorHex: string;
  shortSummary: string;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  text: string;
  analysis: MoodAnalysis | null;
}

export enum ViewState {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  ANALYTICS = 'ANALYTICS'
}