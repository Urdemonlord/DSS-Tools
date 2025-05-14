import { read, utils } from 'xlsx';
import { Alternative, Criteria, CriteriaType } from '../types';

export const importFromExcel = async (file: File): Promise<{
  criteria: Criteria[];
  alternatives: Alternative[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });

        // Read criteria sheet
        const criteriaSheet = workbook.Sheets[workbook.SheetNames[0]];
        const criteriaData = utils.sheet_to_json(criteriaSheet);
        
        const criteria: Criteria[] = criteriaData.map((row: any) => ({
          id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: row.Name || row.name,
          weight: parseFloat(row.Weight || row.weight) || 1,
          type: (row.Type || row.type || 'benefit').toLowerCase() as CriteriaType
        }));

        // Read alternatives sheet
        const alternativesSheet = workbook.Sheets[workbook.SheetNames[1]];
        const alternativesData = utils.sheet_to_json(alternativesSheet);
        
        const alternatives: Alternative[] = alternativesData.map((row: any) => {
          const values: Record<string, number> = {};
          
          // Map criteria values
          criteria.forEach(criterion => {
            const value = row[criterion.name];
            if (value !== undefined) {
              values[criterion.id] = parseFloat(value) || 0;
            }
          });

          return {
            id: `a-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: row.Name || row.name,
            values
          };
        });

        resolve({ criteria, alternatives });
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please check the format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
};