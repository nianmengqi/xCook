import { NutritionInfo } from '../types';

export interface IngredientNutrition {
  name: string;
  nutrition: NutritionInfo;
}

export const INGREDIENT_NUTRITION_DATA: Record<string, NutritionInfo> = {
  // 谷物类
  '米饭': { calories: 130, protein: 2.6, fat: 0.3, carbs: 28, fiber: 0.4, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 0.3, zinc: 0.5 },
  '面条': { calories: 138, protein: 4.5, fat: 1.6, carbs: 25, fiber: 1.2, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 0.8, zinc: 0.4 },
  '面粉': { calories: 364, protein: 10, fat: 1, carbs: 76, fiber: 2.7, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 1.2, zinc: 0.4 },
  '饺子': { calories: 215, protein: 7.3, fat: 4.6, carbs: 35, fiber: 1.2, vitaminA: 0, vitaminC: 0, calcium: 34, iron: 1, zinc: 0.6 },
  '包子': { calories: 223, protein: 7.4, fat: 6.2, carbs: 36, fiber: 1.1, vitaminA: 0, vitaminC: 0, calcium: 26, iron: 1.2, zinc: 0.7 },
  '馒头': { calories: 223, protein: 7.8, fat: 1.2, carbs: 47, fiber: 1.5, vitaminA: 0, vitaminC: 0, calcium: 20, iron: 1.5, zinc: 0.7 },
  '面包': { calories: 265, protein: 8, fat: 3.2, carbs: 51, fiber: 2.3, vitaminA: 0, vitaminC: 0, calcium: 35, iron: 1.4, zinc: 0.5 },
  '蛋糕': { calories: 348, protein: 5.6, fat: 13, carbs: 55, fiber: 0.4, vitaminA: 68, vitaminC: 0, calcium: 31, iron: 1.2, zinc: 0.5 },
  '麦片': { calories: 389, protein: 16.9, fat: 6.9, carbs: 66, fiber: 10.6, vitaminA: 0, vitaminC: 0, calcium: 54, iron: 4.7, zinc: 3.6 },
  '小米': { calories: 361, protein: 9, fat: 3.1, carbs: 75, fiber: 4.4, vitaminA: 17, vitaminC: 0, calcium: 22, iron: 5.1, zinc: 1.9 },
  '玉米面': { calories: 340, protein: 8.1, fat: 4.0, carbs: 73, fiber: 7.3, vitaminA: 0, vitaminC: 0, calcium: 39, iron: 2.3, zinc: 1.7 },

  // 肉类
  '猪肉': { calories: 395, protein: 27, fat: 31, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 1, zinc: 2 },
  '牛肉': { calories: 250, protein: 26, fat: 15, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 2.6, zinc: 3 },
  '鸡肉': { calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 11, iron: 0.7, zinc: 0.8 },
  '鸭肉': { calories: 337, protein: 19, fat: 28, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 2.2, zinc: 1.3 },
  '羊肉': { calories: 294, protein: 25, fat: 21, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 12, iron: 1.6, zinc: 2.1 },
  '五花肉': { calories: 349, protein: 18, fat: 30, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 0.8, zinc: 1.8 },
  '排骨': { calories: 278, protein: 22, fat: 21, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 24, iron: 1.1, zinc: 2.5 },
  '里脊肉': { calories: 155, protein: 22, fat: 5, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 3, iron: 0.8, zinc: 1.5 },
  '猪蹄': { calories: 260, protein: 22, fat: 18, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 33, iron: 1.5, zinc: 1.8 },
  '鸡翅': { calories: 203, protein: 18, fat: 14, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 8, iron: 0.6, zinc: 0.7 },
  '鸡腿': { calories: 181, protein: 20, fat: 11, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 0.6, zinc: 1.3 },
  '鸡胸肉': { calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 5, iron: 0.4, zinc: 0.7 },
  '肥牛': { calories: 349, protein: 18, fat: 30, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 5, iron: 2.1, zinc: 3.4 },

  // 海鲜类
  '鱼肉': { calories: 113, protein: 20, fat: 2.7, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 28, iron: 0.4, zinc: 0.5 },
  '虾': { calories: 85, protein: 20, fat: 0.2, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 70, iron: 0.6, zinc: 1.1 },
  '三文鱼': { calories: 208, protein: 20, fat: 14, carbs: 0, fiber: 0, vitaminA: 10, vitaminC: 0, calcium: 12, iron: 0.3, zinc: 0.4 },
  '金枪鱼': { calories: 144, protein: 23, fat: 5, carbs: 0, fiber: 0, vitaminA: 13, vitaminC: 0, calcium: 12, iron: 0.8, zinc: 0.5 },
  '鱿鱼': { calories: 92, protein: 16, fat: 1.4, carbs: 3, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 44, iron: 0.6, zinc: 1.5 },
  '螃蟹': { calories: 97, protein: 19, fat: 1.5, carbs: 2, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 70, iron: 1.6, zinc: 2.3 },
  '海带': { calories: 12, protein: 0.6, fat: 0.1, carbs: 2.3, fiber: 0.5, vitaminA: 0, vitaminC: 0, calcium: 46, iron: 0.5, zinc: 0.2 },
  '紫菜': { calories: 35, protein: 5.8, fat: 0.4, carbs: 5.1, fiber: 2.7, vitaminA: 0, vitaminC: 0, calcium: 186, iron: 10.6, zinc: 1.6 },
  '虾仁': { calories: 99, protein: 21, fat: 0.6, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 65, iron: 0.5, zinc: 1.2 },
  '扇贝': { calories: 60, protein: 11, fat: 0.5, carbs: 3, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 27, iron: 0.3, zinc: 0.9 },
  '鲈鱼': { calories: 105, protein: 18, fat: 3.2, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 21, iron: 0.5, zinc: 0.4 },
  '鳕鱼': { calories: 88, protein: 18, fat: 1, carbs: 0, fiber: 0, vitaminA: 12, vitaminC: 0, calcium: 15, iron: 0.4, zinc: 0.4 },
  '黄鱼': { calories: 103, protein: 18, fat: 2.5, carbs: 0, fiber: 0, vitaminA: 20, vitaminC: 0, calcium: 26, iron: 0.5, zinc: 0.4 },
  '带鱼': { calories: 127, protein: 17, fat: 6.2, carbs: 0, fiber: 0, vitaminA: 19, vitaminC: 0, calcium: 20, iron: 0.6, zinc: 0.8 },
  '龙利鱼': { calories: 90, protein: 18, fat: 1.5, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 21, iron: 0.3, zinc: 0.3 },

  // 蛋类
  '鸡蛋': { calories: 143, protein: 13, fat: 10, carbs: 0.1, fiber: 0, vitaminA: 234, vitaminC: 0, calcium: 30, iron: 1.2, zinc: 0.7 },
  '鸭蛋': { calories: 180, protein: 13, fat: 14, carbs: 1, fiber: 0, vitaminA: 261, vitaminC: 0, calcium: 30, iron: 1.6, zinc: 0.8 },
  '鹌鹑蛋': { calories: 160, protein: 13, fat: 11, carbs: 1, fiber: 0, vitaminA: 337, vitaminC: 0, calcium: 47, iron: 1.4, zinc: 0.8 },
  '皮蛋': { calories: 171, protein: 13, fat: 11, carbs: 4, fiber: 0, vitaminA: 49, vitaminC: 0, calcium: 26, iron: 1.5, zinc: 0.7 },

  // 奶制品
  '牛奶': { calories: 61, protein: 3.2, fat: 3.3, carbs: 4.8, fiber: 0, vitaminA: 46, vitaminC: 1, calcium: 104, iron: 0, zinc: 0.4 },
  '酸奶': { calories: 63, protein: 2.5, fat: 1.9, carbs: 7.7, fiber: 0, vitaminA: 6, vitaminC: 1, calcium: 118, iron: 0, zinc: 0.4 },
  '芝士': { calories: 402, protein: 25, fat: 33, carbs: 1.3, fiber: 0, vitaminA: 265, vitaminC: 0, calcium: 721, iron: 0.7, zinc: 3.1 },
  '黄油': { calories: 717, protein: 0.8, fat: 81, carbs: 0.1, fiber: 0, vitaminA: 684, vitaminC: 0, calcium: 24, iron: 0, zinc: 0.1 },
  '奶油': { calories: 340, protein: 2.1, fat: 37, carbs: 2.8, fiber: 0, vitaminA: 409, vitaminC: 0, calcium: 65, iron: 0, zinc: 0.3 },
  '奶粉': { calories: 433, protein: 20, fat: 15, carbs: 52, fiber: 0, vitaminA: 400, vitaminC: 0, calcium: 500, iron: 0.8, zinc: 3 },
  '奶酪': { calories: 371, protein: 25, fat: 30, carbs: 1.3, fiber: 0, vitaminA: 265, vitaminC: 0, calcium: 700, iron: 0.6, zinc: 3 },

  // 大豆制品
  '豆腐': { calories: 76, protein: 8, fat: 4.8, carbs: 1.9, fiber: 0.3, vitaminA: 0, vitaminC: 0, calcium: 164, iron: 1.2, zinc: 0.6 },
  '豆浆': { calories: 33, protein: 2.8, fat: 1.4, carbs: 3.3, fiber: 0.8, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 0.4, zinc: 0.2 },
  '豆腐皮': { calories: 447, protein: 44, fat: 26, carbs: 16, fiber: 0.3, vitaminA: 0, vitaminC: 0, calcium: 77, iron: 3.5, zinc: 1.8 },
  '腐竹': { calories: 459, protein: 45, fat: 25, carbs: 22, fiber: 0.5, vitaminA: 0, vitaminC: 0, calcium: 84, iron: 4.8, zinc: 2.5 },
  '豆干': { calories: 167, protein: 17, fat: 8, carbs: 5, fiber: 0.4, vitaminA: 0, vitaminC: 0, calcium: 300, iron: 4.9, zinc: 1.5 },
  '素鸡': { calories: 194, protein: 18, fat: 11, carbs: 5, fiber: 0.2, vitaminA: 0, vitaminC: 0, calcium: 350, iron: 2.8, zinc: 1.4 },
  '千张': { calories: 260, protein: 24, fat: 16, carbs: 6, fiber: 0.4, vitaminA: 0, vitaminC: 0, calcium: 313, iron: 5.3, zinc: 2.4 },

  // 蔬菜类
  '白菜': { calories: 13, protein: 1.3, fat: 0.1, carbs: 2.4, fiber: 0.9, vitaminA: 0, vitaminC: 28, calcium: 43, iron: 0.5, zinc: 0.3 },
  '菠菜': { calories: 23, protein: 2.6, fat: 0.3, carbs: 3.6, fiber: 2.2, vitaminA: 487, vitaminC: 28, calcium: 99, iron: 2.5, zinc: 0.5 },
  '西红柿': { calories: 15, protein: 0.7, fat: 0.1, carbs: 3.3, fiber: 1.2, vitaminA: 76, vitaminC: 14, calcium: 8, iron: 0.2, zinc: 0.2 },
  '土豆': { calories: 77, protein: 2, fat: 0.1, carbs: 17, fiber: 2.2, vitaminA: 0, vitaminC: 20, calcium: 12, iron: 0.8, zinc: 0.3 },
  '胡萝卜': { calories: 32, protein: 0.6, fat: 0.1, carbs: 7.7, fiber: 2.3, vitaminA: 841, vitaminC: 5, calcium: 30, iron: 0.3, zinc: 0.3 },
  '洋葱': { calories: 30, protein: 1.1, fat: 0.1, carbs: 7, fiber: 1.4, vitaminA: 0, vitaminC: 6, calcium: 20, iron: 0.3, zinc: 0.2 },
  '大蒜': { calories: 111, protein: 4.4, fat: 0.2, carbs: 23, fiber: 2.1, vitaminA: 0, vitaminC: 5, calcium: 10, iron: 1.3, zinc: 0.8 },
  '姜': { calories: 33, protein: 1.3, fat: 0.3, carbs: 7, fiber: 1.7, vitaminA: 0, vitaminC: 2, calcium: 11, iron: 0.4, zinc: 0.3 },
  '青椒': { calories: 18, protein: 0.9, fat: 0.1, carbs: 4.6, fiber: 1.7, vitaminA: 58, vitaminC: 89, calcium: 6, iron: 0.3, zinc: 0.2 },
  '黄瓜': { calories: 12, protein: 0.7, fat: 0.1, carbs: 2.4, fiber: 0.7, vitaminA: 0, vitaminC: 3, calcium: 15, iron: 0.2, zinc: 0.2 },
  '茄子': { calories: 21, protein: 1, fat: 0.1, carbs: 4, fiber: 1.5, vitaminA: 0, vitaminC: 3, calcium: 11, iron: 0.2, zinc: 0.2 },
  '香菇': { calories: 19, protein: 2.1, fat: 0.1, carbs: 3.2, fiber: 1.6, vitaminA: 0, vitaminC: 1, calcium: 2, iron: 0.4, zinc: 0.5 },
  '木耳': { calories: 21, protein: 1, fat: 0.1, carbs: 5, fiber: 2.6, vitaminA: 0, vitaminC: 0, calcium: 30, iron: 1.7, zinc: 0.3 },
  '豆角': { calories: 29, protein: 2.5, fat: 0.1, carbs: 5.4, fiber: 2.1, vitaminA: 0, vitaminC: 18, calcium: 35, iron: 1.1, zinc: 0.4 },
  '芹菜': { calories: 12, protein: 0.6, fat: 0.1, carbs: 2, fiber: 1.3, vitaminA: 67, vitaminC: 4, calcium: 36, iron: 0.3, zinc: 0.2 },
  '生菜': { calories: 12, protein: 1.2, fat: 0.2, carbs: 1.7, fiber: 1.3, vitaminA: 370, vitaminC: 18, calcium: 36, iron: 0.5, zinc: 0.2 },
  '西兰花': { calories: 27, protein: 2.4, fat: 0.3, carbs: 4.4, fiber: 2.4, vitaminA: 89, vitaminC: 89, calcium: 40, iron: 0.5, zinc: 0.4 },
  '花菜': { calories: 24, protein: 1.9, fat: 0.2, carbs: 4.3, fiber: 2, vitaminA: 0, vitaminC: 48, calcium: 18, iron: 0.4, zinc: 0.3 },
  '玉米': { calories: 86, protein: 3.3, fat: 1.2, carbs: 17, fiber: 2.7, vitaminA: 0, vitaminC: 7, calcium: 3, iron: 0.5, zinc: 0.5 },
  '红薯': { calories: 86, protein: 1.6, fat: 0.1, carbs: 20, fiber: 2.4, vitaminA: 0, vitaminC: 2, calcium: 23, iron: 0.5, zinc: 0.3 },
  '莲藕': { calories: 44, protein: 1.7, fat: 0.1, carbs: 10, fiber: 2.7, vitaminA: 0, vitaminC: 21, calcium: 26, iron: 1.3, zinc: 0.3 },
  '冬瓜': { calories: 10, protein: 0.4, fat: 0.1, carbs: 2.2, fiber: 0.8, vitaminA: 0, vitaminC: 16, calcium: 12, iron: 0.2, zinc: 0.1 },
  '南瓜': { calories: 26, protein: 1, fat: 0.1, carbs: 6.5, fiber: 0.8, vitaminA: 426, vitaminC: 9, calcium: 16, iron: 0.4, zinc: 0.3 },
  '苦瓜': { calories: 15, protein: 0.8, fat: 0.1, carbs: 3.2, fiber: 1.8, vitaminA: 0, vitaminC: 56, calcium: 6, iron: 0.4, zinc: 0.2 },
  '豆芽': { calories: 15, protein: 2, fat: 0.4, carbs: 2.5, fiber: 1.2, vitaminA: 0, vitaminC: 9, calcium: 13, iron: 0.6, zinc: 0.4 },
  '萝卜': { calories: 20, protein: 0.7, fat: 0.1, carbs: 4.3, fiber: 1.4, vitaminA: 0, vitaminC: 16, calcium: 27, iron: 0.3, zinc: 0.2 },
  '茭白': { calories: 26, protein: 1.5, fat: 0.2, carbs: 5.3, fiber: 1.4, vitaminA: 0, vitaminC: 3, calcium: 9, iron: 0.4, zinc: 0.4 },
  '莴苣': { calories: 15, protein: 1.1, fat: 0.1, carbs: 2.8, fiber: 0.8, vitaminA: 0, vitaminC: 4, calcium: 34, iron: 0.4, zinc: 0.2 },
  '油麦菜': { calories: 15, protein: 1.4, fat: 0.2, carbs: 2.1, fiber: 1.2, vitaminA: 333, vitaminC: 12, calcium: 60, iron: 1.2, zinc: 0.4 },
  '空心菜': { calories: 23, protein: 2.8, fat: 0.3, carbs: 3.3, fiber: 2.1, vitaminA: 253, vitaminC: 25, calcium: 68, iron: 1.9, zinc: 0.4 },
  '芥蓝': { calories: 19, protein: 2.8, fat: 0.2, carbs: 2.6, fiber: 1.6, vitaminA: 0, vitaminC: 76, calcium: 100, iron: 1.3, zinc: 0.7 },
  '苋菜': { calories: 25, protein: 2.8, fat: 0.4, carbs: 3.3, fiber: 2.2, vitaminA: 0, vitaminC: 30, calcium: 178, iron: 2.9, zinc: 0.7 },
  '茼蒿': { calories: 21, protein: 2.9, fat: 0.3, carbs: 2.7, fiber: 1.8, vitaminA: 0, vitaminC: 35, calcium: 73, iron: 1.3, zinc: 0.6 },
  '芦笋': { calories: 18, protein: 2.2, fat: 0.1, carbs: 2.9, fiber: 1.5, vitaminA: 38, vitaminC: 7, calcium: 13, iron: 1.1, zinc: 0.7 },
  '山药': { calories: 57, protein: 1.9, fat: 0.2, carbs: 13, fiber: 1.0, vitaminA: 0, vitaminC: 5, calcium: 14, iron: 0.3, zinc: 0.3 },
  '芋头': { calories: 80, protein: 2.2, fat: 0.2, carbs: 18, fiber: 3.0, vitaminA: 0, vitaminC: 7, calcium: 36, iron: 0.6, zinc: 0.5 },
  '土豆粉': { calories: 338, protein: 0.6, fat: 0.1, carbs: 83, fiber: 0.4, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 0.4, zinc: 0.2 },
  '魔芋': { calories: 20, protein: 0.1, fat: 0, carbs: 4, fiber: 3, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 0.2, zinc: 0.1 },

  // 水果类
  '苹果': { calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4, vitaminA: 3, vitaminC: 4, calcium: 6, iron: 0.1, zinc: 0 },
  '香蕉': { calories: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, vitaminA: 3, vitaminC: 9, calcium: 5, iron: 0.3, zinc: 0.2 },
  '橙子': { calories: 47, protein: 0.8, fat: 0.1, carbs: 12, fiber: 2.4, vitaminA: 11, vitaminC: 33, calcium: 24, iron: 0.1, zinc: 0.1 },
  '葡萄': { calories: 69, protein: 0.7, fat: 0.2, carbs: 18, fiber: 1, vitaminA: 3, vitaminC: 3, calcium: 10, iron: 0.4, zinc: 0.1 },
  '西瓜': { calories: 30, protein: 0.6, fat: 0.1, carbs: 8, fiber: 0.4, vitaminA: 28, vitaminC: 6, calcium: 8, iron: 0.3, zinc: 0.1 },
  '梨': { calories: 49, protein: 0.4, fat: 0.1, carbs: 13, fiber: 3.1, vitaminA: 1, vitaminC: 6, calcium: 9, iron: 0.1, zinc: 0 },
  '桃子': { calories: 39, protein: 0.9, fat: 0.1, carbs: 10, fiber: 1.5, vitaminA: 3, vitaminC: 7, calcium: 6, iron: 0.3, zinc: 0.2 },
  '草莓': { calories: 32, protein: 0.7, fat: 0.3, carbs: 8, fiber: 2, vitaminA: 1, vitaminC: 59, calcium: 16, iron: 0.4, zinc: 0.1 },
  '猕猴桃': { calories: 61, protein: 1.1, fat: 0.5, carbs: 14, fiber: 2.6, vitaminA: 14, vitaminC: 131, calcium: 25, iron: 0.3, zinc: 0.2 },
  '芒果': { calories: 60, protein: 0.8, fat: 0.4, carbs: 15, fiber: 1.6, vitaminA: 54, vitaminC: 36, calcium: 11, iron: 0.2, zinc: 0.1 },
  '菠萝': { calories: 50, protein: 0.5, fat: 0.1, carbs: 13, fiber: 1.4, vitaminA: 3, vitaminC: 58, calcium: 12, iron: 0.3, zinc: 0.1 },
  '火龙果': { calories: 50, protein: 1.1, fat: 0.2, carbs: 13, fiber: 2, vitaminA: 0, vitaminC: 9, calcium: 6, iron: 0.3, zinc: 0.3 },
  '柚子': { calories: 41, protein: 0.8, fat: 0.1, carbs: 10, fiber: 1.2, vitaminA: 2, vitaminC: 36, calcium: 12, iron: 0.3, zinc: 0.2 },
  '荔枝': { calories: 66, protein: 0.9, fat: 0.2, carbs: 17, fiber: 1.5, vitaminA: 2, vitaminC: 41, calcium: 6, iron: 0.3, zinc: 0.1 },
  '龙眼': { calories: 60, protein: 1.3, fat: 0.1, carbs: 15, fiber: 1, vitaminA: 2, vitaminC: 43, calcium: 8, iron: 0.3, zinc: 0.3 },
  '樱桃': { calories: 63, protein: 1.1, fat: 0.2, carbs: 16, fiber: 2, vitaminA: 3, vitaminC: 10, calcium: 11, iron: 0.4, zinc: 0.2 },
  '石榴': { calories: 63, protein: 1.4, fat: 0.2, carbs: 16, fiber: 4, vitaminA: 0, vitaminC: 10, calcium: 16, iron: 0.3, zinc: 0.2 },
  '哈密瓜': { calories: 34, protein: 0.5, fat: 0.1, carbs: 8, fiber: 0.8, vitaminA: 31, vitaminC: 12, calcium: 9, iron: 0.1, zinc: 0.1 },
  '柠檬': { calories: 29, protein: 1.1, fat: 0.3, carbs: 9, fiber: 2.8, vitaminA: 1, vitaminC: 53, calcium: 26, iron: 0.6, zinc: 0.1 },
  '百香果': { calories: 97, protein: 2.2, fat: 0.7, carbs: 23, fiber: 10, vitaminA: 33, vitaminC: 70, calcium: 7, iron: 1.6, zinc: 0.3 },

  // 坚果种子类
  '花生': { calories: 563, protein: 25, fat: 49, carbs: 16, fiber: 8.5, vitaminA: 0, vitaminC: 0, calcium: 47, iron: 2, zinc: 3 },
  '核桃': { calories: 654, protein: 15, fat: 65, carbs: 14, fiber: 6.7, vitaminA: 0, vitaminC: 1, calcium: 56, iron: 2.2, zinc: 2.3 },
  '杏仁': { calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12, vitaminA: 0, vitaminC: 0, calcium: 269, iron: 3.7, zinc: 3.1 },
  '芝麻': { calories: 559, protein: 18, fat: 50, carbs: 23, fiber: 12, vitaminA: 0, vitaminC: 0, calcium: 780, iron: 6.4, zinc: 2.8 },
  '腰果': { calories: 559, protein: 18, fat: 44, carbs: 30, fiber: 3, vitaminA: 0, vitaminC: 0, calcium: 26, iron: 6.7, zinc: 5.8 },
  '榛子': { calories: 628, protein: 15, fat: 61, carbs: 17, fiber: 7, vitaminA: 1, vitaminC: 0, calcium: 114, iron: 3.4, zinc: 2.5 },
  '板栗': { calories: 212, protein: 4.2, fat: 1.2, carbs: 45, fiber: 1.6, vitaminA: 1, vitaminC: 25, calcium: 15, iron: 1.4, zinc: 0.6 },
  '松子': { calories: 681, protein: 14, fat: 68, carbs: 13, fiber: 4, vitaminA: 0, vitaminC: 0, calcium: 18, iron: 3.5, zinc: 4.3 },
  '开心果': { calories: 560, protein: 20, fat: 45, carbs: 28, fiber: 10, vitaminA: 14, vitaminC: 5, calcium: 105, iron: 3.9, zinc: 2.2 },
  '碧根果': { calories: 688, protein: 15, fat: 72, carbs: 13, fiber: 7, vitaminA: 0, vitaminC: 0, calcium: 25, iron: 2.5, zinc: 4.5 },
  '南瓜子': { calories: 559, protein: 30, fat: 49, carbs: 15, fiber: 6.5, vitaminA: 0, vitaminC: 0, calcium: 37, iron: 5, zinc: 7.8 },
  '葵花子': { calories: 584, protein: 21, fat: 53, carbs: 18, fiber: 8.6, vitaminA: 0, vitaminC: 0, calcium: 78, iron: 5.2, zinc: 4.5 },

  // 调味品
  '白糖': { calories: 400, protein: 0, fat: 0, carbs: 100, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0, zinc: 0 },
  '红糖': { calories: 389, protein: 0.1, fat: 0, carbs: 97, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 83, iron: 0.7, zinc: 0.2 },
  '蜂蜜': { calories: 304, protein: 0.3, fat: 0, carbs: 82, fiber: 0.2, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 0.4, zinc: 0.2 },
  '酱油': { calories: 53, protein: 5.8, fat: 0, carbs: 7.8, fiber: 0.3, vitaminA: 0, vitaminC: 0, calcium: 18, iron: 1.1, zinc: 0.4 },
  '醋': { calories: 18, protein: 0.1, fat: 0, carbs: 0.3, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 12, iron: 0.3, zinc: 0.1 },
  '料酒': { calories: 33, protein: 0.1, fat: 0, carbs: 0.2, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0, zinc: 0 },
  '盐': { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 24, iron: 0, zinc: 0 },
  '鸡精': { calories: 200, protein: 35, fat: 0, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 50, iron: 0.5, zinc: 0.5 },
  '味精': { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0, zinc: 0 },
  '淀粉': { calories: 333, protein: 0.1, fat: 0, carbs: 83, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 0.1, zinc: 0.1 },
  '豆瓣酱': { calories: 106, protein: 5.5, fat: 4, carbs: 13, fiber: 2.4, vitaminA: 0, vitaminC: 0, calcium: 62, iron: 2.8, zinc: 0.7 },
  '番茄酱': { calories: 101, protein: 1.3, fat: 0.3, carbs: 23, fiber: 1.5, vitaminA: 36, vitaminC: 7, calcium: 15, iron: 0.7, zinc: 0.2 },
  '生抽': { calories: 53, protein: 5.8, fat: 0, carbs: 7.8, fiber: 0.3, vitaminA: 0, vitaminC: 0, calcium: 18, iron: 1.1, zinc: 0.4 },
  '老抽': { calories: 53, protein: 5.8, fat: 0, carbs: 7.8, fiber: 0.3, vitaminA: 0, vitaminC: 0, calcium: 18, iron: 1.1, zinc: 0.4 },
  '蚝油': { calories: 51, protein: 2.9, fat: 0, carbs: 10, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 10, iron: 0.8, zinc: 1.1 },
  '沙拉酱': { calories: 459, protein: 1, fat: 48, carbs: 5, fiber: 0, vitaminA: 19, vitaminC: 0, calcium: 11, iron: 0.3, zinc: 0.2 },
  '芝麻酱': { calories: 618, protein: 19, fat: 53, carbs: 21, fiber: 6, vitaminA: 0, vitaminC: 0, calcium: 643, iron: 9.4, zinc: 4.3 },
  '辣椒油': { calories: 450, protein: 0, fat: 50, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0, zinc: 0 },
  '花椒油': { calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0, zinc: 0 },

  // 香辛料
  '八角': { calories: 246, protein: 3.8, fat: 5.9, carbs: 26, fiber: 43, vitaminA: 0, vitaminC: 0, calcium: 86, iron: 6.8, zinc: 1.1 },
  '桂皮': { calories: 199, protein: 3.9, fat: 3.1, carbs: 20, fiber: 38, vitaminA: 0, vitaminC: 17, calcium: 83, iron: 5.3, zinc: 0.6 },
  '干辣椒': { calories: 282, protein: 8.4, fat: 8.4, carbs: 34, fiber: 21, vitaminA: 0, vitaminC: 0, calcium: 64, iron: 5.9, zinc: 1.4 },
  '花椒': { calories: 337, protein: 6.7, fat: 9.4, carbs: 21, fiber: 14, vitaminA: 0, vitaminC: 0, calcium: 69, iron: 8.3, zinc: 1.3 },
  '葱': { calories: 30, protein: 1.7, fat: 0.3, carbs: 5, fiber: 2.3, vitaminA: 12, vitaminC: 19, calcium: 46, iron: 0.7, zinc: 0.3 },
  '胡椒粉': { calories: 251, protein: 10, fat: 3.3, carbs: 64, fiber: 25, vitaminA: 0, vitaminC: 0, calcium: 443, iron: 9.2, zinc: 1.2 },
  '五香粉': { calories: 300, protein: 9, fat: 8, carbs: 40, fiber: 20, vitaminA: 0, vitaminC: 0, calcium: 100, iron: 5, zinc: 1.5 },
  '孜然': { calories: 333, protein: 18, fat: 15, carbs: 32, fiber: 10, vitaminA: 0, vitaminC: 0, calcium: 77, iron: 6.1, zinc: 3.4 },
  '咖喱粉': { calories: 325, protein: 9.5, fat: 14, carbs: 30, fiber: 24, vitaminA: 0, vitaminC: 0, calcium: 193, iron: 9.2, zinc: 2.3 },

  // 加工食品
  '香肠': { calories: 308, protein: 12, fat: 28, carbs: 3, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 8, iron: 1, zinc: 1.5 },
  '火腿': { calories: 189, protein: 17, fat: 13, carbs: 0.5, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 0.9, zinc: 2.1 },
  '培根': { calories: 541, protein: 37, fat: 42, carbs: 1.4, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 11, iron: 1.4, zinc: 3.6 },
  '腊肉': { calories: 499, protein: 24, fat: 43, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 22, iron: 2.6, zinc: 2.5 },
  '肉松': { calories: 398, protein: 38, fat: 16, carbs: 26, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 28, iron: 6.1, zinc: 3.4 },
  '松花蛋': { calories: 171, protein: 13, fat: 11, carbs: 4, fiber: 0, vitaminA: 49, vitaminC: 0, calcium: 26, iron: 1.5, zinc: 0.7 },
  '年糕': { calories: 154, protein: 3.4, fat: 0.6, carbs: 34, fiber: 0.9, vitaminA: 0, vitaminC: 0, calcium: 11, iron: 0.6, zinc: 0.6 },
  '汤圆': { calories: 263, protein: 4.7, fat: 8.8, carbs: 45, fiber: 1.2, vitaminA: 0, vitaminC: 0, calcium: 9, iron: 0.7, zinc: 0.5 },
  '粽子': { calories: 194, protein: 4.5, fat: 1.8, carbs: 40, fiber: 1.3, vitaminA: 0, vitaminC: 0, calcium: 8, iron: 0.9, zinc: 0.6 },
  '凉皮': { calories: 117, protein: 3.2, fat: 0.5, carbs: 25, fiber: 1.2, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 0.5, zinc: 0.4 },
  '螺蛳粉': { calories: 218, protein: 7.8, fat: 5.6, carbs: 36, fiber: 2.4, vitaminA: 0, vitaminC: 0, calcium: 30, iron: 2.1, zinc: 0.8 },
  '臭豆腐': { calories: 98, protein: 9, fat: 4, carbs: 5, fiber: 0.8, vitaminA: 0, vitaminC: 0, calcium: 75, iron: 2.2, zinc: 1.0 },
  '肉夹馍': { calories: 287, protein: 12, fat: 14, carbs: 31, fiber: 1.5, vitaminA: 0, vitaminC: 0, calcium: 45, iron: 2.5, zinc: 2.1 },
  '凉面': { calories: 167, protein: 4.2, fat: 2.5, carbs: 31, fiber: 1.2, vitaminA: 0, vitaminC: 0, calcium: 18, iron: 1.2, zinc: 0.6 },
  '炒饭': { calories: 163, protein: 4.4, fat: 4.4, carbs: 26, fiber: 0.7, vitaminA: 0, vitaminC: 0, calcium: 9, iron: 0.8, zinc: 0.6 },
  '炒面': { calories: 172, protein: 5.8, fat: 5.5, carbs: 27, fiber: 1.2, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 1.2, zinc: 0.6 },
  '方便面': { calories: 473, protein: 9, fat: 21, carbs: 61, fiber: 2.3, vitaminA: 0, vitaminC: 0, calcium: 25, iron: 4.1, zinc: 1.3 },
  '油条': { calories: 386, protein: 6.4, fat: 18, carbs: 48, fiber: 1.2, vitaminA: 0, vitaminC: 0, calcium: 8, iron: 2.2, zinc: 0.8 },
  '煎饼': { calories: 333, protein: 8, fat: 7, carbs: 60, fiber: 2.4, vitaminA: 0, vitaminC: 0, calcium: 26, iron: 3.2, zinc: 1.1 },
  '手抓饼': { calories: 356, protein: 7.4, fat: 17, carbs: 46, fiber: 1.8, vitaminA: 0, vitaminC: 0, calcium: 20, iron: 2.5, zinc: 0.9 },
  '鸡蛋饼': { calories: 198, protein: 7.8, fat: 8.9, carbs: 24, fiber: 1.2, vitaminA: 35, vitaminC: 0, calcium: 32, iron: 1.6, zinc: 0.8 },
  '烧饼': { calories: 287, protein: 8, fat: 6, carbs: 51, fiber: 2.2, vitaminA: 0, vitaminC: 0, calcium: 40, iron: 2.8, zinc: 1.0 },
  '煎饼果子': { calories: 280, protein: 7.5, fat: 10, carbs: 42, fiber: 1.5, vitaminA: 0, vitaminC: 0, calcium: 28, iron: 2.5, zinc: 0.9 },
};

export function getIngredientNutrition(name: string): NutritionInfo {
  return INGREDIENT_NUTRITION_DATA[name] || {
    calories: 50,
    protein: 2,
    fat: 1,
    carbs: 10,
    fiber: 1,
    vitaminA: 10,
    vitaminC: 5,
    calcium: 10,
    iron: 0.5,
    zinc: 0.3,
  };
}

export function calculateTotalNutrition(ingredients: { name: string; amount: number; unit: string }[]): NutritionInfo {
  const result: NutritionInfo = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    vitaminA: 0,
    vitaminC: 0,
    calcium: 0,
    iron: 0,
    zinc: 0,
  };

  for (const ingredient of ingredients) {
    const nutrition = getIngredientNutrition(ingredient.name);
    const factor = getAmountInGrams(ingredient.amount, ingredient.unit) / 100;
    
    result.calories += nutrition.calories * factor;
    result.protein += nutrition.protein * factor;
    result.fat += nutrition.fat * factor;
    result.carbs += nutrition.carbs * factor;
    result.fiber += nutrition.fiber * factor;
    result.vitaminA += nutrition.vitaminA * factor;
    result.vitaminC += nutrition.vitaminC * factor;
    result.calcium += nutrition.calcium * factor;
    result.iron += nutrition.iron * factor;
    result.zinc += nutrition.zinc * factor;
  }

  return result;
}

export interface IngredientInput {
  amount: number;
  unit?: string;
  nutritionPer100g?: NutritionInfo;
  name?: string;
}

export function calculateIngredientNutrition(
  ingredient: IngredientInput
): NutritionInfo {
  // 简化计算：直接按克计算，amount / 100 * 每100g营养值
  const factor = ingredient.amount / 100;
  const nutrition = ingredient.nutritionPer100g || getIngredientNutrition('');
  
  return {
    calories: Math.round(nutrition.calories * factor * 10) / 10,
    protein: Math.round(nutrition.protein * factor * 10) / 10,
    fat: Math.round(nutrition.fat * factor * 10) / 10,
    carbs: Math.round(nutrition.carbs * factor * 10) / 10,
    fiber: Math.round(nutrition.fiber * factor * 10) / 10,
    vitaminA: Math.round(nutrition.vitaminA * factor * 10) / 10,
    vitaminC: Math.round(nutrition.vitaminC * factor * 10) / 10,
    calcium: Math.round(nutrition.calcium * factor * 10) / 10,
    iron: Math.round(nutrition.iron * factor * 10) / 10,
    zinc: Math.round(nutrition.zinc * factor * 10) / 10,
  };
}

export function calculateNutritionFromIngredients(
  ingredients: IngredientInput[]
): NutritionInfo {
  const result: NutritionInfo = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    vitaminA: 0,
    vitaminC: 0,
    calcium: 0,
    iron: 0,
    zinc: 0,
  };

  for (const ingredient of ingredients) {
    const nutrition = calculateIngredientNutrition(ingredient);
    result.calories += nutrition.calories;
    result.protein += nutrition.protein;
    result.fat += nutrition.fat;
    result.carbs += nutrition.carbs;
    result.fiber += nutrition.fiber;
    result.vitaminA += nutrition.vitaminA;
    result.vitaminC += nutrition.vitaminC;
    result.calcium += nutrition.calcium;
    result.iron += nutrition.iron;
    result.zinc += nutrition.zinc;
  }

  return result;
}

export const UNIT_TO_GRAMS: Record<string, number> = {
  'g': 1, '克': 1,
  'kg': 1000, '千克': 1000,
  'mg': 0.001,
  'ml': 1, '毫升': 1,
  'l': 1000, '升': 1000,
  '个': 50, '只': 50,
  '勺': 15, '汤匙': 15, '茶匙': 5,
  '杯': 240,
  '片': 30,
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
};

// 食材单个重量映射表（单位：克）- 用于"个"、"只"等单位的精确转换
export const INGREDIENT_UNIT_WEIGHT: Record<string, number> = {
  // 蛋类
  '鸡蛋': 50,
  '鸭蛋': 70,
  '鹌鹑蛋': 10,
  '皮蛋': 50,
  
  // 水果类 - 按常见大小
  '苹果': 150,
  '香蕉': 120,
  '橙子': 130,
  '梨': 150,
  '桃子': 150,
  '猕猴桃': 80,
  '芒果': 200,
  '火龙果': 300,
  '柚子': 1000,
  '西瓜': 2000,
  '葡萄': 10,
  '草莓': 15,
  '樱桃': 10,
  '荔枝': 10,
  '龙眼': 10,
  '菠萝': 1000,
  '哈密瓜': 1500,
  '柠檬': 80,
  '百香果': 20,
  '石榴': 250,
  
  // 蔬菜类
  '西红柿': 120,
  '土豆': 150,
  '胡萝卜': 100,
  '洋葱': 150,
  '大蒜': 10,
  '姜': 30,
  '青椒': 80,
  '黄瓜': 150,
  '茄子': 200,
  '玉米': 200,
  '红薯': 150,
  '莲藕': 200,
  '南瓜': 1500,
  '冬瓜': 2000,
  '苦瓜': 200,
  '萝卜': 200,
  '山药': 200,
  '芋头': 100,
  '白菜': 500,
  '菠菜': 200,
  '芹菜': 150,
  '生菜': 100,
  '西兰花': 200,
  '花菜': 300,
  '豆角': 10,
  '香菇': 20,
  '木耳': 10,
  '豆芽': 10,
  '芦笋': 15,
  '茭白': 100,
  '莴苣': 150,
  '油麦菜': 100,
  '空心菜': 100,
  '芥蓝': 150,
  '苋菜': 100,
  '茼蒿': 100,
  
  // 肉类
  '鸡翅': 50,
  '鸡腿': 150,
  '鸡爪': 30,
  '猪蹄': 300,
  '排骨': 200,
  
  // 海鲜类
  '虾': 10,
  '虾仁': 10,
  '螃蟹': 150,
  '扇贝': 20,
  '鱿鱼': 100,
  '鲈鱼': 400,
  '黄鱼': 300,
  '带鱼': 200,
  '鳕鱼': 150,
  '龙利鱼': 150,
  
  // 其他
  '饺子': 20,
  '包子': 80,
  '馒头': 80,
  '汤圆': 15,
  '粽子': 150,
  '年糕': 200,
  '香肠': 50,
  '火腿': 30,
  '培根': 20,
  '油条': 80,
  '鸡蛋饼': 100,
};

// 获取食材单个重量（用于"个"、"只"等单位）
export function getIngredientUnitWeight(ingredientName: string): number {
  // 直接匹配
  if (INGREDIENT_UNIT_WEIGHT[ingredientName]) {
    return INGREDIENT_UNIT_WEIGHT[ingredientName];
  }
  
  // 模糊匹配
  for (const [name, weight] of Object.entries(INGREDIENT_UNIT_WEIGHT)) {
    if (ingredientName.includes(name) || name.includes(ingredientName)) {
      return weight;
    }
  }
  
  // 默认返回50克
  return 50;
}

// 简化后的转换函数 - 直接返回克数
export function convertToGrams(amount: number, unit?: string): number {
  // 如果单位是ml，按1ml=1g计算
  if (unit === 'ml' || unit === '毫升') {
    return amount;
  }
  // 默认按克计算
  return amount;
}

function getAmountInGrams(amount: number, unit?: string): number {
  return convertToGrams(amount, unit);
}

export const COMMON_INGREDIENTS = Object.keys(INGREDIENT_NUTRITION_DATA);
