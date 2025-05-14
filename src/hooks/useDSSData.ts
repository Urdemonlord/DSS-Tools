import { useCallback, useEffect, useState } from 'react';
import { Alternative, Criteria, DSSData } from '../types';
import { loadDSSData, saveDSSData } from '../utils/storage';

/**
 * Custom hook for managing DSS data with localStorage persistence
 */
export const useDSSData = () => {
  const [data, setData] = useState<DSSData>(() => loadDSSData());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedData = loadDSSData();
    setData(loadedData);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveDSSData(data);
    setLastSaved(new Date());
  }, [data]);

  // Add a new criterion
  const addCriterion = useCallback((criterion: Criteria) => {
    setData(prevData => ({
      ...prevData,
      criteria: [...prevData.criteria, criterion]
    }));
  }, []);

  // Update an existing criterion
  const updateCriterion = useCallback((criterionId: string, updates: Partial<Criteria>) => {
    setData(prevData => ({
      ...prevData,
      criteria: prevData.criteria.map(c => 
        c.id === criterionId ? { ...c, ...updates } : c
      )
    }));
  }, []);

  // Delete a criterion
  const deleteCriterion = useCallback((criterionId: string) => {
    setData(prevData => {
      // Remove criterion from criteria list
      const updatedCriteria = prevData.criteria.filter(c => c.id !== criterionId);
      
      // Remove values for this criterion from all alternatives
      const updatedAlternatives = prevData.alternatives.map(alt => {
        const updatedValues = { ...alt.values };
        delete updatedValues[criterionId];
        return { ...alt, values: updatedValues };
      });

      return {
        criteria: updatedCriteria,
        alternatives: updatedAlternatives
      };
    });
  }, []);

  // Add a new alternative
  const addAlternative = useCallback((alternative: Alternative) => {
    setData(prevData => ({
      ...prevData,
      alternatives: [...prevData.alternatives, alternative]
    }));
  }, []);

  // Update an existing alternative
  const updateAlternative = useCallback(
    (alternativeId: string, updates: Partial<Alternative>) => {
      setData(prevData => ({
        ...prevData,
        alternatives: prevData.alternatives.map(a => 
          a.id === alternativeId 
            ? { 
                ...a, 
                ...updates, 
                // If there are new values, merge them with existing ones
                values: updates.values ? { ...a.values, ...updates.values } : a.values 
              } 
            : a
        )
      }));
    }, 
  []);

  // Delete an alternative
  const deleteAlternative = useCallback((alternativeId: string) => {
    setData(prevData => ({
      ...prevData,
      alternatives: prevData.alternatives.filter(a => a.id !== alternativeId)
    }));
  }, []);

  // Update a specific value for an alternative
  const updateAlternativeValue = useCallback(
    (alternativeId: string, criterionId: string, value: number) => {
      setData(prevData => ({
        ...prevData,
        alternatives: prevData.alternatives.map(a => 
          a.id === alternativeId 
            ? { 
                ...a, 
                values: { ...a.values, [criterionId]: value } 
              } 
            : a
        )
      }));
    },
    []
  );

  // Reset to default data
  const resetData = useCallback(() => {
    const defaultData = loadDSSData();
    setData(defaultData);
  }, []);

  return {
    criteria: data.criteria,
    alternatives: data.alternatives,
    lastSaved,
    addCriterion,
    updateCriterion,
    deleteCriterion,
    addAlternative,
    updateAlternative,
    deleteAlternative,
    updateAlternativeValue,
    resetData
  };
};