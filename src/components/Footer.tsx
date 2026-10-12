import React from 'react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
}) => {
  return (
    <footer className="w-full border-t border-neutral-800 bg-[#070709] py-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#007DFE]"></span>
              <span>Vitamin C Pampatangkad ng Pinoy</span>
            </div>
            <p className="text-neutral-400 text-xs mt-1 max-w-md">
              An unfiltered pay-per-view engineering documentary by Ghost. Dedicated to computer science and IT students defending their capstone thesis.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 flex-wrap text-neutral-300">
            <button
              onClick={() => onScrollToSection('player')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Video Stream
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-neutral-800/80 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-neutral-400">
            <span>© 2026 Ghost · All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>PayMongo GCash Gateway</span>
            <span aria-hidden="true">·</span>
            <span>Lifetime Pass</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
