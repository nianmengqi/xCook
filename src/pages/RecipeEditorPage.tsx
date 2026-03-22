import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ImageUploader } from '../components/common/ImageUploader';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { IngredientInput } from '../components/recipe/IngredientInput';
import { StepEditor } from '../components/recipe/StepEditor';
import { NutritionPanel } from '../components/recipe/NutritionPanel';
import { useRecipe } from '../context/RecipeContext';
import { DEFAULT_CATEGORIES, DIFFICULTY_LABELS, Difficulty, Ingredient, CookingStep } from '../types';
import { calculateTotalNutrition, calculateNutritionFromIngredients } from '../data/nutrition';
import { cn } from '../utils';

type Step = 'basic' | 'ingredients' | 'steps' | 'preview';

export function RecipeEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { recipes, createRecipe, updateRecipe } = useRecipe();
  
  const existingRecipe = id ? recipes.find(r => r.id === id) : null;
  const isEditMode = !!existingRecipe;

  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('hot-dish');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('2');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<CookingStep[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingRecipe) {
      setTitle(existingRecipe.title);
      setDescription(existingRecipe.description || '');
      setCoverImage(existingRecipe.coverImage);
      setCategory(existingRecipe.category);
      setTags(existingRecipe.tags.join(', '));
      setDifficulty(existingRecipe.difficulty);
      setPrepTime(String(existingRecipe.prepTime));
      setCookTime(String(existingRecipe.cookTime));
      setServings(String(existingRecipe.servings));
      setIngredients(existingRecipe.ingredients);
      setSteps(existingRecipe.steps);
    }
  }, [existingRecipe]);

  const steps_list: { key: Step; label: string }[] = [
    { key: 'basic', label: '基本信息' },
    { key: 'ingredients', label: '食材' },
    { key: 'steps', label: '步骤' },
    { key: 'preview', label: '预览' },
  ];

  const currentStepIndex = steps_list.findIndex((s) => s.key === currentStep);

  const nutrition = calculateNutritionFromIngredients(
    ingredients.map((i) => ({ amount: i.amount, unit: i.unit, nutritionPer100g: i.nutritionPer100g, name: i.name }))
  );

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const handleAddStep = (step: Omit<CookingStep, 'id'>) => {
    const newStep: CookingStep = {
      ...step,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleReorderSteps = (newSteps: CookingStep[]) => {
    setSteps(newSteps);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'basic':
        return title.trim() && coverImage;
      case 'ingredients':
        return ingredients.length > 0;
      case 'steps':
        return steps.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const recipeData = {
        title: title.trim(),
        description: description.trim(),
        coverImage,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        difficulty,
        prepTime: Number(prepTime) || 0,
        cookTime: Number(cookTime) || 0,
        servings: Number(servings) || 2,
        ingredients,
        steps,
        nutrition,
        isPublic: true,
      };

      if (isEditMode && existingRecipe) {
        await updateRecipe(existingRecipe.id, recipeData);
        navigate(`/recipe/${existingRecipe.id}`);
      } else {
        const recipe = await createRecipe(recipeData);
        navigate(`/recipe/${recipe.id}`);
      }
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? '编辑菜谱' : '创建菜谱'}
            </h1>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              取消
            </Button>
          </div>

          <div className="flex items-center">
            {steps_list.map((step, index) => (
              <React.Fragment key={step.key}>
                <div className="flex items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      index <= currentStepIndex
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={cn(
                      'ml-2 text-sm hidden sm:block',
                      index <= currentStepIndex ? 'text-gray-900 font-medium' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps_list.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2',
                      index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {currentStep === 'basic' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="font-semibold text-lg mb-4">菜品图片</h2>
              <ImageUploader value={coverImage} onChange={setCoverImage} />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-4">基本信息</h2>
              
              <Input
                label="菜谱标题 *"
                placeholder="例如：宫保鸡丁"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label="菜品描述"
                placeholder="介绍这道菜的特点和风味..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">菜谱分类</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">难度</label>
                <div className="flex gap-2">
                  {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        difficulty === d
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {DIFFICULTY_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="准备时间"
                  type="number"
                  placeholder="分钟"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                />
                <Input
                  label="烹饪时间"
                  type="number"
                  placeholder="分钟"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                />
                <Input
                  label="份量"
                  type="number"
                  placeholder="人份"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>

              <Input
                label="标签"
                placeholder="用逗号分隔，如：川菜、辣、下饭菜"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        )}

        {currentStep === 'ingredients' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="font-semibold text-lg mb-4">添加食材</h2>
              <IngredientInput
                ingredients={ingredients}
                onAdd={handleAddIngredient}
                onRemove={handleRemoveIngredient}
              />
            </div>

            {ingredients.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-semibold text-lg mb-4">营养成分预览</h2>
                <NutritionPanel nutrition={nutrition} servings={Number(servings) || 1} />
              </div>
            )}
          </div>
        )}

        {currentStep === 'steps' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="font-semibold text-lg mb-4">添加烹饪步骤</h2>
              <StepEditor
                steps={steps}
                onAdd={handleAddStep}
                onRemove={handleRemoveStep}
                onReorder={handleReorderSteps}
              />
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video">
                <img
                  src={coverImage || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {DEFAULT_CATEGORIES.find((c) => c.id === category)?.name}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {DIFFICULTY_LABELS[difficulty]}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title || '未命名菜谱'}</h1>
                <p className="text-gray-600 mb-4">{description || '暂无描述'}</p>
                
                <div className="flex gap-4 text-sm text-gray-500 mb-6">
                  <span>准备: {prepTime || 0}分钟</span>
                  <span>烹饪: {cookTime || 0}分钟</span>
                  <span>份量: {servings}人份</span>
                </div>

                {tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.split(',').map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">食材 ({ingredients.length}种)</h3>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {ingredients.map((ing) => (
                      <div key={ing.id} className="flex justify-between text-sm">
                        <span>{ing.name}</span>
                        <span className="text-gray-500">{ing.amount}{ing.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">烹饪步骤 ({steps.length}步)</h3>
                  <div className="space-y-3">
                    {steps.map((step) => (
                      <div key={step.id} className="flex gap-3">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {step.order}
                        </span>
                        <p className="text-gray-700 text-sm">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <NutritionPanel nutrition={nutrition} servings={Number(servings) || 1} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => {
              const index = currentStepIndex;
              if (index > 0) {
                setCurrentStep(steps_list[index - 1].key);
              }
            }}
            disabled={currentStepIndex === 0}
          >
            上一步
          </Button>
          
          {currentStep === 'preview' ? (
            <Button onClick={handleSubmit} loading={isSubmitting}>
              {isEditMode ? '保存修改' : '发布菜谱'}
            </Button>
          ) : (
            <Button
              onClick={() => {
                const index = currentStepIndex;
                if (index < steps_list.length - 1) {
                  setCurrentStep(steps_list[index + 1].key);
                }
              }}
              disabled={!canProceed()}
            >
              下一步
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
