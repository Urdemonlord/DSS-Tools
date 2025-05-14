// Decision Support System Types

// Basic data types
export type CriteriaType = 'benefit' | 'cost';

export interface Criteria {
  id: string;
  name: string;
  weight: number;
  type: CriteriaType;
  percentage: number; // Add this line
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

// Results types
export interface CalculationDetails {
  intermediateValues?: Record<string, number>;
  steps?: Array<{
    description: string;
    values: Record<string, number>;
  }>;
}

export interface MethodResult {
  alternativeId: string;
  score: number;
  rank: number;
  normalizedValues?: Record<string, number>;
  details?: CalculationDetails; // Replace 'any' with specific type
}

export interface CalculationResult {
  methodName: string;
  results: MethodResult[];
  timestamp: number;
}