import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/courseData';

export const Testimonials: React.FC = () => {
  return (
    <section className="w-full py-16 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007DFE] uppercase tracking-wider mb-2">
            <span>Verified Peer Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Trusted by All Manyaks around the world.
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Real feedback from Manyaks and Viral video lovers who watched the documentary.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-800 bg-[#0e0e11] p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author attribution (clean, unboxed text per Section 1.A) */}
              <div className="pt-6 border-t border-neutral-800/80 mt-6">
                <div className="text-xs font-semibold text-white">
                  {t.author}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  {t.role}
                </div>
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  {t.school}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
