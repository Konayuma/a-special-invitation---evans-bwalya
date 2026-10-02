import React, { useRef } from 'react';
import { Calendar, Download, Sparkles, Heart, Check, Share2, Award } from 'lucide-react';
import { InvitationConfig } from '../types';
import { downloadIcsFile, generateGoogleCalendarUrl } from '../utils/calendar';

interface DateKeepsakeProps {
  config: InvitationConfig;
  onEditRsvp: () => void;
}

export const DateKeepsake: React.FC<DateKeepsakeProps> = ({ config, onEditRsvp }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const googleCalUrl = generateGoogleCalendarUrl(
    config.eventTitle,
    `Romantic date with ${config.senderName}!\nAttire: Active, Casual, Evening Wear.\nLocation Clue: ${config.locationClue}`,
    config.locationClue,
    config.dateStr,
    config.senderName
  );

  const handleDownloadIcs = () => {
    downloadIcsFile(
      config.eventTitle,
      `Date with ${config.senderName}!\nAttire guidelines: Active Wear, Casual Wear, Evening Wear.\n${config.locationClue}`,
      config.locationClue,
      config.senderName
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "It's a Date! ❤️",
          text: `I said YES to ${config.senderName} for ${config.eventTitle} on ${config.dateStr}! 🥂✨`,
          url: window.location.href,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `It's a date! ❤️ ${config.senderName} & ${config.recipientName} on ${config.dateStr}! 🥂`
      );
      alert('Date announcement copied to clipboard!');
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      {/* Certificate Frame */}
      <div
        ref={cardRef}
        className="w-full bg-linear-to-b from-amber-50/60 via-white to-rose-50/50 border-2 border-rose-200/80 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden text-center"
      >
        {/* Subtle vintage floral watermark corner */}
        <div className="absolute top-2 left-2 text-rose-200/50 text-2xl select-none">❦</div>
        <div className="absolute top-2 right-2 text-rose-200/50 text-2xl select-none">❦</div>
        <div className="absolute bottom-2 left-2 text-rose-200/50 text-2xl select-none">❦</div>
        <div className="absolute bottom-2 right-2 text-rose-200/50 text-2xl select-none">❦</div>

        {/* Wax seal emblem */}
        <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-rose-700 via-rose-800 to-rose-950 text-amber-100 flex flex-col items-center justify-center shadow-lg border-2 border-rose-400/40 animate-stamp relative">
          <Heart className="w-6 h-6 fill-amber-200 text-amber-100" />
          <span className="text-[7px] font-bold tracking-widest uppercase mt-0.5 text-amber-200/90">
            SEALED
          </span>
        </div>

        <div className="mt-3">
          <span className="text-[10px] uppercase tracking-widest text-rose-800/80 font-semibold">
            Official Date Certificate
          </span>
          <h2 className="font-cursive text-3xl text-rose-800 leading-tight mt-0.5">
            It is Officially a Date!
          </h2>
        </div>

        <p className="font-serif italic text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
          This certifies that an unforgettable adventure has been sealed between two hearts.
        </p>

        {/* Details Grid */}
        <div className="mt-4 py-3 border-y border-dashed border-rose-200/80 space-y-1.5 text-left text-xs">
          <div className="keepsake-detail-row flex justify-between items-start gap-3 text-slate-700">
            <span className="text-slate-500 font-medium">Date & Time:</span>
            <span className="font-semibold text-right text-rose-900">{config.dateStr}</span>
          </div>
          <div className="keepsake-detail-row flex justify-between items-start gap-3 text-slate-700">
            <span className="text-slate-500 font-medium">Adventure:</span>
            <span className="min-w-0 text-right text-slate-800">{config.eventTitle}</span>
          </div>
          <div className="keepsake-detail-row flex justify-between items-start gap-3 text-slate-700">
            <span className="text-slate-500 font-medium">Attire:</span>
            <span className="text-slate-800">Active · Casual · Evening</span>
          </div>
          {config.partnerResponse.note && (
            <div className="pt-1 text-[11px] text-rose-800 bg-rose-50/70 p-1.5 rounded-md">
              <span className="font-medium">Sweet Note:</span> &ldquo;{config.partnerResponse.note}&rdquo;
            </div>
          )}
        </div>

        {/* Dual Signature row */}
        <div className="grid grid-cols-2 gap-4 mt-5 pt-1 text-center">
          <div className="flex flex-col items-center">
            <div className="h-10 flex items-center justify-center">
              <span className="font-cursive text-xl sm:text-2xl leading-tight text-rose-900 font-bold break-words">
                {config.senderName}
              </span>
            </div>
            <div className="w-24 border-b border-rose-300 mt-0.5" />
            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              Host & Admirer
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-10 flex items-center justify-center">
              {config.partnerResponse.signatureType === 'draw' &&
              config.partnerResponse.signatureData ? (
                <img
                  src={config.partnerResponse.signatureData}
                  alt="Recipient Signature"
                  className="max-h-9 max-w-[100px] object-contain"
                />
              ) : (
                <span className="font-cursive text-2xl text-rose-900 font-bold">
                  {config.partnerResponse.signatureData || config.recipientName}
                </span>
              )}
            </div>
            <div className="w-24 border-b border-rose-300 mt-0.5" />
            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
              {config.recipientName}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-rose-600 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sealed with boundless love & anticipation</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download .ICS</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 font-medium py-1 px-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Announcement</span>
          </button>

          <button
            type="button"
            onClick={onEditRsvp}
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 py-1 px-2"
          >
            Edit RSVP / Signature
          </button>
        </div>
      </div>
    </div>
  );
};
