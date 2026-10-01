import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { AttireGuideline } from '../types';

interface AttireSectionProps {
  attires: AttireGuideline[];
}

export const AttireSection: React.FC<AttireSectionProps> = ({ attires }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedOutfits, setCheckedOutfits] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const toggleCheck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCheckedOutfits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full space-y-3.5 mt-2">
        {attires.map(item => {
          const isExpanded = expandedId === item.id;
          const isPacked = !!checkedOutfits[item.id];

          return (
            <div
              key={item.id}
              onClick={() => toggleExpand(item.id)}
              className={`w-full text-left transition-all duration-300 rounded-2xl border p-4 cursor-pointer relative overflow-hidden ${
                isPacked
                  ? 'bg-rose-50/60 border-rose-200/80 shadow-xs'
                  : 'bg-white/90 hover:bg-rose-50/40 border-rose-100 shadow-xs'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-100/70 border border-rose-200/60 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  {item.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-rose-950 text-base leading-snug">
                      {item.title}
                    </h3>
                    {isPacked && (
                      <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        Ready
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-rose-900/70 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={e => toggleCheck(e, item.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      isPacked
                        ? 'text-emerald-600 hover:text-emerald-700'
                        : 'text-slate-300 hover:text-rose-500'
                    }`}
                    title={isPacked ? 'Outfit marked ready' : 'Mark outfit ready'}
                    aria-label={`Mark ${item.title} as ready`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 transition-transform ${
                        isPacked ? 'fill-emerald-100 scale-110' : ''
                      }`}
                    />
                  </button>

                  <div className="text-rose-400 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-rose-100/70 text-xs text-slate-600 animate-fadeIn">
                  <p className="font-medium text-rose-800 mb-2">{item.subtitle}</p>
                  <ul className="space-y-1.5 pl-1">
                    {item.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-rose-50/70 rounded-xl border border-rose-100/80 text-center w-full">
        <p className="text-[11px] text-rose-800/80">
          Tip: You can pack these three looks in a small weekender bag or tote for our day!
        </p>
      </div>
    </div>
  );
};
