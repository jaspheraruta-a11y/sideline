import React from 'react';
import {
  Play,
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Code,
  FileText,
  Clock,
  Award,
  Video,
} from 'lucide-react';
import { COURSE_METADATA } from '../data/courseData';
import { VideoPlayer } from './VideoPlayer';

interface HeroSectionProps {
  isUnlocked: boolean;
  onOpenCheckout: () => void;
  externalSeekTime: number | null;
  onClearExternalSeek: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isUnlocked,
  onOpenCheckout,
  externalSeekTime,
  onClearExternalSeek,
}) => {
  return (
    <section id="hero" className="w-full pt-8 pb-16 relative overflow-hidden">
      {/* Subtle background glow effect (Tailwind gradient mesh) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#007DFE]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Editorial Lead-In & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Metadata line with typographic separators (Anti-slop clean metadata) */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-400 flex-wrap">
            <span className="text-[#007DFE] font-semibold">ORIGINAL DOCUMENTARY</span>
            <span aria-hidden="true">·</span>
            <span>4K ULTRA HD</span>
            <span aria-hidden="true">·</span>
            <span>4.2 MINUTES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
            {COURSE_METADATA.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {COURSE_METADATA.heroSubheadline}
          </p>

          {/* Quick author & award attribution */}
          <div className="flex items-center justify-center gap-3 pt-1 text-xs text-neutral-400 flex-wrap">
            <span className="text-neutral-200 font-medium">{COURSE_METADATA.author.name}</span>
            <span aria-hidden="true">·</span>
            <span>{COURSE_METADATA.author.credentials}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400/90 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {COURSE_METADATA.author.award}
            </span>
          </div>
        </div>

        {/* The Central Video Player Anchor */}
        <div id="player" className="scroll-mt-24 w-full">
          <VideoPlayer
            isUnlocked={isUnlocked}
            onOpenCheckout={onOpenCheckout}
            externalSeekTime={externalSeekTime}
            onClearExternalSeek={onClearExternalSeek}
          />
        </div>

        {/* Feature Highlights Grid / Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Video className="w-4 h-4 text-[#007DFE]" />
              <span>Full 4K Video</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              4.2m high-bitrate stream + 5 chapters
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Code className="w-4 h-4 text-[#007DFE]" />
              <span>18,400+ LOC Repo</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Private access to 4 more Viral Videos
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <FileText className="w-4 h-4 text-[#007DFE]" />
              <span>48-Page Nude pics</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              unscensored Pinay Videos
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Lifetime Access</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              Single ₱29 payment, no recurring fees
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
