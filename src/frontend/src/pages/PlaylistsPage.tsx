import { PlaylistCard } from "@/components/PlaylistCard";
import { PlaylistDetail } from "@/components/PlaylistDetail";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddTrackToPlaylist,
  useCreatePlaylist,
  useDeletePlaylist,
  useListPlaylists,
  useRemoveTrackFromPlaylist,
  useRenamePlaylist,
} from "@/hooks/useBackend";
import { usePlayerStore } from "@/store/playerStore";
import { ListMusic, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Modal =
  | { type: "create" }
  | { type: "rename"; id: bigint; currentName: string }
  | { type: "delete"; id: bigint; name: string }
  | null;

export function PlaylistsPage() {
  const [openId, setOpenId] = useState<bigint | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [nameInput, setNameInput] = useState("");

  const { data: playlists, isLoading: loadingPlaylists } = useListPlaylists();
  const allTracks = usePlayerStore((s) => s.tracks);

  const createPlaylist = useCreatePlaylist();
  const renamePlaylist = useRenamePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const addTrackToPlaylist = useAddTrackToPlaylist();
  const removeTrackFromPlaylist = useRemoveTrackFromPlaylist();

  const openPlaylist = playlists?.find((p) => p.id === openId) ?? null;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function openCreate() {
    setNameInput("");
    setModal({ type: "create" });
  }

  function openRename(id: bigint, currentName: string) {
    setNameInput(currentName);
    setModal({ type: "rename", id, currentName });
  }

  function openDelete(id: bigint, name: string) {
    setModal({ type: "delete", id, name });
  }

  function closeModal() {
    setModal(null);
    setNameInput("");
  }

  async function handleCreate() {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    try {
      await createPlaylist.mutateAsync(trimmed);
      toast.success(`"${trimmed}" created`);
      closeModal();
    } catch {
      toast.error("Failed to create playlist");
    }
  }

  async function handleRename() {
    if (modal?.type !== "rename") return;
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    try {
      await renamePlaylist.mutateAsync({ id: modal.id, name: trimmed });
      toast.success("Playlist renamed");
      closeModal();
    } catch {
      toast.error("Failed to rename playlist");
    }
  }

  async function handleDelete() {
    if (modal?.type !== "delete") return;
    try {
      await deletePlaylist.mutateAsync(modal.id);
      if (openId === modal.id) setOpenId(null);
      toast.success(`"${modal.name}" deleted`);
      closeModal();
    } catch {
      toast.error("Failed to delete playlist");
    }
  }

  function handleRemoveTrack(playlistId: bigint, trackId: bigint) {
    removeTrackFromPlaylist.mutate(
      { playlistId, trackId },
      {
        onSuccess: () => toast.success("Track removed"),
        onError: () => toast.error("Failed to remove track"),
      },
    );
  }

  function handleAddTrack(playlistId: bigint, trackId: bigint) {
    addTrackToPlaylist.mutate(
      { playlistId, trackId },
      {
        onSuccess: () => toast.success("Track added"),
        onError: () => toast.error("Failed to add track"),
      },
    );
  }

  // ── Detail view ──────────────────────────────────────────────────────────
  if (openPlaylist) {
    return (
      <PlaylistDetail
        playlist={openPlaylist}
        allTracks={allTracks}
        onBack={() => setOpenId(null)}
        onRemoveTrack={handleRemoveTrack}
        onAddTrack={handleAddTrack}
        isRemoving={removeTrackFromPlaylist.isPending}
        isAdding={addTrackToPlaylist.isPending}
      />
    );
  }

  // ── Grid view ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full" data-ocid="playlists.page">
      {/* Page header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0">
        <h1 className="text-base font-bold text-foreground">Playlists</h1>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={openCreate}
          data-ocid="playlists.open_modal_button"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {loadingPlaylists ? (
            <div className="space-y-3" data-ocid="playlists.loading_state">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Skeleton key={i} className="h-16 w-full rounded-xl bg-muted" />
              ))}
            </div>
          ) : !playlists || playlists.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-4 py-20 text-center"
              data-ocid="playlists.empty_state"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <ListMusic className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">
                  No playlists yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first playlist to organize your music.
                </p>
              </div>
              <Button
                type="button"
                variant="default"
                className="gap-2 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={openCreate}
                data-ocid="playlists.empty_state.primary_button"
              >
                <Plus className="w-4 h-4" />
                Create Playlist
              </Button>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="playlists.list">
              {playlists.map((playlist, i) => (
                <PlaylistCard
                  key={playlist.id.toString()}
                  playlist={playlist}
                  index={i + 1}
                  onOpen={setOpenId}
                  onRename={openRename}
                  onDelete={openDelete}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create / Rename dialog */}
      <Dialog
        open={modal?.type === "create" || modal?.type === "rename"}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent
          className="bg-popover border-border text-popover-foreground mx-4 rounded-2xl"
          data-ocid="playlists.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {modal?.type === "create" ? "New Playlist" : "Rename Playlist"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (modal?.type === "create") handleCreate();
              else handleRename();
            }}
            className="flex flex-col gap-4 pt-1"
          >
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Playlist name"
              className="bg-secondary border-input text-foreground placeholder:text-muted-foreground h-11"
              autoFocus
              maxLength={60}
              data-ocid="playlists.input"
            />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-11 border border-border"
                onClick={closeModal}
                data-ocid="playlists.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={
                  !nameInput.trim() ||
                  createPlaylist.isPending ||
                  renamePlaylist.isPending
                }
                data-ocid="playlists.confirm_button"
              >
                {modal?.type === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={modal?.type === "delete"}
        onOpenChange={(open) => !open && closeModal()}
      >
        <AlertDialogContent
          className="bg-popover border-border text-popover-foreground mx-4 rounded-2xl"
          data-ocid="playlists.delete_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete playlist?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {modal?.type === "delete" && (
                <>
                  &ldquo;{modal.name}&rdquo; will be permanently deleted. This
                  cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              className="flex-1 h-11 bg-secondary border-border text-foreground"
              onClick={closeModal}
              data-ocid="playlists.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deletePlaylist.isPending}
              data-ocid="playlists.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
