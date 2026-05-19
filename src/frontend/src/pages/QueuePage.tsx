import { QueueItem } from "@/components/QueueItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/store/playerStore";
import type { RepeatMode } from "@/types";
import { ListMusic, ListX, Repeat, Repeat1, Shuffle } from "lucide-react";
// Stub — implemented in a subsequent page task
import { useCallback } from "react";

function RepeatIcon({ mode }: { mode: RepeatMode }) {
  if (mode === "one") return <Repeat1 size={14} className="text-primary" />;
  if (mode === "all") return <Repeat size={14} className="text-primary" />;
  return <Repeat size={14} className="text-muted-foreground" />;
}

export function QueuePage() {
  const queue = usePlayerStore((s) => s.queue);
  const currentQueueIndex = usePlayerStore((s) => s.currentQueueIndex);
  const shuffleMode = usePlayerStore((s) => s.shuffleMode);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const playTrackAt = usePlayerStore((s) => s.playTrackAt);

  const handlePlay = useCallback(
    (queueIndex: number) => {
      playTrackAt(queueIndex);
    },
    [playTrackAt],
  );

  const handleRemove = useCallback(
    (queueIndex: number) => {
      removeFromQueue(queueIndex);
    },
    [removeFromQueue],
  );

  const isEmpty = queue.length === 0;

  const nowPlayingItem =
    currentQueueIndex >= 0 ? queue[currentQueueIndex] : null;
  const upcomingItems = queue.filter((_, i) => i !== currentQueueIndex);

  return (
    <div data-ocid="queue.page" className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-card border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEmpty
              ? "No tracks queued"
              : `${queue.length} track${queue.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            data-ocid="queue.shuffle_indicator"
            className={[
              "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border",
              shuffleMode
                ? "border-primary/40 text-primary bg-primary/10"
                : "border-border text-muted-foreground bg-transparent",
            ].join(" ")}
            aria-label={`Shuffle is ${shuffleMode ? "on" : "off"}`}
          >
            <Shuffle size={11} />
            <span>Shuffle</span>
          </div>

          <div
            data-ocid="queue.repeat_indicator"
            className={[
              "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border",
              repeatMode !== "none"
                ? "border-primary/40 text-primary bg-primary/10"
                : "border-border text-muted-foreground bg-transparent",
            ].join(" ")}
            aria-label={`Repeat mode: ${repeatMode}`}
          >
            <RepeatIcon mode={repeatMode} />
            <span className="capitalize">
              {repeatMode === "none"
                ? "Off"
                : repeatMode === "one"
                  ? "One"
                  : "All"}
            </span>
          </div>

          {!isEmpty && (
            <Button
              data-ocid="queue.clear_button"
              variant="ghost"
              size="icon"
              onClick={clearQueue}
              aria-label="Clear queue"
              className="w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <ListX size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {isEmpty ? (
        <div
          data-ocid="queue.empty_state"
          className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ListMusic size={32} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              Your queue is empty
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Play a track or add songs from your library
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="px-3 pb-6">
            {nowPlayingItem && (
              <section className="mt-4">
                <h2 className="px-1 mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  Now Playing
                </h2>
                <QueueItem
                  key={`now-${nowPlayingItem.queueIndex}`}
                  item={nowPlayingItem}
                  position={currentQueueIndex + 1}
                  isNowPlaying={true}
                  onPlay={() => handlePlay(nowPlayingItem.queueIndex)}
                  dataOcid="queue.now_playing.item"
                />
              </section>
            )}

            {upcomingItems.length > 0 && (
              <section className="mt-5">
                <h2 className="px-1 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Up Next
                </h2>
                <div data-ocid="queue.list" className="flex flex-col gap-0.5">
                  {upcomingItems.map((item, displayIdx) => (
                    <QueueItem
                      key={`upcoming-${item.queueIndex}`}
                      item={item}
                      position={item.queueIndex + 1}
                      isNowPlaying={false}
                      onPlay={() => handlePlay(item.queueIndex)}
                      onRemove={() => handleRemove(item.queueIndex)}
                      dataOcid={`queue.item.${displayIdx + 1}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {!nowPlayingItem && queue.length > 0 && (
              <section className="mt-4">
                <h2 className="px-1 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Queue
                </h2>
                <div data-ocid="queue.list" className="flex flex-col gap-0.5">
                  {queue.map((item, idx) => (
                    <QueueItem
                      key={`q-${item.queueIndex}`}
                      item={item}
                      position={item.queueIndex + 1}
                      isNowPlaying={false}
                      onPlay={() => handlePlay(item.queueIndex)}
                      onRemove={() => handleRemove(item.queueIndex)}
                      dataOcid={`queue.item.${idx + 1}`}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
