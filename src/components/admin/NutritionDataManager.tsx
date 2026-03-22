import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { NutritionInfo } from '../../types';
import { getAllFoods, addCustomFood, updateCustomFood, deleteCustomFood } from '../../services/nutritionApi';

const PAGE_SIZE_OPTIONS = [20, 50, 100];

interface NutritionDataManagerProps {
  onExit?: () => void;
}

export function NutritionDataManager({ onExit }: NutritionDataManagerProps) {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<{ name: string; nutrients: NutritionInfo; isCustom: boolean }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingFood, setEditingFood] = useState<{ name: string; nutrients: NutritionInfo } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    loadFoods();
  }, []);

  function loadFoods() {
    const allFoods = getAllFoods();
    setFoods(allFoods);
  }

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return foods;
    const query = searchQuery.toLowerCase();
    return foods.filter(food => food.name.toLowerCase().includes(query));
  }, [foods, searchQuery]);

  const totalPages = Math.ceil(filteredFoods.length / pageSize);
  
  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredFoods.slice(start, end);
  }, [filteredFoods, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  function handleExit() {
    if (onExit) {
      onExit();
    } else {
      navigate('/');
    }
  }

  function handleAddNew() {
    setEditingFood({
      name: '',
      nutrients: {
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
      }
    });
    setShowEditor(true);
  }

  function handleEdit(food: { name: string; nutrients: NutritionInfo }) {
    setEditingFood({ ...food });
    setShowEditor(true);
  }

  function handleDelete(name: string) {
    if (confirm(`确定要删除 "${name}" 吗？`)) {
      const success = deleteCustomFood(name);
      if (success) {
        setMessage({ type: 'success', text: '删除成功' });
        loadFoods();
      } else {
        setMessage({ type: 'error', text: '删除失败' });
      }
      setTimeout(() => setMessage(null), 3000);
    }
  }

  function handleSave() {
    if (!editingFood) return;
    
    if (!editingFood.name.trim()) {
      setMessage({ type: 'error', text: '请输入食材名称' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const existingFood = foods.find(f => f.name === editingFood.name.trim());
    
    let success: boolean;
    if (existingFood) {
      success = updateCustomFood(editingFood.name, editingFood.nutrients);
    } else {
      success = addCustomFood(editingFood.name, editingFood.nutrients);
    }

    if (success) {
      setMessage({ type: 'success', text: existingFood ? '修改成功' : '添加成功' });
      loadFoods();
      setShowEditor(false);
      setEditingFood(null);
    } else {
      setMessage({ type: 'error', text: existingFood ? '修改失败' : '添加失败，食材已存在' });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  function handleNutrientChange(field: keyof NutritionInfo, value: string) {
    if (!editingFood) return;
    const numValue = parseFloat(value) || 0;
    setEditingFood({
      ...editingFood,
      nutrients: {
        ...editingFood.nutrients,
        [field]: numValue
      }
    });
  }

  function handleNameChange(newName: string) {
    if (!editingFood) return;
    setEditingFood({
      ...editingFood,
      name: newName
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* 顶部操作区 */}
      <div className="flex-shrink-0 space-y-3 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">退出</span>
            </button>
            <span className="text-sm text-gray-500">
              共 {filteredFoods.length} 种食材
            </span>
          </div>
          <Button onClick={handleAddNew} size="sm">
            添加新食材
          </Button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <Input
          placeholder="搜索食材..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 食材列表区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-100">
          {paginatedFoods.map((food) => (
            <div key={food.name} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{food.name}</h4>
                    <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${food.isCustom ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {food.isCustom ? '自定义' : '系统'}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>热量: <span className="font-medium text-gray-700">{food.nutrients.calories}</span> kcal</span>
                    <span>蛋白质: <span className="font-medium text-gray-700">{food.nutrients.protein}</span>g</span>
                    <span>脂肪: <span className="font-medium text-gray-700">{food.nutrients.fat}</span>g</span>
                    <span>碳水: <span className="font-medium text-gray-700">{food.nutrients.carbs}</span>g</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(food)}
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(food.name)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {paginatedFoods.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              没有找到匹配的食材
            </div>
          )}
        </div>
      </div>

      {/* 分页区域 - 固定在底部 */}
      <div className="flex-shrink-0 mt-3 bg-white rounded-lg shadow px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>每页</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>条</span>
            <span className="text-gray-400 ml-2">
              共 {filteredFoods.length} 条
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              首页
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {currentPage}/{totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="px-2 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              末页
            </button>
          </div>
        </div>
      </div>

      {/* 编辑弹窗 */}
      {showEditor && editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              {foods.find(f => f.name === editingFood.name) ? '编辑食材' : '添加新食材'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  食材名称
                </label>
                <Input
                  value={editingFood.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="输入食材名称"
                />
              </div>

              <div className="text-sm text-gray-500 mb-4">
                所有营养素含量均以"每100克可食部食物"表达
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    热量 (kcal)
                  </label>
                  <Input
                    type="number"
                    value={editingFood.nutrients.calories}
                    onChange={(e) => handleNutrientChange('calories', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    蛋白质 (g)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingFood.nutrients.protein}
                    onChange={(e) => handleNutrientChange('protein', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    脂肪 (g)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingFood.nutrients.fat}
                    onChange={(e) => handleNutrientChange('fat', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    碳水化合物 (g)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingFood.nutrients.carbs}
                    onChange={(e) => handleNutrientChange('carbs', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    膳食纤维 (g)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingFood.nutrients.fiber}
                    onChange={(e) => handleNutrientChange('fiber', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    维生素A (μgRAE)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingFood.nutrients.vitaminA}
                    onChange={(e) => handleNutrientChange('vitaminA', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    维生素C (mg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingFood.nutrients.vitaminC}
                    onChange={(e) => handleNutrientChange('vitaminC', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    钙 (mg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingFood.nutrients.calcium}
                    onChange={(e) => handleNutrientChange('calcium', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    铁 (mg)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingFood.nutrients.iron}
                    onChange={(e) => handleNutrientChange('iron', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    锌 (mg)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingFood.nutrients.zinc}
                    onChange={(e) => handleNutrientChange('zinc', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => { setShowEditor(false); setEditingFood(null); }}>
                取消
              </Button>
              <Button onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
