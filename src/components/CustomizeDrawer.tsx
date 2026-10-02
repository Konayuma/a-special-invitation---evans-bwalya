import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Check, Sparkles, Heart } from 'lucide-react';
import { InvitationConfig } from '../types';

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: InvitationConfig;
  onSave: (newConfig: InvitationConfig) => void;
  onReset: () => void;
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<InvitationConfig>(config);

  if (!isOpen) return null;

  const handleChange = (field: keyof InvitationConfig, val: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="mobile-modal fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="mobile-sheet w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-rose-100 max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-600" />
            <h3 className="font-semibold text-rose-950 text-base">
              Personalize Invitation
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mobile-icon-button rounded-full text-slate-400 hover:text-slate-600"
            aria-label="Close personalization"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Recipient Pet Name or Name
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={e => handleChange('recipientName', e.target.value)}
              placeholder="e.g. My Love, Beautiful, Sarah"
              className="mobile-form-control w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Your Name (Host / Admirer)
            </label>
            <input
              type="text"
              value={formData.senderName}
              onChange={e => handleChange('senderName', e.target.value)}
              placeholder="Evans Bradley Dimande"
              className="mobile-form-control w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Date & Schedule
            </label>
            <input
              type="text"
              value={formData.dateStr}
              onChange={e => handleChange('dateStr', e.target.value)}
              placeholder="e.g. Saturday, October 3, 2026"
              className="mobile-form-control w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Location Hint or Secret Clue
            </label>
            <input
              type="text"
              value={formData.locationClue}
              onChange={e => handleChange('locationClue', e.target.value)}
              placeholder="e.g. A scenic coastal spot & a candlelit garden dinner"
              className="mobile-form-control w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Event Subtitle / Occasion
            </label>
            <input
              type="text"
              value={formData.eventTitle}
              onChange={e => handleChange('eventTitle', e.target.value)}
              placeholder="A Day Dedicated Entirely to Us"
              className="mobile-form-control w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-rose-100">
            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs py-1.5 px-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-xs shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
