import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils';
import { validateImageFile } from '../../utils';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(value || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '文件验证失败');
      setInputKey(k => k + 1);
      return;
    }

    setError('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
      setLoading(false);
      setShowCropper(true);
    };
    reader.onerror = () => {
      setError('文件读取失败');
      setLoading(false);
      setInputKey(k => k + 1);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile: Blob) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
      onChange(result);
      setShowCropper(false);
      setInputKey(k => k + 1);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    setError('');
    setInputKey(k => k + 1);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">上传图片</span>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="btn btn-primary cursor-pointer">
            <input
              key={inputKey}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            选择图片
          </label>
          <p className="text-xs text-gray-500 mt-2">支持 JPG/PNG 格式，最大 5MB</p>
        </div>
      </div>
      
      {preview && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCropper(true)}
            className="btn btn-ghost text-sm"
          >
            裁剪图片
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="btn btn-ghost text-sm text-red-500"
          >
            删除图片
          </button>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {showCropper && preview && (
        <ImageCropperModal
          src={preview}
          onComplete={handleCropComplete}
          onSkip={() => {
            onChange(preview);
            setShowCropper(false);
          }}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}

interface ImageCropperModalProps {
  src: string;
  onComplete: (file: Blob) => void;
  onSkip: () => void;
  onClose: () => void;
}

function ImageCropperModal({ src, onComplete, onSkip, onClose }: ImageCropperModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 50, y: 50, size: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'>('move');
  const dragStartRef = useRef({ x: 0, y: 0, cropX: 0, cropY: 0, cropSize: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImgElement(img);
      const maxW = 500;
      const maxH = 400;
      let w = img.width;
      let h = img.height;
      if (w > maxW) { h = h * (maxW / w); w = maxW; }
      if (h > maxH) { w = w * (maxH / h); h = maxH; }
      setImageSize({ width: w, height: h });
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, type: 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      cropX: crop.x,
      cropY: crop.y,
      cropSize: crop.size
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((clientX - dragStartRef.current.x) / rect.width) * 100;
      const dy = ((clientY - dragStartRef.current.y) / rect.height) * 100;
      
      const start = dragStartRef.current;
      let newCrop = { x: crop.x, y: crop.y, size: crop.size };
      
      if (dragType === 'move') {
        newCrop.x = Math.max(0, Math.min(100 - start.cropSize, start.cropX + dx));
        newCrop.y = Math.max(0, Math.min(100 - start.cropSize, start.cropY + dy));
      } else {
        let deltaX = 0;
        let deltaY = 0;
        
        if (dragType.includes('e')) deltaX = dx;
        if (dragType.includes('w')) deltaX = -dx;
        if (dragType.includes('s')) deltaY = dy;
        if (dragType.includes('n')) deltaY = -dy;
        
        const sizeDelta = deltaX + deltaY;
        const newSize = Math.max(20, Math.min(100, start.cropSize + sizeDelta));
        
        if (dragType.includes('w') || dragType.includes('n')) {
          if (dragType === 'w' || dragType === 'sw' || dragType === 'nw') {
            newCrop.x = start.cropX + (start.cropSize - newSize);
          }
          if (dragType === 'n' || dragType === 'ne' || dragType === 'nw') {
            newCrop.y = start.cropY + (start.cropSize - newSize);
          }
        }
        newCrop.size = newSize;
        
        newCrop.x = Math.max(0, Math.min(100 - newCrop.size, newCrop.x));
        newCrop.y = Math.max(0, Math.min(100 - newCrop.size, newCrop.y));
      }
      
      setCrop(newCrop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragType, crop]);

  const handleComplete = () => {
    if (!imgElement) return;
    
    const canvas = document.createElement('canvas');
    const scale = imgElement.width / imageSize.width;
    
    canvas.width = 800;
    canvas.height = 800;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cropX = (crop.x / 100) * imageSize.width * scale;
      const cropY = (crop.y / 100) * imageSize.height * scale;
      const cropW = (crop.size / 100) * imageSize.width * scale;
      const cropH = (crop.size / 100) * imageSize.height * scale;
      
      ctx.drawImage(imgElement, cropX, cropY, cropW, cropH, 0, 0, 800, 800);
      
      canvas.toBlob((blob) => {
        if (blob) onComplete(blob);
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold">裁剪图片</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          {imageLoaded && (
            <div 
              ref={containerRef}
              className="relative mx-auto select-none"
              style={{ width: imageSize.width, height: imageSize.height }}
            >
              <img 
                src={src} 
                alt="Crop" 
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
              
              <div 
                className="absolute border-2 border-white shadow-lg cursor-move touch-none"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.size}%`,
                  height: `${crop.size}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
                onTouchStart={(e) => handleMouseDown(e, 'move')}
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white/30" />
                  ))}
                </div>
                
                <div className="absolute top-0 left-0 right-0 h-3 cursor-n-resize hover:bg-white/20" 
                  onMouseDown={(e) => handleMouseDown(e, 'n')}
                  onTouchStart={(e) => handleMouseDown(e, 'n')} />
                <div className="absolute bottom-0 left-0 right-0 h-3 cursor-s-resize hover:bg-white/20"
                  onMouseDown={(e) => handleMouseDown(e, 's')}
                  onTouchStart={(e) => handleMouseDown(e, 's')} />
                <div className="absolute top-0 bottom-0 left-0 w-3 cursor-w-resize hover:bg-white/20"
                  onMouseDown={(e) => handleMouseDown(e, 'w')}
                  onTouchStart={(e) => handleMouseDown(e, 'w')} />
                <div className="absolute top-0 bottom-0 right-0 w-3 cursor-e-resize hover:bg-white/20"
                  onMouseDown={(e) => handleMouseDown(e, 'e')}
                  onTouchStart={(e) => handleMouseDown(e, 'e')} />
                
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-white rounded-full cursor-nwse-resize shadow border-2 border-gray-400 hover:border-primary hover:scale-110 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, 'nw')}
                  onTouchStart={(e) => handleMouseDown(e, 'nw')} />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-full cursor-nesw-resize shadow border-2 border-gray-400 hover:border-primary hover:scale-110 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, 'ne')}
                  onTouchStart={(e) => handleMouseDown(e, 'ne')} />
                <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 bg-white rounded-full cursor-nesw-resize shadow border-2 border-gray-400 hover:border-primary hover:scale-110 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, 'sw')}
                  onTouchStart={(e) => handleMouseDown(e, 'sw')} />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full cursor-nwse-resize shadow border-2 border-gray-400 hover:border-primary hover:scale-110 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, 'se')}
                  onTouchStart={(e) => handleMouseDown(e, 'se')} />
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 text-center mt-4">
            拖动方框移动位置，或拖动角落调整大小
          </p>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex flex-wrap justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">取消</button>
          <button onClick={onSkip} className="btn btn-ghost">使用原图</button>
          <button onClick={handleComplete} className="btn btn-primary">确认裁剪</button>
        </div>
      </div>
    </div>
  );
}
