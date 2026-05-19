import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlaylistInfo } from "@/hooks/useBackend";
import { usePlayerStore } from "@/store/playerStore";
import type { Track } from "@/types";
import { ArrowLeft, Check, Music2, Play, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlaylistDetailProps {
  playlist: PlaylistInfo;
  allTracks: Track[];
  onBack: () => void;
  onRemoveTrack: (playlistId: bigint, trackId: bigint) => void;
  onAddTrack: (playlistId: bigint, trackId: bigint) => void;
  isRemoving: boolean;
  isAdding: boolean;
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PlaylistDetail({
  playlist,
  allTracks,
  onBack,
  onRemoveTrack,
  onAddTrack,
  isRemoving,
  isAdding,
}: PlaylistDetailProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const setQueue = usePlayerStore((s) => s.setQueue);
  const setPlaying = usePlayerStore((s) => s.setPlaying);

  const playlistTrackIds = new Set(playlist.trackIds.map((id) => Number(id)));
  const playlistTracks = allTracks.filter((t) => playlistTrackIds.has(t.id));
  const availableTracks = allTracks.filter((t) => !playlistTrackIds.has(t.id));

  function handlePlayAll() {
    if (playlistTracks.length === 0) return;
    setQueue(playlistTracks);
    setPlaying(true);
    toast.success(`Playing "${playlist.name}"`);
  }

  return (
    <div className="flex flex-col h-full" data-ocid="playlists.detail.panel">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={onBack}
          data-ocid="playlists.detail.back_button"
          aria-label="Back to playlists"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-foreground truncate text-base leading-tight">
            {playlist.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {playlistTracks.length === 0
              ? "No tracks"
              : playlistTracks.length === 1
                ? "1 track"
                : `${playlistTracks.length} tracks`}
          </p>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          onClick={handlePlayAll}
          disabled={playlistTracks.length === 0}
          data-ocid="playlists.detail.primary_button"
        >
          <Play className="w-4 h-4 fill-current" />
          Play
        </Button>
      </div>

      {/* Track list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {playlistTracks.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 py-12 text-center"
              data-ocid="playlists.detail.empty_state"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Music2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                This playlist is empty.
              </p>
              <p className="text-xs text-muted-foreground">
                Add tracks to get started.
              </p>
            </div>
          ) : (
            playlistTracks.map((track, idx) => (
              <div
                key={track.id.toString()}
                className="flex items-center gap-3 rounded-lg bg-card border border-border px-3 py-2.5 group"
                data-ocid={`playlists.detail.item.${idx + 1}`}
              >
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0">
                  <Music2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate leading-tight">
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artist} · {formatDuration(track.duration)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                  disabled={isRemoving}
                  onClick={() => onRemoveTrack(playlist.id, BigInt(track.id))}
                  data-ocid={`playlists.detail.delete_button.${idx + 1}`}
                  aria-label={`Remove ${track.title} from playlist`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Add tracks FAB */}
      <div className="px-4 py-3 border-t border-border bg-card shrink-0">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 h-11 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => setPickerOpen(true)}
          data-ocid="playlists.detail.open_modal_button"
        >
          <Plus className="w-4 h-4" />
          Add Tracks
        </Button>
      </div>

      {/* Track picker dialog */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent
          className="bg-popover border-border text-popover-foreground max-h-[80vh] flex flex-col p-0 gap-0 mx-4 rounded-2xl"
          data-ocid="playlists.detail.dialog"
        >
          <DialogHeader className="px-5 pt-5 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-bold text-foreground">
                Add to {playlist.name}
              </DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setPickerOpen(false)}
                data-ocid="playlists.detail.close_button"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="px-5 pb-5 space-y-2">
              {availableTracks.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-sm"
                  data-ocid="playlists.detail.picker_empty_state"
                >
                  All library tracks are already in this playlist.
                </div>
              ) : (
                availableTracks.map((track, idx) => (
                  <button
                    key={track.id.toString()}
                    type="button"
                    className="group w-full flex items-center gap-3 rounded-lg bg-card border border-border px-3 py-2.5 text-left hover:bg-secondary transition-smooth active:scale-[0.98]"
                    disabled={isAdding}
                    onClick={() => {
                      onAddTrack(playlist.id, BigInt(track.id));
                      setPickerOpen(false);
                    }}
                    data-ocid={`playlists.detail.picker_item.${idx + 1}`}
                  >
                    <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0">
                      <Music2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artist} · {formatDuration(track.duration)}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
