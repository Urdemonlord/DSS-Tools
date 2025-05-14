import { useCallback, useMemo, useState } from 'react';
import { Alternative, CalculationResult, Criteria, MethodResult } from '../types';
import { calculateMethodResults } from '../utils/dssUtils';
import { DSS_METHODS } from '../constants';

/**
 * Custom hook for calculating and managing DSS method results
 */
export const useCalculationResults = (
  criteria: Criteria[],
  alternatives: Alternative[]
) => {
  const [selectedMethod, setSelectedMethod] = useState<string>(DSS_METHODS[0].id);
  const [calculationHistory, setCalculationHistory] = useState<CalculationResult[]>([]);

  // Calculate results for all methods at once
  const allResults = useMemo(() => {
    const results: Record<string, MethodResult[]> = {};
    
    // Skip calculations if there's not enough data
    if (criteria.length === 0 || alternatives.length === 0) {
      return results;
    }

    // Calculate results for each method
    DSS_METHODS.forEach(method => {
      results[method.id] = calculateMethodResults(method.id, criteria, alternatives);
    });

    return results;
  }, [criteria, alternatives]);

  // Get results for the currently selected method
  const currentResults = useMemo(() => 
    allResults[selectedMethod] || [],
    [allResults, selectedMethod]
  );

  // Calculate and save results for the selected method to history
  const calculateAndSave = useCallback(() => {
    if (selectedMethod && criteria.length > 0 && alternatives.length > 0) {
      const results = calculateMethodResults(selectedMethod, criteria, alternatives);
      
      if (results.length > 0) {
        const calculationResult: CalculationResult = {
          methodName: selectedMethod,
          results: results,
          timestamp: Date.now()
        };
        
        setCalculationHistory(prev => [calculationResult, ...prev]);
      }
    }
  }, [selectedMethod, criteria, alternatives]);

  // Clear calculation history
  const clearHistory = useCallback(() => {
    setCalculationHistory([]);
  }, []);

  return {
    selectedMethod,
    setSelectedMethod,
    currentResults,
    allResults,
    calculationHistory,
    calculateAndSave,
    clearHistory
  };
};