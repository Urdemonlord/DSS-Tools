import { Criteria, Alternative } from '../types';

// Application constants

export const DSS_METHODS = [
  { id: 'saw', name: 'Simple Additive Weighting (SAW)', description: 'A simple and widely used method that calculates weighted sum of performance ratings.' },
  { id: 'topsis', name: 'TOPSIS', description: 'Technique for Order of Preference by Similarity to Ideal Solution.' },
  { id: 'ahp', name: 'Analytic Hierarchy Process (AHP)', description: 'Structures complex decisions into a hierarchy for analysis.' },
  { id: 'moora', name: 'MOORA', description: 'Multi-Objective Optimization on the basis of Ratio Analysis.' },
  { id: 'smart', name: 'SMART', description: 'Simple Multi-Attribute Rating Technique for ranking alternatives.' },
  { id: 'wp', name: 'Weighted Product (WP)', description: 'Uses multiplication to connect attribute ratings, where each attribute rating must be raised first by the weight of the attribute.' },
] as const;

export type DSSMethodId = typeof DSS_METHODS[number]['id'];

export const LOCALSTORAGE_KEY = 'dss-app-data';

export const DEFAULT_CRITERIA: Criteria[] = [
  { id: 'c1', name: 'Cost', weight: 0.4, type: 'cost', percentage: 40 },
  { id: 'c2', name: 'Quality', weight: 0.3, type: 'benefit', percentage: 30 },
  { id: 'c3', name: 'Delivery Time', weight: 0.3, type: 'cost', percentage: 30 },
];

export const DEFAULT_ALTERNATIVES: Alternative[] = [
  { 
    id: 'a1', 
    name: 'Option A', 
    values: { 
      c1: 1000, 
      c2: 8, 
      c3: 5 
    } 
  },
  { 
    id: 'a2', 
    name: 'Option B', 
    values: { 
      c1: 1500, 
      c2: 9, 
      c3: 3 
    } 
  },
  { 
    id: 'a3', 
    name: 'Option C', 
    values: { 
      c1: 800, 
      c2: 7, 
      c3: 7 
    } 
  },
];