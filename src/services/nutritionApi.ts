import { NutritionInfo } from '../types';
import chineseNutritionData from '../data/chineseNutritionData.json';

export interface FoodSearchResult {
  foodId: string;
  label: string;
  nutrients: NutritionInfo;
}

export interface FoodItem {
  name: string;
  nutrients: NutritionInfo;
  isCustom: boolean;
}

const CUSTOM_FOODS_KEY = 'xCook_customFoods';

let LOCAL_NUTRITION_DATA: Record<string, NutritionInfo> = { ...chineseNutritionData } as Record<string, NutritionInfo>;

function loadCustomFoods(): Record<string, NutritionInfo> {
  try {
    const stored = localStorage.getItem(CUSTOM_FOODS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load custom foods:', e);
  }
  return {};
}

function saveCustomFoods(foods: Record<string, NutritionInfo>): void {
  try {
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(foods));
  } catch (e) {
    console.error('Failed to save custom foods:', e);
  }
}

let customFoods = loadCustomFoods();

export function getAllFoods(): FoodItem[] {
  const allFoods: FoodItem[] = [];
  const seen = new Set<string>();
  
  for (const [name, nutrients] of Object.entries(customFoods)) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      allFoods.push({ name, nutrients, isCustom: true });
    }
  }
  
  for (const [name, nutrients] of Object.entries(LOCAL_NUTRITION_DATA)) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      allFoods.push({ name, nutrients, isCustom: false });
    }
  }
  
  return allFoods.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

export function addCustomFood(name: string, nutrients: NutritionInfo): boolean {
  const trimmedName = name.trim();
  if (!trimmedName) return false;
  
  const key = trimmedName.toLowerCase();
  if (customFoods[key] || LOCAL_NUTRITION_DATA[key]) {
    return false;
  }
  
  customFoods[trimmedName] = nutrients;
  saveCustomFoods(customFoods);
  
  return true;
}

export function updateCustomFood(name: string, nutrients: NutritionInfo): boolean {
  const trimmedName = name.trim();
  if (!trimmedName) return false;
  
  customFoods[trimmedName] = nutrients;
  saveCustomFoods(customFoods);
  
  return true;
}

export function deleteCustomFood(name: string): boolean {
  const trimmedName = name.trim();
  if (!trimmedName) return false;
  
  if (customFoods[trimmedName]) {
    delete customFoods[trimmedName];
    saveCustomFoods(customFoods);
    return true;
  }
  
  return false;
}

export function searchFood(query: string): FoodSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];
  
  const results: FoodSearchResult[] = [];
  const seen = new Set<string>();
  
  const allData = { ...LOCAL_NUTRITION_DATA, ...customFoods };
  
  for (const [name, nutrients] of Object.entries(allData)) {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes(normalizedQuery) || normalizedQuery.includes(nameLower)) {
      const key = nameLower.replace(/[^a-z0-9\u4e00-\u9fa5]/g, '').toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          foodId: name,
          label: name,
          nutrients
        });
      }
    }
  }
  
  // 不再为不存在的食材返回估算数据
  // 用户需要从搜索结果中选择真实存在的食材
  
  return results;
}

function estimateNutrition(name: string): NutritionInfo {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('油') || nameLower.includes('fat') || nameLower.includes('oil')) {
    return { calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0, zinc: 0 };
  }
  if (nameLower.includes('糖') || nameLower.includes('sugar') || nameLower.includes('sweet')) {
    return { calories: 400, protein: 0, fat: 0, carbs: 100, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0, zinc: 0 };
  }
  if (nameLower.includes('肉') || nameLower.includes('meat') || nameLower.includes('beef') || nameLower.includes('pork') || nameLower.includes('鸡')) {
    return { calories: 180, protein: 20, fat: 10, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 1.5, zinc: 2 };
  }
  if (nameLower.includes('鱼') || nameLower.includes('fish') || nameLower.includes('seafood') || nameLower.includes('虾')) {
    return { calories: 100, protein: 20, fat: 2, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 30, iron: 0.5, zinc: 0.5 };
  }
  if (nameLower.includes('菜') || nameLower.includes('vegetable')) {
    return { calories: 20, protein: 1, fat: 0.1, carbs: 4, fiber: 1.5, vitaminA: 50, vitaminC: 20, calcium: 30, iron: 0.5, zinc: 0.2 };
  }
  if (nameLower.includes('饭') || nameLower.includes('rice') || nameLower.includes('面') || nameLower.includes('noodle')) {
    return { calories: 130, protein: 3, fat: 0.5, carbs: 28, fiber: 0.5, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 0.5, zinc: 0.5 };
  }
  if (nameLower.includes('蛋') || nameLower.includes('egg')) {
    return { calories: 144, protein: 13, fat: 9, carbs: 1, fiber: 0, vitaminA: 200, vitaminC: 0, calcium: 50, iron: 1.5, zinc: 1 };
  }
  if (nameLower.includes('奶') || nameLower.includes('milk') || nameLower.includes('乳')) {
    return { calories: 60, protein: 3, fat: 3, carbs: 5, fiber: 0, vitaminA: 30, vitaminC: 1, calcium: 100, iron: 0.1, zinc: 0.4 };
  }
  if (nameLower.includes('豆') || nameLower.includes('bean') || nameLower.includes('tofu')) {
    return { calories: 80, protein: 8, fat: 4, carbs: 3, fiber: 0.5, vitaminA: 0, vitaminC: 0, calcium: 150, iron: 1.5, zinc: 0.8 };
  }
  if (nameLower.includes('果') || nameLower.includes('fruit') || nameLower.includes('苹果') || nameLower.includes('香蕉')) {
    return { calories: 50, protein: 0.5, fat: 0.2, carbs: 12, fiber: 2, vitaminA: 5, vitaminC: 10, calcium: 10, iron: 0.2, zinc: 0.1 };
  }
  
  return {
    calories: 50,
    protein: 2,
    fat: 1,
    carbs: 8,
    fiber: 1,
    vitaminA: 0,
    vitaminC: 0,
    calcium: 10,
    iron: 0.5,
    zinc: 0.3,
  };
}

export function calculateNutritionFromAPI(
  nutrientsPer100g: NutritionInfo,
  amount: number,
  unit: string,
  ingredientName?: string
): NutritionInfo {
  const grams = convertToGrams(amount, unit, ingredientName);
  const factor = grams / 100;
  
  return {
    calories: Math.round((nutrientsPer100g.calories || 0) * factor * 10) / 10,
    protein: Math.round((nutrientsPer100g.protein || 0) * factor * 10) / 10,
    fat: Math.round((nutrientsPer100g.fat || 0) * factor * 10) / 10,
    carbs: Math.round((nutrientsPer100g.carbs || 0) * factor * 10) / 10,
    fiber: Math.round((nutrientsPer100g.fiber || 0) * factor * 10) / 10,
    vitaminA: Math.round((nutrientsPer100g.vitaminA || 0) * factor * 10) / 10,
    vitaminC: Math.round((nutrientsPer100g.vitaminC || 0) * factor * 10) / 10,
    calcium: Math.round((nutrientsPer100g.calcium || 0) * factor * 10) / 10,
    iron: Math.round((nutrientsPer100g.iron || 0) * factor * 100) / 100,
    zinc: Math.round((nutrientsPer100g.zinc || 0) * factor * 100) / 100,
  };
}

// 食材单个重量映射表（单位：克）
const INGREDIENT_UNIT_WEIGHT: Record<string, number> = {
  // 蛋类
  '鸡蛋': 50, '鸭蛋': 70, '鹌鹑蛋': 10, '皮蛋': 50,
  // 水果类
  '苹果': 150, '香蕉': 120, '橙子': 130, '梨': 150, '桃子': 150,
  '猕猴桃': 80, '芒果': 200, '火龙果': 300, '柚子': 1000, '西瓜': 2000,
  '葡萄': 10, '草莓': 15, '樱桃': 10, '荔枝': 10, '龙眼': 10,
  '菠萝': 1000, '哈密瓜': 1500, '柠檬': 80, '百香果': 20, '石榴': 250,
  // 蔬菜类
  '西红柿': 120, '土豆': 150, '胡萝卜': 100, '洋葱': 150, '大蒜': 10,
  '姜': 30, '青椒': 80, '黄瓜': 150, '茄子': 200, '玉米': 200,
  '红薯': 150, '莲藕': 200, '南瓜': 1500, '冬瓜': 2000, '苦瓜': 200,
  '萝卜': 200, '山药': 200, '芋头': 100, '白菜': 500, '菠菜': 200,
  '芹菜': 150, '生菜': 100, '西兰花': 200, '花菜': 300, '豆角': 10,
  '香菇': 20, '木耳': 10, '豆芽': 10, '芦笋': 15, '茭白': 100,
  '莴苣': 150, '油麦菜': 100, '空心菜': 100, '芥蓝': 150, '苋菜': 100,
  '茼蒿': 100,
  // 肉类
  '鸡翅': 50, '鸡腿': 150, '鸡爪': 30, '猪蹄': 300, '排骨': 200,
  // 海鲜类
  '虾': 10, '虾仁': 10, '螃蟹': 150, '扇贝': 20, '鱿鱼': 100,
  '鲈鱼': 400, '黄鱼': 300, '带鱼': 200, '鳕鱼': 150, '龙利鱼': 150,
  // 其他
  '饺子': 20, '包子': 80, '馒头': 80, '汤圆': 15, '粽子': 150,
  '年糕': 200, '香肠': 50, '火腿': 30, '培根': 20, '油条': 80,
  '鸡蛋饼': 100,
};

function getIngredientUnitWeight(ingredientName: string): number {
  if (INGREDIENT_UNIT_WEIGHT[ingredientName]) {
    return INGREDIENT_UNIT_WEIGHT[ingredientName];
  }
  for (const [name, weight] of Object.entries(INGREDIENT_UNIT_WEIGHT)) {
    if (ingredientName.includes(name) || name.includes(ingredientName)) {
      return weight;
    }
  }
  return 50;
}

function convertToGrams(amount: number, unit: string, ingredientName?: string): number {
  // 对于"个"、"只"等单位，使用食材特定的重量
  if ((unit === '个' || unit === '只') && ingredientName) {
    return amount * getIngredientUnitWeight(ingredientName);
  }
  
  const unitMap: Record<string, number> = {
    'g': 1, '克': 1,
    'kg': 1000, '千克': 1000,
    'mg': 0.001,
    'ml': 1, '毫升': 1,
    'l': 1000, '升': 1000,
    '个': 50, '只': 50,
    '勺': 15, '汤匙': 15, '茶匙': 5, 'tbsp': 15, 'tsp': 5,
    '杯': 240, 'cup': 240,
    '片': 30, 'slice': 30,
    '块': 50,
    '根': 40,
    '把': 30,
    '颗': 10,
    '瓣': 5,
    '条': 30,
    '段': 20,
    '两': 50,
    '斤': 500,
    '少许': 5,
    '适量': 10,
    'oz': 28.35,
    'lb': 453.6,
  };
  
  return amount * (unitMap[unit] || 50);
}

export function getLocalNutrition(name: string, amount: number, unit: string): NutritionInfo {
  const nutrition = findLocalNutrition(name);
  return calculateNutritionFromAPI(nutrition, amount, unit);
}

function findLocalNutrition(name: string): NutritionInfo {
  const normalizedName = name.trim();
  
  const allData = { ...LOCAL_NUTRITION_DATA, ...customFoods };
  
  if (allData[normalizedName]) {
    return allData[normalizedName];
  }
  
  const normalizedNameLower = normalizedName.toLowerCase();
  for (const [key, value] of Object.entries(allData)) {
    if (key.toLowerCase() === normalizedNameLower) {
      return value;
    }
  }
  
  for (const [key, value] of Object.entries(allData)) {
    if (key.toLowerCase().includes(normalizedNameLower) || normalizedNameLower.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return estimateNutrition(normalizedName);
}

const DEFAULT_NUTRITION: NutritionInfo = {
  calories: 50, protein: 2, fat: 1, carbs: 8, fiber: 1,
  vitaminA: 0, vitaminC: 0, calcium: 10, iron: 0.5, zinc: 0.3,
};

export { LOCAL_NUTRITION_DATA, DEFAULT_NUTRITION };
