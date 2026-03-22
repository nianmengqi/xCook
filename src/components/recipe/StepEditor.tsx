import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Textarea } from '../common/Input';
import { CookingStep } from '../../types';
import { cn } from '../../utils';

interface StepEditorProps {
  steps: CookingStep[];
  onAdd: (step: Omit<CookingStep, 'id'>) => void;
  onRemove: (id: string) => void;
  onReorder?: (steps: CookingStep[]) => void;
}

export function StepEditor({ steps, onAdd, onRemove, onReorder }: StepEditorProps) {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const handleAdd = () => {
    if (!description.trim()) return;

    onAdd({
      order: steps.length + 1,
      description: description.trim(),
      duration: duration ? Number(duration) : undefined,
    });

    setDescription('');
    setDuration('');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !onReorder) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    newSteps.forEach((step, i) => step.order = i + 1);
    onReorder(newSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index === steps.length - 1 || !onReorder) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    newSteps.forEach((step, i) => step.order = i + 1);
    onReorder(newSteps);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <Textarea
          placeholder="描述这个烹饪步骤..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <input
              type="number"
              placeholder="预计时间（分钟）"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
            />
          </div>
          <Button onClick={handleAdd} disabled={!description.trim()}>
            添加步骤
          </Button>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg group"
            >
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className={cn(
                    'p-1 rounded hover:bg-gray-100',
                    index === 0 && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="w-6 h-6 flex items-center justify-center bg-primary text-white text-sm font-medium rounded-full">
                  {step.order}
                </span>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === steps.length - 1}
                  className={cn(
                    'p-1 rounded hover:bg-gray-100',
                    index === steps.length - 1 && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 whitespace-pre-wrap">{step.description}</p>
                {step.duration && (
                  <span className="inline-flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    约 {step.duration} 分钟
                  </span>
                )}
              </div>
              <button
                onClick={() => onRemove(step.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {steps.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>还没有添加烹饪步骤</p>
          <p className="text-sm">在上方添加第一步吧</p>
        </div>
      )}
    </div>
  );
}
