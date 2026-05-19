import { usePlayerStore } from "@/store/playerStore";
import type { RepeatMode } from "@/types";
import {
  Music,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

// Deterministic color from string hash
function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `oklch(0.45 0.14 ${hue})`;
}

function formatTime(secs: number): string {
  if (!Number.isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const REPEAT_ICONS: Record<RepeatMode, React.ReactNode> = {
  none: <Repeat className="w-4 h-4" />,
  all: <Repeat className="w-4 h-4 text-primary" />,
  one: <Repeat1 className="w-4 h-4 text-primary" />,
};

export function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const playback = usePlayerStore((s) => s.playback);
  const shuffleMode = usePlayerStore((s) => s.shuffleMode);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const volume = usePlayerStore((s) => s.volume);

  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const setMuted = usePlayerStore((s) => s.setMuted);
  const setBuffering = usePlayerStore((s) => s.setBuffering);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrev = usePlayerStore((s) => s.playPrev);

  const currentTrack = queue[currentQueueIndex]?.track ?? null;
  const { isPlaying, currentTime, duration, isMuted } = playback;

  // Sync src when track changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentTrack) return;
    if (el.src !== currentTrack.blobUrl) {
      el.src = currentTrack.blobUrl;
      el.load();
    }
  }, [currentTrack]);

  // Sync play/pause
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [isPlaying, setPlaying]);

  // Sync volume & mute
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = isMuted;
  }, [volume, isMuted]);

  // Seek when store's currentTime is reset to 0 on track switch
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    // Only seek if the delta is large (store-initiated seek, not tick)
    if (Math.abs(el.currentTime - currentTime) > 1.5) {
      el.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      const el = audioRef.current;
      if (el) el.currentTime = val;
      setCurrentTime(val);
    },
    [setCurrentTime],
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setVolume(val);
      if (val > 0) setMuted(false);
    },
    [setVolume, setMuted],
  );

  if (!currentTrack) return null;

  const artColor = hashColor(currentTrack.title + currentTrack.artist);
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Hidden audio element */}
      {/* biome-ignore lint/a11y/useMediaCaption: offline audio player */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          const el = audioRef.current;
          if (el) setCurrentTime(el.currentTime);
        }}
        onLoadedMetadata={() => {
          const el = audioRef.current;
          if (el) setDuration(el.duration);
        }}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onEnded={() => {
          if (repeatMode === "one") {
            const el = audioRef.current;
            if (el) {
              el.currentTime = 0;
              el.play().catch(() => {});
            }
          } else {
            playNext();
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        preload="metadata"
      />

      {/* Player bar */}
      <div
        data-ocid="player.bar"
        className="relative bg-card border-t border-border z-40"
      >
        {/* Progress bar — thin line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-muted">
          <div
            className="h-full bg-primary transition-none"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Mobile layout: single compact row */}
        <div className="flex md:hidden items-center gap-3 px-3 py-2">
          {/* Album art */}
          <div
            className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center"
            style={{ background: artColor }}
          >
            <Music className="w-5 h-5 text-primary-foreground opacity-80" />
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p
              data-ocid="player.track_title"
              className="text-sm font-semibold truncate text-foreground leading-tight"
            >
              {currentTrack.title}
            </p>
            <p className="text-xs text-muted-foreground truncate leading-tight">
              {currentTrack.artist}
            </p>
          </div>

          {/* Shuffle */}
          <button
            type="button"
            data-ocid="player.shuffle_button"
            onClick={toggleShuffle}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${shuffleMode ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="Toggle shuffle"
            aria-pressed={shuffleMode}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Prev */}
          <button
            type="button"
            data-ocid="player.prev_button"
            onClick={playPrev}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous track"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play/Pause */}
          <button
            type="button"
            data-ocid="player.play_pause_button"
            onClick={() => setPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 hover:scale-105 transition-smooth active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause
                className="w-5 h-5 text-primary-foreground"
                fill="currentColor"
              />
            ) : (
              <Play
                className="w-5 h-5 text-primary-foreground"
                fill="currentColor"
              />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            data-ocid="player.next_button"
            onClick={playNext}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next track"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            data-ocid="player.repeat_button"
            onClick={toggleRepeat}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Repeat: ${repeatMode}`}
          >
            {REPEAT_ICONS[repeatMode]}
          </button>
        </div>

        {/* Desktop layout: full controls */}
        <div className="hidden md:block px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Album art */}
            <div
              className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: artColor }}
            >
              <Music className="w-6 h-6 text-primary-foreground opacity-80" />
            </div>

            {/* Track info */}
            <div className="w-44 min-w-0 flex-shrink-0">
              <p className="text-sm font-semibold truncate text-foreground">
                {currentTrack.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Center controls */}
            <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div className="flex items-center gap-4">
                {/* Shuffle */}
                <button
                  type="button"
                  data-ocid="player.shuffle_button"
                  onClick={toggleShuffle}
                  className={`p-1.5 transition-colors ${
                    shuffleMode
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Toggle shuffle"
                  aria-pressed={shuffleMode}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Prev */}
                <button
                  type="button"
                  data-ocid="player.prev_button"
                  onClick={playPrev}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* Play/Pause */}
                <button
                  type="button"
                  data-ocid="player.play_pause_button"
                  onClick={() => setPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-smooth active:scale-95"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause
                      className="w-5 h-5 text-primary-foreground"
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      className="w-5 h-5 text-primary-foreground"
                      fill="currentColor"
                    />
                  )}
                </button>

                {/* Next */}
                <button
                  type="button"
                  data-ocid="player.next_button"
                  onClick={playNext}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Repeat */}
                <button
                  type="button"
                  data-ocid="player.repeat_button"
                  onClick={toggleRepeat}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Repeat: ${repeatMode}`}
                >
                  {REPEAT_ICONS[repeatMode]}
                </button>
              </div>

              {/* Seek bar */}
              <div className="flex items-center gap-2 w-full max-w-lg">
                <span className="text-[11px] text-muted-foreground w-8 text-right tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <div className="relative flex-1 group">
                  <input
                    type="range"
                    data-ocid="player.seek_bar"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 appearance-none bg-muted rounded-full cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-foreground
                      [&::-webkit-slider-thumb]:opacity-0
                      [&::-webkit-slider-thumb]:group-hover:opacity-100
                      [&::-webkit-slider-thumb]:transition-opacity
                      [&::-moz-range-thumb]:w-3
                      [&::-moz-range-thumb]:h-3
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-foreground
                      [&::-moz-range-thumb]:border-0"
                    style={{
                      backgroundImage: `linear-gradient(to right, oklch(var(--primary)) ${progressPct}%, oklch(var(--muted)) ${progressPct}%)`,
                    }}
                    aria-label="Seek"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground w-8 tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-32 flex-shrink-0">
              <button
                type="button"
                data-ocid="player.mute_button"
                onClick={() => setMuted(!isMuted)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                data-ocid="player.volume_slider"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 appearance-none bg-muted rounded-full cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-foreground
                  [&::-moz-range-thumb]:w-3
                  [&::-moz-range-thumb]:h-3
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-foreground
                  [&::-moz-range-thumb]:border-0"
                style={{
                  backgroundImage: `linear-gradient(to right, oklch(var(--primary)) ${
                    (isMuted ? 0 : volume) * 100
                  }%, oklch(var(--muted)) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
                aria-label="Volume"
              />
            </div>
          </div>
        </div>

        {/* Mobile seek bar — below the compact row */}
        <div className="md:hidden px-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-7 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              data-ocid="player.seek_bar"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 appearance-none bg-muted rounded-full cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-foreground
                [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-foreground
                [&::-moz-range-thumb]:border-0"
              style={{
                backgroundImage: `linear-gradient(to right, oklch(var(--primary)) ${progressPct}%, oklch(var(--muted)) ${progressPct}%)`,
              }}
              aria-label="Seek"
            />
            <span className="text-[10px] text-muted-foreground w-7 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
