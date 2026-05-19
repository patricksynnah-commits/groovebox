import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PlaylistInfo } from "@/hooks/useBackend";
import { MoreVertical, Music2, Pencil, Trash2 } from "lucide-react";

interface PlaylistCardProps {
  playlist: PlaylistInfo;
  onOpen: (id: bigint) => void;
  onRename: (id: bigint, currentName: string) => void;
  onDelete: (id: bigint, name: string) => void;
  index: number;
}

export function PlaylistCard({
  playlist,
  onOpen,
  onRename,
  onDelete,
  index,
}: PlaylistCardProps) {
  const trackCount = playlist.trackIds.length;

  return (
    <button
      type="button"
      className="group relative w-full flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 cursor-pointer active:scale-[0.98] transition-smooth hover:bg-secondary text-left"
      onClick={() => onOpen(playlist.id)}
      data-ocid={`playlists.item.${index}`}
      aria-label={`Open playlist ${playlist.name}`}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Music2 className="w-5 h-5 text-primary" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate text-sm leading-tight">
          {playlist.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {trackCount === 0
            ? "No tracks"
            : trackCount === 1
              ? "1 track"
              : `${trackCount} tracks`}
        </p>
      </div>

      {/* Context menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
            data-ocid={`playlists.open_modal_button.${index}`}
            aria-label="Playlist options"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-popover border-border text-popover-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onSelect={() => onRename(playlist.id, playlist.name)}
            data-ocid={`playlists.edit_button.${index}`}
          >
            <Pencil className="w-4 h-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            onSelect={() => onDelete(playlist.id, playlist.name)}
            data-ocid={`playlists.delete_button.${index}`}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  );
}
