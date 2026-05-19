import { Music2, Play, Trash2 } from "lucide-react";
import type { Track } from "../types";

function formatTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface TrackRowProps {
  track: Track;
  index: number;
  isActive: boolean;
  onPlay: (track: Track) => void;
  onDelete: (id: number) => void;
}

export function TrackRow({
  track,
  index,
  isActive,
  onPlay,
  onDelete,
}: TrackRowProps) {
  return (
    <button
      type="button"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl min-h-[64px] w-full transition-smooth cursor-pointer group text-left ${
        isActive
          ? "bg-primary/10 border border-primary/30"
          : "bg-card hover:bg-secondary"
      }`}
      data-ocid={`library.item.${index}`}
      onClick={() => onPlay(track)}
      aria-label={`Play ${track.title} by ${track.artist}`}
      aria-pressed={isActive}
    >
      {/* Track number / play icon */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-muted">
        {isActive ? (
          <Music2 className="w-4 h-4 text-primary animate-pulse" />
        ) : (
          <span className="text-sm font-medium text-muted-foreground group-hover:hidden block">
            {index}
          </span>
        )}
        {!isActive && (
          <Play
            className="w-4 h-4 text-primary hidden group-hover:block fill-primary"
            aria-hidden
          />
        )}
      </div>

      {/* Title + artist */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate leading-tight ${
            isActive ? "text-primary" : "text-foreground"
          }`}
        >
          {track.title}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {track.artist}
        </p>
      </div>

      {/* Duration */}
      <span className="flex-shrink-0 text-xs text-muted-foreground font-mono tabular-nums">
        {formatTime(track.duration)}
      </span>

      {/* Play button (explicit) */}
      <button
        type="button"
        className="flex-shrink-0 w-9 h-9 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-primary hover:bg-primary/20 transition-smooth"
        data-ocid={`library.play_button.${index}`}
        onClick={(e) => {
          e.stopPropagation();
          onPlay(track);
        }}
        aria-label={`Play ${track.title}`}
      >
        <Play className="w-4 h-4 fill-primary" />
      </button>

      {/* Delete button */}
      <button
        type="button"
        className="flex-shrink-0 w-9 h-9 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
        data-ocid={`library.delete_button.${index}`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(track.id);
        }}
        aria-label={`Delete ${track.title}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </button>
  );
}
