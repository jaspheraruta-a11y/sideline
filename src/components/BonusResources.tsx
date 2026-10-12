import React, { useState } from 'react';
import {
  FileText,
  GitBranch,
  Lock,
  Unlock,
  Download,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  Layers,
  BookOpen,
  X,
} from 'lucide-react';

interface BonusResourcesProps {
  isUnlocked: boolean;
  onOpenCheckout: () => void;
}

export const BonusResources: React.FC<BonusResourcesProps> = ({
  isUnlocked,
  onOpenCheckout,
}) => {
  const [copiedClone, setCopiedClone] = useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  const cloneCommand = 'git clone https://github.com/ghost/capstone-telemetry-breakdown.git';

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleDownloadZip = () => {
    // Generate downloadable text manifest as demonstration of unlocked source code
    const blob = new Blob(
      [
        `# Capstone Project Source Code Bundle
Project: Distributed Real-Time Telemetry & Event Mesh
Lead Architect: Ghost
Award: Best documentary covering the one versus five with uncut scenes.

Repository Files Included:
- /api (FastAPI & Node.js WebSocket Cluster)
- /web (Next.js 14 Dashboard & Three.js Canvas)
- /database (PostgreSQL Schemas & TimescaleDB partitions)
- /infra (Docker Compose, Terraform, Cloud Run configs)
- /docs (48-page Manuscript, Defense Slides, IEEE Formatting)

To start development:
1. docker compose up -d
2. npm install
3. npm run dev
`
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capstone-source-code-manifest.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="resources" className="w-full py-16 border-t border-neutral-800 bg-neutral-950/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007DFE] uppercase tracking-wider mb-2">
            <span>Exclusive Bonus Materials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Engineering Documentation & Source Code
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Included with every pass. Study the exact defense manuscript that convinced the panel, plus the unredacted 18,400+ lines of codebase.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 48-Page Capstone Manuscript PDF */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0e0e11] p-6 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400">
                  <FileText className="w-6 h-6" />
                </div>
                {isUnlocked ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
                    <Lock className="w-3 h-3 text-amber-400" />
                    Requires Pass
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Capstone Thesis Manuscript & Defense Deck
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  The complete 48-page technical documentation submitted to the university panel, including ERD schemas, system architecture topologies, and oral defense Q&A cheat sheet.
                </p>
              </div>

              {/* Document Specs */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-1.5 text-xs text-neutral-300">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Document Format:</span>
                  <span className="font-mono text-neutral-200">PDF (48 Pages, IEEE Standard)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Diagrams Included:</span>
                  <span className="text-neutral-200">System Topology, Sequence, ERD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Defense Bonus:</span>
                  <span className="text-neutral-200">22-Slide Panel Deck (Keynote & PPTX)</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6">
              {isUnlocked ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPdfModal(true)}
                    className="flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-[#007DFE] hover:bg-[#0068D6] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read Manuscript PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Downloading complete 48-page Capstone Manuscript PDF bundle...');
                    }}
                    className="py-2.5 px-3 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unlock PDF with ₱29 Pass</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2: GitHub Repository Access */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0e0e11] p-6 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-[#007DFE]/20 flex items-center justify-center text-[#007DFE]">
                  <GitBranch className="w-6 h-6" />
                </div>
                {isUnlocked ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
                    <Lock className="w-3 h-3 text-amber-400" />
                    Requires Pass
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Full Production GitHub Repository
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Direct access to the private repository containing all 18,400+ lines of code: WebSocket telemetry server, Next.js interface, Docker configuration, and tests.
                </p>
              </div>

              {/* Code Specs */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-1.5 text-xs text-neutral-300">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Repository Structure:</span>
                  <span className="font-mono text-neutral-200">/api, /web, /infra, /tests</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Codebase Size:</span>
                  <span className="text-neutral-200">18,400+ lines of TypeScript & Go</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">License:</span>
                  <span className="text-neutral-200">Full Educational & Commercial Use</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6">
              {isUnlocked ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                    <span className="text-neutral-500 select-none">$</span>
                    <span className="truncate flex-1 select-all">{cloneCommand}</span>
                    <button
                      onClick={handleCopyClone}
                      className="p-1 text-neutral-400 hover:text-white transition-colors"
                      title="Copy clone command"
                    >
                      {copiedClone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadZip}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Code ZIP</span>
                    </button>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-lg text-xs font-medium text-[#007DFE] bg-[#007DFE]/15 hover:bg-[#007DFE]/25 border border-[#007DFE]/30 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Open GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unlock Codebase with ₱29 Pass</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive PDF Manuscript Viewer Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0e0e11] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Capstone Manuscript & Defense Blueprint (Preview)
                  </h3>
                  <div className="text-xs text-neutral-400">
                    Document Ref: TUP-CIE-CS-2024-08 · 48 Pages · Final Approved Version
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#121216] font-sans text-sm leading-relaxed">
              <div className="border-b border-neutral-800 pb-6 text-center">
                <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
                  Department of Computer Studies · College of Industrial Technology
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                  High-Throughput Distributed Telemetry & Fault-Tolerant Event Mesh
                </h1>
                <p className="text-xs text-neutral-400">
                  By Ghost · Thesis Adviser: Dr. R. Fernandez · Panel Rating: 98.4% (Highest Distinction)
                </p>
              </div>

              {/* Section 1: Abstract */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#007DFE]">
                  1. Executive Abstract
                </h4>
                <p className="text-xs text-neutral-300">
                  Modern distributed IoT systems suffer from catastrophic event loss during network partitions. This capstone engineering study implemented an in-memory buffer layer leveraging Redis Streams and a resilient Node.js worker pool, delivering 99.98% delivery rate under simulated 150ms packet jitter and 10,000 req/sec load spikes.
                </p>
              </div>

              {/* Section 2: Architecture Diagram Schematic */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#007DFE]">
                  2. System Architecture Blueprint
                </h4>
                <div className="p-4 rounded-xl bg-black border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto space-y-2">
                  <div className="text-emerald-400">[Client Tier: Web & Mobile Apps]</div>
                  <div className="text-neutral-500">      ↓ (TLS 1.3 / WebSocket Secure)</div>
                  <div className="text-blue-400">[Layer 7 Reverse Proxy & Nginx Rate Limiter (Token Bucket)]</div>
                  <div className="text-neutral-500">      ↓ (Internal gRPC Transport)</div>
                  <div className="text-purple-400">[Microservice Cluster: Ingestion Service | Auth Service | Query Worker]</div>
                  <div className="text-neutral-500">      ↓ (Pub/Sub Event Bus)</div>
                  <div className="text-amber-400">[Redis Cluster Streams (Cache & Replay Log)]  →  [PostgreSQL TimescaleDB (Persistent Tier)]</div>
                </div>
              </div>

              {/* Section 3: Defense Oral Strategy Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#007DFE]">
                  3. Panel Defense Anticipated Q&A Matrix
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="font-semibold text-white mb-1">
                      Panel Question 1: "Why not use Firebase or Supabase instead of custom infrastructure?"
                    </div>
                    <div className="text-neutral-400">
                      Response: "Managed serverless backends incur exponential bandwidth egress pricing at 10k messages/sec and lack deterministic FIFO ordering under network drops. Our self-hosted Redis Stream lowered projected cloud hosting by 78% while guaranteeing strict sequence numbering."
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="font-semibold text-white mb-1">
                      Panel Question 2: "How did you validate against SQL injection and session spoofing?"
                    </div>
                    <div className="text-neutral-400">
                      Response: "All database queries use parameterized ORM bindings with strict Zod runtime schema validations at the API gateway layer. JWTs are stored in HttpOnly SameSite=Strict cookies with 15-minute refresh rotation."
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                You have full access to this document via your lifetime pass.
              </span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-2 px-4 rounded-lg text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
