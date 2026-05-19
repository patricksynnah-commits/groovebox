// Stub — implemented in a subsequent page task
import { ListMusic, Music } from "lucide-react";
import { TrackRow } from "../components/TrackRow";
import { UploadButton } from "../components/UploadButton";
import { usePlayerStore } from "../store/playerStore";
import type { Track } from "../types";

function NowPlayingBanner() {
  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const isPlaying = usePlayerStore((s) => s.playback.isPlaying);
  const currentTrack = queue[currentQueueIndex]?.track ?? null;

  if (!currentTrack) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl mx-4 mt-4"
      data-ocid="library.now_playing_banner"
    >
      <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
        <Music className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">
          {isPlaying ? "Now Playing" : "Paused"}
        </p>
        <p className="text-sm font-bold text-foreground truncate">
          {currentTrack.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {currentTrack.artist}
        </p>
      </div>
      <div className="flex-shrink-0 flex gap-1 items-end h-5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`block w-0.5 rounded-full bg-primary transition-all ${
              isPlaying ? "animate-bounce" : "opacity-40"
            }`}
            style={{
              height: isPlaying ? `${12 + i * 4}px` : "8px",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function LibraryPage() {
  const tracks = usePlayerStore((s) => s.tracks);
  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const playTrackAt = usePlayerStore((s) => s.playTrackAt);
  const removeTrack = usePlayerStore((s) => s.removeTrack);

  const currentTrackId = queue[currentQueueIndex]?.track?.id ?? null;

  function handlePlay(track: Track) {
    setQueue(tracks);
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx >= 0) playTrackAt(idx);
  }

  function handleDelete(id: number) {
    removeTrack(id);
  }

  return (
    <div className="flex flex-col min-h-full pb-4" data-ocid="library.page">
      <NowPlayingBanner />

      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground tracking-tight">
            Your Library
          </h2>
          {tracks.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {tracks.length}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-3">
        <UploadButton />
      </div>

      {tracks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center flex-1 px-8 py-16 gap-4 text-center"
          data-ocid="library.empty_state"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2">
            <Music className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No tracks yet</h3>
          <p className="text-sm text-muted-foreground max-w-[260px]">
            Upload your music files to start listening. Supports MP3, WAV, OGG,
            and M4A.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 px-4" data-ocid="library.list">
          {tracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i + 1}
              isActive={track.id === currentTrackId}
              onPlay={handlePlay}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
