'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Radio,
  Users,
  Sparkles,
  Settings,
  HelpCircle,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { LiveClassSession, LiveDoubt } from '@/types/live-class';

interface LiveClassroomPlayerProps {
  session: LiveClassSession;
  activeDoubtBeingAnswered?: LiveDoubt | null;
  attendanceVerified: boolean;
  onVerifyAttendance: () => void;
  onSendReaction: (emoji: string) => void;
}

export function LiveClassroomPlayer({
  session,
  activeDoubtBeingAnswered,
  attendanceVerified,
  onVerifyAttendance,
  onSendReaction,
}: LiveClassroomPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [quality, setQuality] = useState('1080p60 (Source)');
  const [showControls, setShowControls] = useState(true);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; emoji: string; x: number }[]>([]);

  // Auto-play on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsMuted(true);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const triggerReaction = (emoji: string) => {
    onSendReaction(emoji);
    const newId = `reaction-${Date.now()}-${Math.random()}`;
    const xPos = 20 + Math.random() * 60; // 20% to 80%
    setFloatingEmojis((prev) => [...prev, { id: newId, emoji, x: xPos }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newId));
    }, 2400);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-black shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* ── Top Floating Broadcast Bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Pulsing Live Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-rose-600/40">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span>LIVE STREAM</span>
          </div>

          {/* Active Viewers Counter */}
          <div className="hidden min-[480px]:flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/10">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span>{session.active_viewers} Fellows Watching</span>
          </div>

          {/* Batch Code */}
          <span className="hidden sm:inline-block rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-mono font-medium text-white/80">
            {session.batch_code}
          </span>
        </div>

        {/* Right actions: Attendance Verification & Quality */}
        <div className="flex items-center gap-2">
          {/* Attendance Check-in */}
          {attendanceVerified ? (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Attendance Logged</span>
              <span className="sm:hidden">Logged</span>
            </div>
          ) : (
            <button
              onClick={onVerifyAttendance}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-tejas-blue to-cyan-500 px-3 py-1 text-xs font-bold text-white shadow-md hover:scale-105 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Log Attendance</span>
            </button>
          )}

          {/* Quality Pill */}
          <div className="hidden sm:flex items-center gap-1 rounded-md bg-black/60 border border-white/10 px-2 py-1 text-[10px] font-mono text-white/80">
            <Settings className="h-3 w-3 text-cyan-400" />
            <span>{quality}</span>
          </div>
        </div>
      </div>

      {/* ── Active Live Doubt Notification Banner (Scaler Signature) ── */}
      {activeDoubtBeingAnswered && (
        <div className="absolute top-14 left-4 right-4 z-30 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/90 via-black/90 to-amber-950/90 p-3 shadow-xl backdrop-blur-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-black font-black shrink-0 mt-0.5">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  FACULTY ANSWERING LIVE ON STREAM
                </span>
                <span className="text-xs text-white/60">· Asked by {activeDoubtBeingAnswered.student_name}</span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-white line-clamp-2">
                &ldquo;{activeDoubtBeingAnswered.doubt_text}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Reaction Particles ── */}
      <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-16 text-3xl select-none animate-float-fade"
            style={{ left: `${item.x}%` }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* ── Primary Video Element ── */}
      <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center">
        <video
          ref={videoRef}
          src={session.stream_video_url}
          className="h-full w-full object-cover"
          playsInline
          loop
          muted={isMuted}
          onClick={togglePlay}
        />

        {/* Center Play Button Overlay if paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white shadow-2xl backdrop-blur-md hover:scale-110 transition"
          >
            <Play className="h-8 w-8 ml-1" />
          </button>
        )}
      </div>

      {/* ── Bottom Controls Bar ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Play/Pause, Volume, Live Scrub */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="flex h-8 w-8 items-center justify-center text-white/80 hover:text-white transition"
                aria-label="Toggle mute"
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-1.5 w-16 sm:w-20 accent-tejas-blue cursor-pointer bg-white/20 rounded-lg"
              />
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 pl-2 text-xs font-mono font-bold text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Right: Floating Emoji Quick Taps, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Quick Reactions Bar */}
            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-full px-2 py-0.5">
              {['🔥', '💡', '🚀', '👏'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerReaction(emoji)}
                  className="px-1.5 py-0.5 text-base sm:text-lg hover:scale-125 active:scale-95 transition"
                  title={`Send ${emoji} to class`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
