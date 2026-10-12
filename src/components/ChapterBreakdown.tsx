import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Lock, CheckCircle2, Terminal, Clock } from 'lucide-react';
import { CHAPTERS, Chapter } from '../data/courseData';

interface ChapterBreakdownProps {
  isUnlocked: boolean;
  onSeekToChapter: (seconds: number) => void;
  onOpenCheckout: () => void;
}

export const ChapterBreakdown: React.FC<ChapterBreakdownProps> = ({
  isUnlocked,
  onSeekToChapter,
  onOpenCheckout,
}) => {
  // Allow toggling multiple chapters or keep first open by default
  const [openChapterIds, setOpenChapterIds] = useState<number[]>([1, 2]);

  const toggleChapter = (id: number) => {
    setOpenChapterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="chapters" className="w-full py-16 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007DFE] uppercase tracking-wider mb-2">
            <span>Curriculum & Timeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            What You'll Watch: Complete 5-Chapter Breakdown
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Every minute is packed with real production logs, architecture whiteboarding, and unedited defense audio. No hypothetical slides—only what was defended and awarded.
          </p>
        </div>

        {/* Chapters Accordion List */}
        <div className="space-y-3">
          {CHAPTERS.map((chapter) => {
            const isOpen = openChapterIds.includes(chapter.id);

            return (
              <div
                key={chapter.id}
                className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700/70 transition-all overflow-hidden"
              >
                {/* Header row / clickable accordion trigger */}
                <div
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    {/* Chapter index */}
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-300 shrink-0">
                      {chapter.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-semibold text-white tracking-tight">
                          {chapter.title}
                        </h3>
                        <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {chapter.timeFormatted}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-1 sm:line-clamp-none">
                        {chapter.description}
                      </p>
                    </div>
                  </div>

                  {/* Right side: seek CTA & chevron */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isUnlocked) {
                          onSeekToChapter(chapter.startSeconds);
                        } else {
                          onOpenCheckout();
                        }
                      }}
                      className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isUnlocked
                          ? 'bg-[#007DFE]/15 hover:bg-[#007DFE]/25 text-[#007DFE] border border-[#007DFE]/30'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Seek to {chapter.number}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-neutral-400" />
                          <span>Locked</span>
                        </>
                      )}
                    </button>

                    <div className="text-neutral-500 hover:text-white p-1">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded details container */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-neutral-800/60 bg-neutral-950/40">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
                      {/* Left 2 cols: Key Takeaways */}
                      <div className="md:col-span-2 space-y-2.5">
                        <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                          Key Takeaways & Core Concepts
                        </div>
                        <ul className="space-y-2">
                          {chapter.keyTakeaways.map((takeaway, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-neutral-300 flex items-start gap-2.5 leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#007DFE] mt-1.5 shrink-0" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right col: Tech Stack & Jump button on mobile */}
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                          Technologies Analyzed
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {chapter.techFocus.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Mobile seek button */}
                        <div className="pt-2 sm:hidden">
                          <button
                            type="button"
                            onClick={() => {
                              if (isUnlocked) {
                                onSeekToChapter(chapter.startSeconds);
                              } else {
                                onOpenCheckout();
                              }
                            }}
                            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#007DFE] flex items-center justify-center gap-1.5"
                          >
                            {isUnlocked ? (
                              <>
                                <Play className="w-3 h-3 fill-white" />
                                <span>Seek Video to This Chapter</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Unlock Chapter for ₱29</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
