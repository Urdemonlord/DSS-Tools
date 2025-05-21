// Decision Support System Types

// Basic data types
export type CriteriaType = 'benefit' | 'cost';

export interface Criteria {
  id: string;
  name: string;
  weight: number;
  importance?: number;
  type: CriteriaType;
  percentage: number;
}

export interface Alternative {
  id: string;
  name: string;
  values: Record<string, number>; // criteriaId -> value
}

export interface DSSData {
  criteria: Criteria[];
  alternatives: Alternative[];
}

// Specific details interfaces for each method
export interface WPDetails {
  vectorS: number;
}

export interface TOPSISDetails {
  positiveDistance: number;
  negativeDistance: number;
}

export interface MOORADetails {
  benefitSum: number;
  costSum: number;
}

export interface MethodResult {
  alternativeId: string;
  score: number;
  rank: number;
  normalizedValues?: Record<string, number>;
  details?: WPDetails | TOPSISDetails | MOORADetails;
}

export interface CalculationResult {
  methodName: string;
  results: MethodResult[];
  timestamp: number;
}