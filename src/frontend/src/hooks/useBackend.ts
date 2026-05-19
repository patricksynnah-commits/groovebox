import { createActor } from "@/backend";
import type { PlaylistInfo, TrackInfo } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Re-export backend types for convenience ───────────────────────────────
export type { TrackInfo, PlaylistInfo };

// ─── Tracks ────────────────────────────────────────────────────────────────

export function useListTracks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TrackInfo[]>({
    queryKey: ["tracks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTracks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTrack() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      artist,
      duration,
      blob,
    }: {
      title: string;
      artist: string;
      duration: bigint;
      blob: import("@/backend").ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addTrack(title, artist, duration, blob);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
}

export function useDeleteTrack() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteTrack(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
}

// ─── Playlists ─────────────────────────────────────────────────────────────

export function useListPlaylists() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PlaylistInfo[]>({
    queryKey: ["playlists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPlaylists();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePlaylist() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createPlaylist(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}

export function useRenamePlaylist() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: bigint; name: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.renamePlaylist(id, name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}

export function useDeletePlaylist() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deletePlaylist(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}

export function useAddTrackToPlaylist() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playlistId,
      trackId,
    }: { playlistId: bigint; trackId: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addTrackToPlaylist(playlistId, trackId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}

export function useRemoveTrackFromPlaylist() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playlistId,
      trackId,
    }: { playlistId: bigint; trackId: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeTrackFromPlaylist(playlistId, trackId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}

// ─── Session ───────────────────────────────────────────────────────────────

export function useGetSession() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSession();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveSession() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      lastTrackId,
      lastPosition,
    }: {
      lastTrackId: bigint | null;
      lastPosition: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveSession(lastTrackId, lastPosition);
    },
  });
}
