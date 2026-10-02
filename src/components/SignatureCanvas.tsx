import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SignatureProps {
  value: string;
  signatureType: 'draw' | 'type';
  onSignatureChange: (type: 'draw' | 'type', data: string) => void;
  senderName: string;
}

export const SignatureCanvas: React.FC<SignatureProps> = ({
  value,
  signatureType,
  onSignatureChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedName, setTypedName] = useState(signatureType === 'type' ? value : '');
  const [activeTab, setActiveTab] = useState<'type' | 'draw'>(signatureType);
  const [inkColor, setInkColor] = useState<'#9f1239' | '#0f172a' | '#1e3a8a'>('#9f1239'); // rose, slate, navy

  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = inkColor;

        if (signatureType === 'draw' && value && !hasDrawn) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            setHasDrawn(true);
          };
          img.src = value;
        }
      }
    }
  }, [activeTab, inkColor, signatureType, value, hasDrawn]);

  // Coordinate normalizer for touch and mouse
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
        y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height),
      };
    } else if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = inkColor;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange('draw', dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawn(false);
    onSignatureChange('draw', '');
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTypedName(text);
    onSignatureChange('type', text);
  };

  const switchTab = (tab: 'type' | 'draw') => {
    setActiveTab(tab);
    if (tab === 'type') {
      onSignatureChange('type', typedName);
    } else {
      if (canvasRef.current && hasDrawn) {
        onSignatureChange('draw', canvasRef.current.toDataURL('image/png'));
      } else {
        onSignatureChange('draw', '');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tab toggle */}
      <div className="flex items-center gap-1 p-1 bg-rose-50/80 border border-rose-100 rounded-full mb-3 text-xs">
        <button
          type="button"
          onClick={() => switchTab('type')}
          className={`min-h-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
            activeTab === 'type'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-900/70 hover:text-rose-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type Name</span>
        </button>
        <button
          type="button"
          onClick={() => switchTab('draw')}
          className={`min-h-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
            activeTab === 'draw'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-900/70 hover:text-rose-900'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Draw with Pen</span>
        </button>
      </div>

      {activeTab === 'type' ? (
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={typedName}
              onChange={handleTypeChange}
              maxLength={100}
              placeholder="Type your beautiful name..."
              className="mobile-form-control w-full text-center text-3xl md:text-4xl py-3 px-4 font-cursive text-rose-700 bg-transparent border-b-2 border-rose-300 focus:border-rose-600 focus:outline-hidden transition-colors placeholder:font-sans placeholder:text-base placeholder:text-rose-300"
              autoComplete="off"
            />
          </div>
          {typedName.trim() && (
            <div className="flex items-center gap-1 mt-2 text-xs text-rose-600 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Looking wonderful</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="relative w-full bg-white/90 border border-dashed border-rose-300 rounded-xl shadow-xs overflow-hidden">
            <canvas
              ref={canvasRef}
              width={340}
              height={140}
              className="w-full h-32 touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />

            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-rose-300/80 text-xs">
                <PenTool className="w-5 h-5 mb-1 stroke-1" />
                <span>Sign your name here with finger or mouse</span>
              </div>
            )}

            {/* Subtle baseline */}
            <div className="absolute bottom-6 left-6 right-6 border-b border-rose-100 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between w-full mt-2 px-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 mr-1">Ink:</span>
              <button
                type="button"
                onClick={() => setInkColor('#9f1239')}
                className={`ink-button rounded-full bg-rose-800 transition-transform ${
                  inkColor === '#9f1239' ? 'scale-125 ring-2 ring-rose-400' : 'opacity-70'
                }`}
                title="Rose Ink"
              />
              <button
                type="button"
                onClick={() => setInkColor('#0f172a')}
                className={`ink-button rounded-full bg-slate-900 transition-transform ${
                  inkColor === '#0f172a' ? 'scale-125 ring-2 ring-slate-400' : 'opacity-70'
                }`}
                title="Black Ink"
              />
              <button
                type="button"
                onClick={() => setInkColor('#1e3a8a')}
                className={`ink-button rounded-full bg-blue-900 transition-transform ${
                  inkColor === '#1e3a8a' ? 'scale-125 ring-2 ring-blue-400' : 'opacity-70'
                }`}
                title="Navy Ink"
              />
            </div>

            <button
              type="button"
              onClick={clearCanvas}
              disabled={!hasDrawn}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors py-1 px-2 rounded-md hover:bg-rose-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
