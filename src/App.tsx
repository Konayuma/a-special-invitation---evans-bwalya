/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sliders,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

import portraitRedImg from './assets/images/WhatsApp Image 2026-10-01 at 18.18.02 (1).jpeg';
import portraitStudioImg from './assets/images/WhatsApp Image 2026-10-01 at 18.18.02 (2).jpeg';
import portraitGraduateImg from './assets/images/WhatsApp Image 2026-10-01 at 18.18.02 (4).jpeg';
import gardenSelfieImg from './assets/images/WhatsApp Image 2026-10-01 at 18.18.02 (5).jpeg';
import gardenPortraitImg from './assets/images/WhatsApp Image 2026-10-01 at 18.18.02 (6).jpeg';
import floralPortraitImg from './assets/images/WhatsApp Image 2026-10-01 at 18.18.02.jpeg';

import { InvitationConfig, MemoryItem, AttireGuideline } from './types';
import { romanticAudio } from './utils/audio';
import { AttireSection } from './components/AttireSection';
import { MemoriesGallery } from './components/MemoriesGallery';
import { SignatureCanvas } from './components/SignatureCanvas';
import { DateKeepsake } from './components/DateKeepsake';
import { CustomizeDrawer } from './components/CustomizeDrawer';

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    image: gardenPortraitImg,
    caption: 'Golden Hour Glow',
    location: 'A beautiful afternoon',
    date: 'One for the books',
  },
  {
    id: 'mem-2',
    image: floralPortraitImg,
    caption: 'Effortlessly You',
    location: 'Sunshine and flowers',
    date: 'A favourite view',
  },
  {
    id: 'mem-3',
    image: portraitRedImg,
    caption: 'A Little Red Moment',
    location: 'Simply stunning',
    date: 'Always unforgettable',
  },
  {
    id: 'mem-4',
    image: portraitStudioImg,
    caption: 'Poise & Grace',
    location: 'A day in the studio',
    date: 'Main-character energy',
  },
  {
    id: 'mem-5',
    image: portraitGraduateImg,
    caption: 'Proud of You',
    location: 'A milestone worth celebrating',
    date: 'The beginning of more',
  },
  {
    id: 'mem-6',
    image: gardenSelfieImg,
    caption: 'That Smile',
    location: 'Out in the garden',
    date: 'Pure sunshine',
  },
];

const DEFAULT_ATTIRES: AttireGuideline[] = [
  {
    id: 'active',
    title: 'Active Wear',
    emoji: '👟',
    subtitle: 'For our morning scenic exploration & fun',
    description: 'Clothes you can break a sweat in.',
    tips: [
      'Comfortable trainers or walking shoes',
      'Breathable athletic wear, joggers, or leggings',
      'A light pullover & your favorite sunglasses',
    ],
    bgTint: 'bg-emerald-50/70',
  },
  {
    id: 'casual',
    title: 'Casual / Relaxed Wear',
    emoji: '🧸',
    subtitle: 'For our afternoon unwind & sweet treats',
    description: 'Clothes you feel completely comfortable in.',
    tips: [
      'Soft sweater, comfortable denim or casual linen',
      'Slip-ons, sneakers, or flats for leisurely strolling',
      'Something cozy you love lounging in',
    ],
    bgTint: 'bg-amber-50/70',
  },
  {
    id: 'evening',
    title: 'Evening Wear',
    emoji: '🥂',
    subtitle: 'For our intimate dinner & toast to us',
    description: 'A nice outfit for a beautiful dinner.',
    tips: [
      'An elegant dress, chic evening fit, or smart stylish attire',
      'Dress shoes or tasteful evening footwear',
      'A warm shawl or jacket for cool starlit night air',
    ],
    bgTint: 'bg-rose-50/70',
  },
];

const STORAGE_KEY = 'evans_invitation_config_v1';
const SENDER_NAME = 'Evans Bradley Dimande';

export default function App() {
  const pageViewportRef = useRef<HTMLElement | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 6;
  const [heartTapCount, setHeartTapCount] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [memories, setMemories] = useState<MemoryItem[]>(DEFAULT_MEMORIES);

  const [config, setConfig] = useState<InvitationConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedConfig = JSON.parse(saved) as InvitationConfig;
        return {
          ...savedConfig,
          senderName:
            !savedConfig.senderName || savedConfig.senderName === 'Evans Bwalya'
              ? SENDER_NAME
              : savedConfig.senderName,
        };
      }
    } catch {
      // Fallback
    }
    return {
      recipientName: 'my love',
      senderName: SENDER_NAME,
      eventTitle: 'A Special Day Dedicated Entirely to Us',
      dateStr: 'Saturday, October 24, 2026',
      timeStr: 'From 10:30 AM into the starlit night',
      locationClue: 'A scenic coastal trail & an intimate candlelit dinner',
      loveLetterIntro: 'I have something special to ask you.',
      formalInviteText:
        'You are cordially invited to join me for a special day dedicated entirely to us.',
      sweetNotePrompt: 'Any favorite craving or song you want for the ride?',
      partnerResponse: {
        selectedOptions: ['yes', 'absolutely'],
        note: '',
        signatureType: 'type',
        signatureData: '',
        isConfirmed: false,
      },
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore
    }
  }, [config]);

  useEffect(() => {
    pageViewportRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // Page navigation
  const navigate = (direction: number) => {
    const next = Math.max(1, Math.min(totalPages, currentPage + direction));
    if (next !== currentPage) {
      setCurrentPage(next);
      romanticAudio.playRomanticChime();
    }
  };

  const jumpToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      setCurrentPage(pageNum);
      romanticAudio.playRomanticChime();
    }
  };

  const handleHeartClick = () => {
    setHeartTapCount(prev => prev + 1);
    romanticAudio.playHeartbeat();
  };

  const toggleSound = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    romanticAudio.setMuted(nextMuted);
    if (!nextMuted) {
      romanticAudio.playRomanticChime();
      romanticAudio.toggleAmbientMusic();
    } else {
      romanticAudio.stopAmbientMusic();
    }
  };

  const toggleRsvpOption = (val: string) => {
    const current = config.partnerResponse.selectedOptions;
    let updated: string[];
    if (current.includes(val)) {
      // Keep at least one selected for sweetness!
      if (current.length > 1) {
        updated = current.filter(x => x !== val);
      } else {
        updated = current;
      }
    } else {
      updated = [...current, val];
      romanticAudio.playRomanticChime();
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
      });
    }

    setConfig(prev => ({
      ...prev,
      partnerResponse: {
        ...prev.partnerResponse,
        selectedOptions: updated,
      },
    }));
  };

  const handleSignatureChange = (type: 'draw' | 'type', data: string) => {
    setConfig(prev => ({
      ...prev,
      partnerResponse: {
        ...prev.partnerResponse,
        signatureType: type,
        signatureData: data,
      },
    }));
  };

  const handleSealDate = () => {
    romanticAudio.playSealStamp();

    // Trigger full romantic confetti shower
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#e11d48', '#fda4af', '#fbbf24', '#ffffff', '#ec4899'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e11d48', '#f43f5e', '#ffd1dc'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e11d48', '#f43f5e', '#ffd1dc'],
      });
    }, 250);

    setConfig(prev => ({
      ...prev,
      partnerResponse: {
        ...prev.partnerResponse,
        isConfirmed: true,
        confirmedAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      },
    }));
  };

  const handleEditRsvp = () => {
    setConfig(prev => ({
      ...prev,
      partnerResponse: {
        ...prev.partnerResponse,
        isConfirmed: false,
      },
    }));
  };

  const handleAddMemory = (newMem: MemoryItem) => {
    setMemories(prev => [newMem, ...prev]);
  };

  const handleResetDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div className="invitation-scene min-h-screen flex flex-col justify-center items-center p-0 sm:p-6 text-slate-800 font-sans selection:bg-rose-200">
      <div className="ambient-photo ambient-photo-left" aria-hidden="true">
        <img src={portraitRedImg} alt="" />
      </div>
      <div className="ambient-photo ambient-photo-right" aria-hidden="true">
        <img src={gardenPortraitImg} alt="" />
      </div>
      <div className="paper-grain" aria-hidden="true" />

      {/* Main Invitation Card Container */}
      <div className="invitation-card relative z-10 w-full max-w-[480px] h-[100dvh] sm:h-[92vh] sm:max-h-[840px] flex flex-col overflow-hidden">
        {/* Top Header Zone */}
        <header className="invitation-header px-4 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-rose-900 font-semibold text-sm">
              Evans presents
            </span>
            <span className="text-rose-300 text-xs">·</span>
            <span className="text-[11px] text-rose-700/80 font-medium">
              {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`header-action rounded-full transition-colors ${
                !isAudioMuted
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-rose-50'
              }`}
              title={!isAudioMuted ? 'Sound & Music On' : 'Unmute Ambient Sound'}
              aria-label="Toggle sound"
            >
              {!isAudioMuted ? (
                <Volume2 className="w-4 h-4 animate-pulse text-rose-600" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Customizer trigger */}
            <button
              type="button"
              onClick={() => setIsCustomizeOpen(true)}
              className="header-action rounded-full text-slate-400 hover:text-slate-700 hover:bg-rose-50 transition-colors"
              title="Personalize invitation"
              aria-label="Personalize invitation"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Card Body - Multi-page viewport */}
        <main ref={pageViewportRef} className="invitation-body min-h-0 flex-1 relative overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5 flex flex-col items-center">
          {/* PAGE 1: Greeting */}
          {currentPage === 1 && (
            <div className="cover-page w-full h-full flex flex-col justify-center items-center text-center my-auto animate-fadeIn">
              <div className="cover-photo-wrap">
                <img src={floralPortraitImg} alt="A favourite portrait of the invitation recipient" className="cover-photo" />
                <button
                  type="button"
                  onClick={handleHeartClick}
                  className="heart-seal group"
                  aria-label="Send a heart"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  {heartTapCount > 0 && <span>{heartTapCount}</span>}
                </button>
                <span className="cover-photo-label">A special day · just for us</span>
              </div>

              <span className="eyebrow mt-5">A private invitation for</span>
              <h1 className="font-cursive text-4xl sm:text-5xl text-rose-800 leading-tight mt-1">
                {config.recipientName}
              </h1>
              <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed mt-1">
                {config.loveLetterIntro}
              </p>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  className="primary-cta px-7 py-3 rounded-full text-white text-sm font-semibold transition-all"
                >
                  Open your invitation <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 2: Formal Invitation */}
          {currentPage === 2 && (
            <div className="w-full flex flex-col items-center text-center my-auto animate-fadeIn">
              <div className="formal-card w-full rounded-2xl p-5 sm:p-6 relative">
                <div className="formal-ribbon absolute -top-3 left-1/2 -translate-x-1/2 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-700">
                  Cordially Invited
                </div>

                <h2 className="font-cursive text-4xl text-rose-800 mt-3 mb-3">
                  An Invitation
                </h2>

                <p className="font-serif italic text-base sm:text-lg text-slate-800 leading-relaxed max-w-xs mx-auto">
                  &ldquo;{config.formalInviteText}&rdquo;
                </p>

                {/* Date & Location Schedule Clues */}
                <div className="mt-5 pt-4 border-t border-rose-100 space-y-2.5 text-xs text-left">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-50/60">
                    <Calendar className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-rose-950 block">Date</span>
                      <span className="text-slate-600">{config.dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-50/60">
                    <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-rose-950 block">Schedule</span>
                      <span className="text-slate-600">{config.timeStr}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-50/60">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-rose-950 block">Destination Clue</span>
                      <span className="text-slate-600">{config.locationClue}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-rose-900/70 mt-4 italic">
                From morning laughter to candlelit evening conversations.
              </p>
            </div>
          )}

          {/* PAGE 3: Attire Guidelines */}
          {currentPage === 3 && (
            <div className="w-full flex flex-col items-center my-auto animate-fadeIn">
              <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-1">
                Dress Code
              </span>
              <h2 className="font-cursive text-3xl sm:text-4xl text-rose-700 mb-1">
                What to Wear
              </h2>
              <p className="text-xs text-slate-600 text-center max-w-xs">
                Please prepare three outfits for our adventure:
              </p>

              <AttireSection attires={DEFAULT_ATTIRES} />
            </div>
          )}

          {/* PAGE 4: Memories / Media Gallery */}
          {currentPage === 4 && (
            <div className="w-full flex flex-col items-center my-auto animate-fadeIn">
              <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-1">
                Cherished Moments
              </span>
              <h2 className="font-cursive text-3xl sm:text-4xl text-rose-700 mb-1">
                Our Memories
              </h2>
              <p className="text-xs text-slate-600 text-center max-w-xs">
                A little reminder of why we are so great together.
              </p>

              <MemoriesGallery
                memories={memories}
                onAddMemory={handleAddMemory}
                onUpdateMemory={() => {}}
              />
            </div>
          )}

          {/* PAGE 5: The Question & RSVP */}
          {currentPage === 5 && (
            <div className="w-full flex flex-col items-center my-auto animate-fadeIn text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-1">
                The Big Question
              </span>

              <h2 className="font-cursive text-3xl sm:text-4xl text-rose-700 mb-2 leading-tight">
                Will you go out with me?
              </h2>

              <p className="text-xs text-slate-600 max-w-xs mx-auto mb-4">
                Choose your heartfelt reply (or select all three!):
              </p>

              {/* RSVP Options */}
              <div className="w-full space-y-2.5 max-w-sm">
                {[
                  { value: 'yes', label: 'Yes', emoji: '❤️' },
                  { value: 'absolutely', label: 'Absolutely', emoji: '✨' },
                  {
                    value: 'waiting',
                    label: 'Been waiting for this!',
                    emoji: '🥂',
                  },
                ].map(opt => {
                  const isChecked = config.partnerResponse.selectedOptions.includes(
                    opt.value
                  );
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => toggleRsvpOption(opt.value)}
                      aria-pressed={isChecked}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                        isChecked
                          ? 'bg-rose-50/90 border-rose-300 shadow-xs'
                          : 'bg-white hover:bg-rose-50/40 border-slate-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-rose-600 border-rose-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && (
                            <span className="text-xs font-bold leading-none">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-rose-950">
                          {opt.label}
                        </span>
                      </div>
                      <span className="text-xl">{opt.emoji}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional sweet note */}
              <div className="w-full max-w-sm mt-4 text-left">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Leave a sweet note for Evans (optional):
                </label>
                <input
                  type="text"
                  value={config.partnerResponse.note}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      partnerResponse: {
                        ...prev.partnerResponse,
                        note: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Can't wait! Play our song in the car..."
                  className="w-full text-xs px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Proceed to Sign & Confirm →
                </button>
              </div>
            </div>
          )}

          {/* PAGE 6: Sign-off & Signatures */}
          {currentPage === 6 && (
            <div className="w-full flex flex-col items-center my-auto animate-fadeIn">
              {!config.partnerResponse.isConfirmed ? (
                <div className="w-full flex flex-col items-center text-center">
                  <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-1">
                    Final Agreement
                  </span>
                  <h2 className="font-cursive text-3xl sm:text-4xl text-rose-700 mb-2">
                    It&apos;s a Date!
                  </h2>

                  {/* Evans's Formal Signature Block */}
                  <div className="w-full max-w-sm bg-rose-50/60 border border-rose-100 rounded-2xl p-4 my-2 text-center">
                    <p className="text-xs text-rose-900/80 mb-0.5">
                      With all my love,
                    </p>
                    <div className="host-signature-name font-cursive text-3xl sm:text-4xl text-rose-900 font-bold tracking-wide">
                      {config.senderName}
                    </div>
                  </div>

                  {/* Recipient's Digital Signature Block */}
                  <div className="w-full max-w-sm mt-2 mb-4">
                    <p className="text-xs font-medium text-slate-700 mb-1 text-center">
                      Sign to accept:
                    </p>
                    <SignatureCanvas
                      value={config.partnerResponse.signatureData}
                      signatureType={config.partnerResponse.signatureType}
                      onSignatureChange={handleSignatureChange}
                      senderName={config.senderName}
                    />
                  </div>

                  {/* Seal Date CTA */}
                  <button
                    type="button"
                    onClick={handleSealDate}
                    className="w-full max-w-xs py-3 px-6 rounded-full bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Seal & Accept Date ❤️</span>
                  </button>
                </div>
              ) : (
                /* Post-Confirmation Keepsake Certificate */
                <DateKeepsake config={config} onEditRsvp={handleEditRsvp} />
              )}
            </div>
          )}
        </main>

        {/* Navigation Controls Bar */}
        <footer className="invitation-footer px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-between shrink-0 select-none">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={currentPage === 1}
            className={`nav-button flex items-center gap-1 text-xs font-medium py-2.5 px-3 rounded-full transition-all ${
              currentPage === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Progress Dots */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToPage(pageNum)}
                  className={`progress-dot transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-5 h-2 bg-rose-600'
                      : 'w-2 h-2 bg-rose-200 hover:bg-rose-300'
                  }`}
                  title={`Go to page ${pageNum}`}
                  aria-label={`Go to page ${pageNum}`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => navigate(1)}
            disabled={currentPage === totalPages}
            className={`nav-button flex items-center gap-1 text-xs font-semibold py-2.5 px-3.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white transition-all shadow-2xs ${
              currentPage === totalPages
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      </div>

      {/* Host Customization Drawer */}
      <CustomizeDrawer
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={config}
        onSave={newConf => setConfig(newConf)}
        onReset={handleResetDefaults}
      />
    </div>
  );
}
