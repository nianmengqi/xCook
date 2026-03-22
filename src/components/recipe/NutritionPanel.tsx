import React from 'react';
import { NutritionInfo } from '../../types';
import { formatNumber } from '../../utils';

interface NutritionPanelProps {
  nutrition: NutritionInfo;
  servings?: number;
}

export function NutritionPanel({ nutrition, servings = 1 }: NutritionPanelProps) {
  const perServing = {
    calories: nutrition.calories / servings,
    protein: nutrition.protein / servings,
    fat: nutrition.fat / servings,
    carbs: nutrition.carbs / servings,
    fiber: nutrition.fiber / servings,
    vitaminA: nutrition.vitaminA / servings,
    vitaminC: nutrition.vitaminC / servings,
    calcium: nutrition.calcium / servings,
    iron: nutrition.iron / servings,
    zinc: nutrition.zinc / servings,
  };

  const macros = [
    { label: '蛋白质', value: perServing.protein, color: '#22C55E', unit: 'g' },
    { label: '脂肪', value: perServing.fat, color: '#F59E0B', unit: 'g' },
    { label: '碳水', value: perServing.carbs, color: '#3B82F6', unit: 'g' },
  ];

  const totalMacro = perServing.protein + perServing.fat + perServing.carbs;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-semibold text-gray-900 mb-4">营养成分</h3>
      
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-primary">{Math.round(perServing.calories)}</div>
        <div className="text-sm text-gray-500">千卡 / 份</div>
      </div>

      <div className="flex h-2 rounded-full overflow-hidden mb-4">
        {macros.map((macro, index) => (
          <div
            key={macro.label}
            className="h-full"
            style={{ 
              width: `${(macro.value / totalMacro) * 100}%`,
              backgroundColor: macro.color,
              marginLeft: index > 0 ? '2px' : 0
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {macros.map((macro) => (
          <div key={macro.label} className="text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: macro.color }} />
            <div className="text-sm font-medium">{formatNumber(macro.value, 1)}{macro.unit}</div>
            <div className="text-xs text-gray-500">{macro.label}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        {[
          { label: '膳食纤维', value: perServing.fiber, unit: 'g' },
          { label: '维生素A', value: perServing.vitaminA, unit: 'μg' },
          { label: '维生素C', value: perServing.vitaminC, unit: 'mg' },
          { label: '钙', value: perServing.calcium, unit: 'mg' },
          { label: '铁', value: perServing.iron, unit: 'mg' },
          { label: '锌', value: perServing.zinc, unit: 'mg' },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium">{formatNumber(item.value, 1)}{item.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
