import { Alternative, Criteria, MethodResult } from '../types';

/**
 * Simple Additive Weighting (SAW) Method
 * Calculates the weighted sum of performance ratings for each alternative.
 */
export const calculateSAW = (
  criteria: Criteria[],
  alternatives: Alternative[]
): MethodResult[] => {
  // Validation
  if (!criteria.length || !alternatives.length) {
    return [];
  }

  // Normalize values
  const normalizedValues = alternatives.map((alt) => {
    const normalized: Record<string, number> = {};

    criteria.forEach((criterion) => {
      const value = alt.values[criterion.id] || 0;
      const values = alternatives.map(a => a.values[criterion.id] || 0);
      
      if (criterion.type === 'benefit') {
        // For benefit criteria, higher values are better
        const maxValue = Math.max(...values);
        normalized[criterion.id] = maxValue !== 0 ? value / maxValue : 0;
      } else {
        // For cost criteria, lower values are better
        const minValue = Math.min(...values.filter(v => v > 0));
        normalized[criterion.id] = value !== 0 ? minValue / value : 0;
      }
    });

    return { alternativeId: alt.id, normalizedValues: normalized };
  });

  // Calculate weighted sums
  const results = normalizedValues.map((altData) => {
    let score = 0;
    
    criteria.forEach((criterion) => {
      score += (altData.normalizedValues[criterion.id] || 0) * criterion.weight;
    });

    return {
      alternativeId: altData.alternativeId,
      score,
      normalizedValues: altData.normalizedValues,
      rank: 0, // Will be calculated after sorting
    };
  });

  // Sort by score and assign ranks
  return assignRanks(results);
};

/**
 * TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) Method
 */
export const calculateTOPSIS = (
  criteria: Criteria[],
  alternatives: Alternative[]
): MethodResult[] => {
  // Validation
  if (!criteria.length || !alternatives.length) {
    return [];
  }

  // Step 1: Create normalized decision matrix
  const normalizedValues = alternatives.map((alt) => {
    const normalized: Record<string, number> = {};

    criteria.forEach((criterion) => {
      const values = alternatives.map(a => a.values[criterion.id] || 0);
      const squareSum = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val, 2), 0));
      const value = alt.values[criterion.id] || 0;
      normalized[criterion.id] = squareSum !== 0 ? value / squareSum : 0;
    });

    return { alternativeId: alt.id, normalizedValues: normalized };
  });

  // Step 2: Calculate weighted normalized decision matrix
  const weightedNormalized = normalizedValues.map((altData) => {
    const weighted: Record<string, number> = {};
    
    criteria.forEach((criterion) => {
      weighted[criterion.id] = (altData.normalizedValues[criterion.id] || 0) * criterion.weight;
    });

    return { alternativeId: altData.alternativeId, weightedValues: weighted };
  });

  // Step 3: Determine ideal and negative-ideal solutions
  const idealSolution: Record<string, number> = {};
  const negativeIdealSolution: Record<string, number> = {};

  criteria.forEach((criterion) => {
    const weightedValues = weightedNormalized.map(a => a.weightedValues[criterion.id] || 0);
    
    if (criterion.type === 'benefit') {
      idealSolution[criterion.id] = Math.max(...weightedValues);
      negativeIdealSolution[criterion.id] = Math.min(...weightedValues);
    } else {
      idealSolution[criterion.id] = Math.min(...weightedValues);
      negativeIdealSolution[criterion.id] = Math.max(...weightedValues);
    }
  });

  // Step 4: Calculate separation measures
  const separationMeasures = weightedNormalized.map((altData) => {
    let positiveDistance = 0;
    let negativeDistance = 0;

    criteria.forEach((criterion) => {
      const value = altData.weightedValues[criterion.id] || 0;
      positiveDistance += Math.pow(value - idealSolution[criterion.id], 2);
      negativeDistance += Math.pow(value - negativeIdealSolution[criterion.id], 2);
    });

    positiveDistance = Math.sqrt(positiveDistance);
    negativeDistance = Math.sqrt(negativeDistance);

    return {
      alternativeId: altData.alternativeId,
      positiveDistance,
      negativeDistance,
    };
  });

  // Step 5: Calculate performance score (relative closeness to the ideal solution)
  const results = separationMeasures.map((sep) => {
    const score = sep.negativeDistance / (sep.positiveDistance + sep.negativeDistance);
    
    return {
      alternativeId: sep.alternativeId,
      score: isNaN(score) ? 0 : score,
      details: {
        positiveDistance: sep.positiveDistance,
        negativeDistance: sep.negativeDistance,
      },
      rank: 0, // Will be calculated after sorting
    };
  });

  // Sort by score and assign ranks
  return assignRanks(results);
};

/**
 * MOORA (Multi-Objective Optimization on the basis of Ratio Analysis) Method
 */
export const calculateMOORA = (
  criteria: Criteria[],
  alternatives: Alternative[]
): MethodResult[] => {
  // Validation
  if (!criteria.length || !alternatives.length) {
    return [];
  }

  // Step 1: Create normalized decision matrix
  const normalizedValues = alternatives.map((alt) => {
    const normalized: Record<string, number> = {};

    criteria.forEach((criterion) => {
      const values = alternatives.map(a => a.values[criterion.id] || 0);
      const squareSum = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val, 2), 0));
      const value = alt.values[criterion.id] || 0;
      normalized[criterion.id] = squareSum !== 0 ? value / squareSum : 0;
    });

    return { alternativeId: alt.id, normalizedValues: normalized };
  });

  // Step 2: Calculate weighted normalized values
  const weightedNormalized = normalizedValues.map((altData) => {
    const weighted: Record<string, number> = {};
    
    criteria.forEach((criterion) => {
      weighted[criterion.id] = (altData.normalizedValues[criterion.id] || 0) * criterion.weight;
    });

    return { alternativeId: altData.alternativeId, weightedValues: weighted };
  });

  // Step 3: Determine the performance score (sum of benefit criteria - sum of cost criteria)
  const results = weightedNormalized.map((altData) => {
    let benefitSum = 0;
    let costSum = 0;

    criteria.forEach((criterion) => {
      const value = altData.weightedValues[criterion.id] || 0;
      if (criterion.type === 'benefit') {
        benefitSum += value;
      } else {
        costSum += value;
      }
    });

    return {
      alternativeId: altData.alternativeId,
      score: benefitSum - costSum,
      details: {
        benefitSum,
        costSum,
      },
      rank: 0, // Will be calculated after sorting
    };
  });

  // Sort by score and assign ranks
  return assignRanks(results);
};

/**
 * SMART (Simple Multi-Attribute Rating Technique) Method
 */
export const calculateSMART = (
  criteria: Criteria[],
  alternatives: Alternative[]
): MethodResult[] => {
  // Validation
  if (!criteria.length || !alternatives.length) {
    return [];
  }

  // Normalize weights to sum to 1
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const normalizedWeights = criteria.reduce<Record<string, number>>((result, criterion) => {
    result[criterion.id] = totalWeight !== 0 ? criterion.weight / totalWeight : 0;
    return result;
  }, {});

  // Step 1: Find min and max values for each criterion
  const minMaxValues: Record<string, { min: number; max: number }> = {};
  
  criteria.forEach((criterion) => {
    const values = alternatives.map(a => a.values[criterion.id] || 0).filter(v => v > 0);
    minMaxValues[criterion.id] = {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
    };
  });

  // Step 2: Calculate utility values
  const utilityValues = alternatives.map((alt) => {
    const utilities: Record<string, number> = {};
    
    criteria.forEach((criterion) => {
      const value = alt.values[criterion.id] || 0;
      const { min, max } = minMaxValues[criterion.id];
      
      // Skip if min and max are the same (to avoid division by zero)
      if (min === max) {
        utilities[criterion.id] = 0;
        return;
      }
      
      if (criterion.type === 'benefit') {
        utilities[criterion.id] = (value - min) / (max - min);
      } else {
        utilities[criterion.id] = (max - value) / (max - min);
      }
    });

    return { alternativeId: alt.id, utilities };
  });

  // Step 3: Calculate weighted utility scores
  const results = utilityValues.map((altData) => {
    let score = 0;
    
    criteria.forEach((criterion) => {
      score += (altData.utilities[criterion.id] || 0) * normalizedWeights[criterion.id];
    });

    return {
      alternativeId: altData.alternativeId,
      score,
      normalizedValues: altData.utilities,
      rank: 0, // Will be calculated after sorting
    };
  });

  // Sort by score and assign ranks
  return assignRanks(results);
};

/**
 * Simplified AHP (Analytic Hierarchy Process) Method
 * This is a simplified version that doesn't include pairwise comparisons
 */
export const calculateAHP = (
  criteria: Criteria[],
  alternatives: Alternative[]
): MethodResult[] => {
  // Validation
  if (!criteria.length || !alternatives.length) {
    return [];
  }

  // Normalize weights to sum to 1
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const normalizedWeights = criteria.reduce<Record<string, number>>((result, criterion) => {
    result[criterion.id] = totalWeight !== 0 ? criterion.weight / totalWeight : 0;
    return result;
  }, {});

  // Step 1: Normalize values for each criterion
  const normalizedValues = alternatives.map((alt) => {
    const normalized: Record<string, number> = {};

    criteria.forEach((criterion) => {
      const values = alternatives.map(a => a.values[criterion.id] || 0);
      const sum = values.reduce((total, val) => total + val, 0);
      const value = alt.values[criterion.id] || 0;
      
      // For cost criteria, we invert the values before normalizing
      if (criterion.type === 'cost' && value > 0) {
        // Using reciprocal for cost criteria
        const reciprocal = 1 / value;
        const reciprocalSum = values.reduce((total, val) => total + (val > 0 ? 1 / val : 0), 0);
        normalized[criterion.id] = reciprocalSum !== 0 ? reciprocal / reciprocalSum : 0;
      } else {
        normalized[criterion.id] = sum !== 0 ? value / sum : 0;
      }
    });

    return { alternativeId: alt.id, normalizedValues: normalized };
  });

  // Step 2: Calculate weighted sums
  const results = normalizedValues.map((altData) => {
    let score = 0;
    
    criteria.forEach((criterion) => {
      score += (altData.normalizedValues[criterion.id] || 0) * normalizedWeights[criterion.id];
    });

    return {
      alternativeId: altData.alternativeId,
      score,
      normalizedValues: altData.normalizedValues,
      rank: 0, // Will be calculated after sorting
    };
  });

  // Sort by score and assign ranks
  return assignRanks(results);
};

/**
 * Weighted Product (WP) Method
 * Uses multiplication to connect attribute ratings, where each attribute rating must be raised first by the weight of the attribute
 */
export const calculateWP = (
  criteria: Criteria[],
  alternatives: Alternative[]
): MethodResult[] => {
  // Validation
  if (!criteria.length || !alternatives.length) {
    return [];
  }

  // Step 1: Calculate vector S (power of weighted values)
  const vectorS = alternatives.map((alt) => {
    let s = 1;
    
    criteria.forEach((criterion) => {
      const value = alt.values[criterion.id] || 0;
      if (criterion.type === 'benefit') {
        s *= Math.pow(value, criterion.weight);
      } else {
        s *= Math.pow(value, -criterion.weight);
      }
    });

    return {
      alternativeId: alt.id,
      s,
    };
  });

  // Step 2: Calculate vector V (normalized values)
  const sumS = vectorS.reduce((sum, item) => sum + item.s, 0);
  
  const results = vectorS.map((item) => ({
    alternativeId: item.alternativeId,
    score: sumS !== 0 ? item.s / sumS : 0,
    details: {
      vectorS: item.s,
    },
    rank: 0, // Will be calculated after sorting
  }));

  // Sort by score and assign ranks
  return assignRanks(results);
};

// Helper function to sort results by score and assign ranks
const assignRanks = (results: MethodResult[]): MethodResult[] => {
  // Sort by score (descending)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  
  // Assign ranks
  sortedResults.forEach((result, index) => {
    result.rank = index + 1;
  });
  
  return sortedResults;
};

// Utility function to calculate method results based on method ID
export const calculateMethodResults = (
  methodId: string,
  criteria: Criteria[],
  alternatives: Alternative[]
): MethodResult[] => {
  switch (methodId) {
    case 'saw':
      return calculateSAW(criteria, alternatives);
    case 'topsis':
      return calculateTOPSIS(criteria, alternatives);
    case 'ahp':
      return calculateAHP(criteria, alternatives);
    case 'moora':
      return calculateMOORA(criteria, alternatives);
    case 'smart':
      return calculateSMART(criteria, alternatives);
    case 'wp':
      return calculateWP(criteria, alternatives);
    default:
      return [];
  }
};