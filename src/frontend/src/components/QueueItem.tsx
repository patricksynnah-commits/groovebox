import type { QueueItem as QueueItemType } from "@/types";
import { Music2, X } from "lucide-react";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface QueueItemProps {
  item: QueueItemType;
  position: number;
  isNowPlaying: boolean;
  onPlay: () => void;
  onRemove?: () => void;
  dataOcid?: string;
}

export function QueueItem({
  item,
  position,
  isNowPlaying,
  onPlay,
  onRemove,
  dataOcid,
}: QueueItemProps) {
  const { track } = item;

  return (
    <div
      data-ocid={dataOcid}
      className={[
        "flex items-center gap-3 px-4 rounded-lg transition-smooth",
        "min-h-[56px] touch-manipulation",
        isNowPlaying
          ? "bg-primary/10 border border-primary/30"
          : "hover:bg-secondary/60 active:bg-secondary",
      ].join(" ")}
    >
      {/* Position / now-playing indicator */}
      <button
        type="button"
        onClick={onPlay}
        aria-label={
          isNowPlaying ? `Now playing: ${track.title}` : `Play ${track.title}`
        }
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
      >
        {isNowPlaying ? (
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
          </span>
        ) : (
          <span className="text-sm font-mono text-muted-foreground w-4 text-center select-none">
            {position}
          </span>
        )}
      </button>

      {/* Track icon */}
      <div
        className={[
          "flex-shrink-0 w-10 h-10 rounded flex items-center justify-center",
          isNowPlaying ? "bg-primary/20" : "bg-muted",
        ].join(" ")}
      >
        <Music2
          size={18}
          className={isNowPlaying ? "text-primary" : "text-muted-foreground"}
        />
      </div>

      {/* Track info — tappable area for playback */}
      <button
        type="button"
        onClick={onPlay}
        className="flex-1 min-w-0 text-left py-2"
        aria-label={`Play ${track.title} by ${track.artist}`}
      >
        <p
          className={[
            "text-sm font-medium truncate",
            isNowPlaying ? "text-primary" : "text-foreground",
          ].join(" ")}
        >
          {track.title}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {track.artist}
        </p>
      </button>

      {/* Duration */}
      <span className="flex-shrink-0 text-xs text-muted-foreground tabular-nums">
        {formatDuration(track.duration)}
      </span>

      {/* Now playing label */}
      {isNowPlaying && (
        <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full border border-primary/40 hidden sm:block">
          Playing
        </span>
      )}

      {/* Remove button — only for non-now-playing tracks */}
      {!isNowPlaying && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${track.title} from queue`}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
