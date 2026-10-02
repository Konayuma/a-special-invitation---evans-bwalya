import React, { useState, useRef } from 'react';
import { Maximize2, Plus, X, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoriesGalleryProps {
  memories: MemoryItem[];
  onAddMemory: (memory: MemoryItem) => void;
  onUpdateMemory: (id: string, updated: Partial<MemoryItem>) => void;
}

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({
  memories,
  onAddMemory,
}) => {
  const [selectedImage, setSelectedImage] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMemory = () => {
    if (!previewUrl) return;
    const newMem: MemoryItem = {
      id: `custom-${Date.now()}`,
      image: previewUrl,
      caption: newCaption.trim() || 'A cherished moment together',
      location: newLocation.trim() || 'Special Memory',
      date: 'Forever',
    };
    onAddMemory(newMem);
    setIsAddModalOpen(false);
    setPreviewUrl(null);
    setNewCaption('');
    setNewLocation('');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Portrait contact sheet */}
      <div className="memory-grid grid grid-cols-3 gap-2.5 w-full mt-4">
        {memories.map((mem, idx) => (
          <button
            type="button"
            key={mem.id}
            onClick={() => setSelectedImage(mem)}
            className={`memory-card group relative bg-white p-1.5 pb-2.5 shadow-md border border-rose-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden text-left ${
              idx % 3 === 1 ? 'sm:-translate-y-1' : ''
            }`}
          >
            <div className="relative aspect-3/4 w-full overflow-hidden bg-rose-50">
              <img
                src={mem.image}
                alt={mem.caption}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => {
                  // Fallback container
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.classList.add(
                      'flex',
                      'items-center',
                      'justify-center',
                      'bg-rose-100/70',
                      'text-rose-500'
                    );
                    parent.innerHTML = `
                      <div class="text-center p-2">
                        <svg class="w-6 h-6 mx-auto stroke-current mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span class="text-[10px] font-medium">Sweet Memory</span>
                      </div>
                    `;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-1.5">
                <span className="p-1 rounded-full bg-white/80 text-rose-700 shadow-xs">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="mt-1.5 text-center px-0.5">
              <p className="font-serif text-[11px] text-rose-950 font-semibold truncate leading-tight">
                {mem.caption}
              </p>
              {mem.location && (
                <p className="text-[10px] text-rose-900/60 truncate mt-0.5">
                  {mem.location}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Add Custom Photo Button */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Memory Photo</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="mobile-modal fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white p-3 pb-6 rounded-2xl shadow-2xl border border-rose-100 animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Close photo"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-xl overflow-hidden aspect-3/4 w-full max-h-[68vh] bg-rose-50">
              <img
                src={selectedImage.image}
                alt={selectedImage.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 text-center px-2">
              <h4 className="font-cursive text-2xl text-rose-700 leading-snug">
                {selectedImage.caption}
              </h4>
              {selectedImage.location && (
                <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>{selectedImage.location}</span>
                </p>
              )}
              <div className="flex items-center justify-center gap-1 mt-3 text-rose-400">
                <Heart className="w-4 h-4 fill-rose-400" />
                <span className="text-xs font-serif italic text-rose-600">
                  Every moment with you is gold
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div
          className="mobile-modal fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="mobile-sheet relative max-w-sm w-full max-h-[92dvh] overflow-y-auto bg-white p-4 sm:p-5 rounded-t-3xl sm:rounded-2xl shadow-xl border border-rose-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="font-serif text-lg font-semibold text-rose-950">
                Add Our Photo
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="mobile-icon-button text-slate-400 hover:text-slate-600"
                aria-label="Close photo upload"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* File upload trigger */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-rose-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-xs"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-4/3 border-2 border-dashed border-rose-200 rounded-xl flex flex-col items-center justify-center text-rose-500 hover:bg-rose-50/50 transition-colors p-4"
                >
                  <ImageIcon className="w-8 h-8 mb-2 stroke-1" />
                  <span className="text-xs font-medium">Click to select photo from device</span>
                  <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP</span>
                </button>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={e => setNewCaption(e.target.value)}
                  placeholder="e.g. Our favorite sunset"
                  className="mobile-form-control w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:border-rose-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Location or Date (optional)
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  placeholder="e.g. By the lake / Last summer"
                  className="mobile-form-control w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:border-rose-400 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!previewUrl}
                  onClick={handleSaveMemory}
                  className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 disabled:opacity-40 transition-colors"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
