import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Settings,
  Tv,
  ListOrdered,
  Eye,
} from 'lucide-react';
import { COURSE_CONFIG, CHAPTERS, Chapter } from '../data/courseData';

interface VideoPlayerProps {
  isUnlocked: boolean;
  onOpenCheckout: () => void;
  externalSeekTime?: number | null;
  onClearExternalSeek?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  isUnlocked,
  onOpenCheckout,
  externalSeekTime,
  onClearExternalSeek,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showChapterMenu, setShowChapterMenu] = useState<boolean>(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverSeekPos, setHoverSeekPos] = useState<number>(0);

  // Locked player mode: 'trailer' (plays 60s teaser) or 'paywall' (blurred lock card)
  const [lockedMode, setLockedMode] = useState<'trailer' | 'paywall'>('trailer');
  const [trailerFinished, setTrailerFinished] = useState<boolean>(false);

  // Identify active chapter based on currentTime
  const currentChapter: Chapter | undefined = CHAPTERS.slice().reverse().find(
    (c) => currentTime >= c.startSeconds
  ) || CHAPTERS[0];

  // Sync external seek requests (e.g. from clicking a chapter in curriculum)
  useEffect(() => {
    if (externalSeekTime !== undefined && externalSeekTime !== null && videoRef.current) {
      videoRef.current.currentTime = externalSeekTime;
      setCurrentTime(externalSeekTime);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      if (onClearExternalSeek) {
        onClearExternalSeek();
      }
    }
  }, [externalSeekTime, onClearExternalSeek]);

  // Handle HTML5 fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (num: number) => num.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.log('Autoplay prevented:', err));
      setIsPlaying(true);
    }
  };

  // Skip relative seconds
  const skip = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek to specific timestamp
  const seekTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setShowChapterMenu(false);
  };

  // Timeline seek handler
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = percent * duration;

    // Enforce 60s teaser cap if locked in trailer mode
    if (!isUnlocked && targetSeconds > COURSE_CONFIG.TRAILER_DURATION_LIMIT) {
      onOpenCheckout();
      return;
    }

    videoRef.current.currentTime = targetSeconds;
    setCurrentTime(targetSeconds);
  };

  // Timeline mousemove for preview tooltip
  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, pos / rect.width));
    setHoverSeekTime(percent * duration);
    setHoverSeekPos(pos);
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Playback rate
  const changeSpeed = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
    }
  };

  // Auto-hide controls while video is playing
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowChapterMenu(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Time update listener
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // If locked and trailer reaches limit (60s), pause and trigger lock prompt
    if (!isUnlocked && lockedMode === 'trailer' && cur >= COURSE_CONFIG.TRAILER_DURATION_LIMIT) {
      videoRef.current.pause();
      setIsPlaying(false);
      setTrailerFinished(true);
    }
  };

  // Active video source determination
  const videoSource = isUnlocked
    ? COURSE_CONFIG.FULL_VIDEO_URL
    : COURSE_CONFIG.TRAILER_VIDEO_URL;

  const effectiveDuration = isUnlocked
    ? duration
    : duration > 0
    ? Math.min(duration, COURSE_CONFIG.TRAILER_DURATION_LIMIT)
    : COURSE_CONFIG.TRAILER_DURATION_LIMIT;
  const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Locked / Unlocked Status Banner & Sub-mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-2 text-xs font-medium">
          {isUnlocked ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Lifetime Access Active · Full 4K Documentary (4.2 min)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="flex items-center gap-1 text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Paywall Active</span>
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>₱29 to unlock all 5 chapters & source code</span>
            </div>
          )}
        </div>

        {/* If locked: Preview Selector tabs */}
        {!isUnlocked && (
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => {
                setLockedMode('trailer');
                setTrailerFinished(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                lockedMode === 'trailer'
                  ? 'bg-neutral-800 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>60s Teaser Trailer</span>
            </button>
            <button
              onClick={() => setLockedMode('paywall')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                lockedMode === 'paywall'
                  ? 'bg-neutral-800 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Full Video (Locked)</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Video Frame Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (isPlaying) setShowControls(false);
        }}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group select-none"
      >
        {/* The HTML5 Video Element */}
        <video
          ref={videoRef}
          src={videoSource}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            if (!isUnlocked) setTrailerFinished(true);
          }}
          onClick={togglePlay}
          className={`w-full h-full object-cover transition-all duration-500 ${
            !isUnlocked && lockedMode === 'paywall' ? 'blur-md opacity-35 scale-105' : ''
          }`}
        />

        {/* -------------------------------------------------------------
            LOCKED OVERLAY: PAYWALL MODE (Blurred with GCash Callout)
           ------------------------------------------------------------- */}
        {!isUnlocked && lockedMode === 'paywall' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-xs text-center">
            <div className="w-14 h-14 rounded-full bg-neutral-900/90 border border-neutral-700 flex items-center justify-center mb-4 text-amber-400 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight max-w-lg">
              Premium Access Required
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mb-6 leading-relaxed">
              Pay via GCash, Maya, or Card to immediately unlock the full 4.2-minute 4K documentary, thesis defense defense Q&A footage, and complete source code repository.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#007DFE] hover:bg-[#0068D6] active:bg-[#0056B3] shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Full Video for ₱29</span>
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 text-xs text-neutral-400">
              <span>Instant GCash Activation</span>
              <span aria-hidden="true">·</span>
              <span>Lifetime Unlimited Access</span>
              <span aria-hidden="true">·</span>
              <span>No Subscription</span>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            LOCKED OVERLAY: TRAILER FINISHED CARD
           ------------------------------------------------------------- */}
        {!isUnlocked && lockedMode === 'trailer' && trailerFinished && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-sm text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mb-3 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
              You’ve Finished the 60-Second Teaser
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mb-5 leading-relaxed">
              Continue into the core system breakdown: 5 chapters covering architecture whiteboarding, concurrency fixes, oral defense grillings, and repository blueprints.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenCheckout}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#007DFE] hover:bg-[#0068D6] transition-colors flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Full Film · ₱29</span>
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(() => {});
                    setIsPlaying(true);
                    setTrailerFinished(false);
                  }
                }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 transition-colors"
              >
                Replay Teaser
              </button>
            </div>
          </div>
        )}

        {/* Centered Big Play Button when paused and controls visible */}
        {(!isPlaying || !showControls) && (isUnlocked || (lockedMode === 'trailer' && !trailerFinished)) && (
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-neutral-950/70 border border-neutral-600/50 backdrop-blur-xs flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-white fill-white" />
            ) : (
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            )}
          </button>
        )}

        {/* -------------------------------------------------------------
            BOTTOM PLAYER CONTROLS (Floating cinematic bar)
           ------------------------------------------------------------- */}
        <div
          className={`absolute bottom-0 inset-x-0 z-20 px-4 pb-4 pt-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Timeline Seek Bar */}
          <div
            onClick={handleTimelineClick}
            onMouseMove={handleTimelineMouseMove}
            onMouseLeave={() => setHoverSeekTime(null)}
            className="relative w-full h-3 flex items-center cursor-pointer group/timeline py-2"
          >
            {/* Background Track */}
            <div className="w-full h-1 group-hover/timeline:h-2 bg-neutral-800 rounded-full overflow-hidden transition-all relative">
              {/* Played Progress */}
              <div
                style={{ width: `${progressPercent}%` }}
                className={`h-full ${
                  isUnlocked ? 'bg-[#007DFE]' : 'bg-amber-500'
                } rounded-full relative`}
              />
            </div>

            {/* Chapter Notches on Timeline (Unlocked Mode) */}
            {isUnlocked && duration > 0 && (
              <div className="absolute inset-0 pointer-events-none flex items-center">
                {CHAPTERS.map((chap) => {
                  const notchPercent = (chap.startSeconds / duration) * 100;
                  return (
                    <div
                      key={chap.id}
                      style={{ left: `${notchPercent}%` }}
                      className="absolute w-0.5 h-2 bg-white/40 -translate-x-1/2"
                      title={chap.title}
                    />
                  );
                })}
              </div>
            )}

            {/* Scrubber thumb */}
            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute w-3.5 h-3.5 bg-white rounded-full -translate-x-1/2 opacity-0 group-hover/timeline:opacity-100 shadow-md transition-opacity pointer-events-none"
            />

            {/* Hover Tooltip Timestamp */}
            {hoverSeekTime !== null && (
              <div
                style={{ left: `${hoverSeekPos}px` }}
                className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-mono text-white shadow-lg pointer-events-none"
              >
                {formatTime(hoverSeekTime)}
              </div>
            )}
          </div>

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between gap-4 mt-1 text-neutral-300">
            {/* Left Controls: Play, Skip, Volume, Time, Chapter Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="hover:text-white p-1 rounded-md transition-colors"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => skip(-10)}
                className="hover:text-white p-1 rounded-md transition-colors hidden sm:block"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skip(10)}
                className="hover:text-white p-1 rounded-md transition-colors hidden sm:block"
                title="Forward 10 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 group/volume">
                <button
                  onClick={toggleMute}
                  className="hover:text-white p-1 rounded-md transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume slider"
                  className="w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer hidden md:block"
                />
              </div>

              {/* Time display */}
              <div className="text-xs font-mono text-neutral-300 select-none">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-500 mx-1">/</span>
                <span className="text-neutral-400">
                  {formatTime(effectiveDuration)}
                </span>
                {!isUnlocked && (
                  <span className="ml-2 text-[10px] text-amber-400 uppercase tracking-wider font-sans font-semibold">
                    (Teaser)
                  </span>
                )}
              </div>
            </div>

            {/* Right Controls: Active Chapter Selector, Speed, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Unlocked Chapter Selector Menu */}
              {isUnlocked && (
                <div className="relative">
                  <button
                    onClick={() => setShowChapterMenu(!showChapterMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-200 transition-colors"
                    title="Select Chapter"
                  >
                    <ListOrdered className="w-3.5 h-3.5 text-[#007DFE]" />
                    <span className="hidden lg:inline truncate max-w-[130px]">
                      {currentChapter ? `Ch. ${currentChapter.number}` : 'Chapters'}
                    </span>
                  </button>

                  {/* Chapter Dropdown Popup */}
                  {showChapterMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-64 p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 shadow-2xl z-30 flex flex-col gap-1 max-h-60 overflow-y-auto">
                      <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                        Jump to Chapter
                      </div>
                      {CHAPTERS.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => seekTo(ch.startSeconds)}
                          className={`flex items-start gap-2 p-2 rounded text-left text-xs transition-colors ${
                            currentChapter?.id === ch.id
                              ? 'bg-[#007DFE]/20 text-[#007DFE] font-medium'
                              : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          <span className="font-mono text-[10px] text-neutral-500 mt-0.5">
                            {ch.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{ch.title}</div>
                            <div className="text-[10px] text-neutral-400">{ch.timeFormatted}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Playback Rate Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2 py-1 rounded text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors"
                  title="Playback Speed"
                >
                  {playbackRate}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-24 p-1 rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl z-30 flex flex-col gap-0.5">
                    {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changeSpeed(rate)}
                        className={`px-3 py-1 text-xs rounded text-left transition-colors ${
                          playbackRate === rate
                            ? 'bg-[#007DFE] text-white font-semibold'
                            : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="hover:text-white p-1 rounded-md transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Stream Info Bar & Creator Stream URL note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-neutral-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-neutral-200 font-medium">Currently Playing:</span>
          <span>{isUnlocked ? (currentChapter ? `Chapter ${currentChapter.number}: ${currentChapter.title}` : 'Full Documentary') : '60-Second Teaser Preview'}</span>
          <span aria-hidden="true">·</span>
          <span>4K UHD 60fps</span>
        </div>
        <div className="text-[11px] text-neutral-400">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800 font-mono text-neutral-300">Space</kbd> to play/pause, <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800 font-mono text-neutral-300">F</kbd> for fullscreen
        </div>
      </div>
    </div>
  );
};
