import { NutritionInfo } from '../types';

const CUSTOM_NUTRITION_KEY = 'custom_nutrition_data';

export interface NutritionEntry {
  name: string;
  nutrition: NutritionInfo;
}

export function getCustomNutritionData(): Record<string, NutritionInfo> {
  try {
    const data = localStorage.getItem(CUSTOM_NUTRITION_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveCustomNutritionData(data: Record<string, NutritionInfo>): void {
  localStorage.setItem(CUSTOM_NUTRITION_KEY, JSON.stringify(data));
}

export function addCustomNutrition(name: string, nutrition: NutritionInfo): boolean {
  const data = getCustomNutritionData();
  const normalizedName = name.trim();
  if (data[normalizedName]) {
    return false;
  }
  data[normalizedName] = nutrition;
  saveCustomNutritionData(data);
  return true;
}

export function updateCustomNutrition(oldName: string, newName: string, nutrition: NutritionInfo): boolean {
  const data = getCustomNutritionData();
  const normalizedOldName = oldName.trim();
  const normalizedNewName = newName.trim();
  
  if (normalizedOldName !== normalizedNewName && data[normalizedNewName]) {
    return false;
  }
  
  if (normalizedOldName !== normalizedNewName) {
    delete data[normalizedOldName];
  }
  
  data[normalizedNewName] = nutrition;
  saveCustomNutritionData(data);
  return true;
}

export function deleteCustomNutrition(name: string): boolean {
  const data = getCustomNutritionData();
  const normalizedName = name.trim();
  if (!data[normalizedName]) {
    return false;
  }
  delete data[normalizedName];
  saveCustomNutritionData(data);
  return true;
}

export function getAllCustomNutrition(): NutritionEntry[] {
  const data = getCustomNutritionData();
  return Object.entries(data).map(([name, nutrition]) => ({ name, nutrition }));
}

export function exportCustomNutrition(): string {
  const data = getCustomNutritionData();
  return JSON.stringify(data, null, 2);
}

export function importCustomNutrition(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (typeof data !== 'object' || data === null) {
      return { success: false, count: 0, error: '无效的JSON格式' };
    }
    
    let count = 0;
    const existingData = getCustomNutritionData();
    
    for (const [name, nutrition] of Object.entries(data)) {
      if (typeof name === 'string' && name.trim() && isValidNutrition(nutrition)) {
        existingData[name.trim()] = nutrition as NutritionInfo;
        count++;
      }
    }
    
    saveCustomNutritionData(existingData);
    return { success: true, count };
  } catch (e) {
    return { success: false, count: 0, error: 'JSON解析失败' };
  }
}

function isValidNutrition(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  const n = obj as Record<string, unknown>;
  return (
    typeof n.calories === 'number' &&
    typeof n.protein === 'number' &&
    typeof n.fat === 'number' &&
    typeof n.carbs === 'number'
  );
}
