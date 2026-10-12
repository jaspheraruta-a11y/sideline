import React from 'react';
import { Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface NavbarProps {
  isUnlocked: boolean;
  onOpenCheckout: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isUnlocked,
  onOpenCheckout,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#09090b]/85 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onScrollToSection('hero')}
          className="text-lg font-bold tracking-tight text-white hover:text-neutral-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-[#007DFE]"></span>
          <span>Viral Hayma</span>
        </button>

        {/* Zone 2: Navigation link */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onScrollToSection('player')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Video Stream
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isUnlocked ? (
            <button
              onClick={() => onScrollToSection('player')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Access Unlocked</span>
            </button>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#007DFE] hover:bg-[#0068D6] active:bg-[#0056B3] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Video · ₱29</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
