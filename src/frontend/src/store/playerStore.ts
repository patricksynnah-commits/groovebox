import { create } from "zustand";
import type {
  PlaybackState,
  Playlist,
  QueueItem,
  RepeatMode,
  Track,
} from "../types";
import { loadFromDB, saveToDB } from "./indexedDb";

// Shape persisted to IndexedDB (no functions, no audio nodes)
interface PersistedState {
  tracks: Track[];
  playlists: Playlist[];
  queue: QueueItem[];
  currentQueueIndex: number;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  volume: number;
  lastTrackId: number | null;
  lastPosition: number;
}

interface PlayerStore extends PersistedState {
  playback: PlaybackState;

  // Library actions
  addTrack: (track: Track) => void;
  removeTrack: (id: number) => void;
  setTracks: (tracks: Track[]) => void;

  // Playlist actions
  addPlaylist: (playlist: Playlist) => void;
  removePlaylist: (id: number) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  addTrackToPlaylist: (playlistId: number, trackId: number) => void;
  removeTrackFromPlaylist: (playlistId: number, trackId: number) => void;

  // Queue actions
  setQueue: (tracks: Track[]) => void;
  enqueueTrack: (track: Track) => void;
  removeFromQueue: (queueIndex: number) => void;
  clearQueue: () => void;
  playTrackAt: (queueIndex: number) => void;
  playNext: () => void;
  playPrev: () => void;

  // Playback actions
  setPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (isMuted: boolean) => void;
  setBuffering: (isBuffering: boolean) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // Session
  saveSession: () => void;

  // Hydration
  hydrate: () => Promise<void>;
}

const DEFAULT_PLAYBACK: PlaybackState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isBuffering: false,
};

const DEFAULT_STATE: PersistedState = {
  tracks: [],
  playlists: [],
  queue: [],
  currentQueueIndex: -1,
  shuffleMode: false,
  repeatMode: "none",
  volume: 1,
  lastTrackId: null,
  lastPosition: 0,
};

// Debounced DB save
let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave(state: PlayerStore) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const persisted: PersistedState = {
      tracks: state.tracks,
      playlists: state.playlists,
      queue: state.queue,
      currentQueueIndex: state.currentQueueIndex,
      shuffleMode: state.shuffleMode,
      repeatMode: state.repeatMode,
      volume: state.volume,
      lastTrackId: state.lastTrackId,
      lastPosition: state.lastPosition,
    };
    saveToDB(persisted);
  }, 400);
}

function buildQueue(tracks: Track[], startId?: number): QueueItem[] {
  return tracks.map((t, i) => ({ track: t, queueIndex: i, _startId: startId }));
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...DEFAULT_STATE,
  playback: { ...DEFAULT_PLAYBACK },

  // --- Library ---
  addTrack: (track) => {
    set((s) => ({ tracks: [...s.tracks, track] }));
    scheduleSave(get());
  },
  removeTrack: (id) => {
    set((s) => ({
      tracks: s.tracks.filter((t) => t.id !== id),
      queue: s.queue.filter((q) => q.track.id !== id),
    }));
    scheduleSave(get());
  },
  setTracks: (tracks) => {
    set({ tracks });
    scheduleSave(get());
  },

  // --- Playlists ---
  addPlaylist: (playlist) => {
    set((s) => ({ playlists: [...s.playlists, playlist] }));
    scheduleSave(get());
  },
  removePlaylist: (id) => {
    set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) }));
    scheduleSave(get());
  },
  setPlaylists: (playlists) => {
    set({ playlists });
    scheduleSave(get());
  },
  addTrackToPlaylist: (playlistId, trackId) => {
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId] }
          : p,
      ),
    }));
    scheduleSave(get());
  },
  removeTrackFromPlaylist: (playlistId, trackId) => {
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) }
          : p,
      ),
    }));
    scheduleSave(get());
  },

  // --- Queue ---
  setQueue: (tracks) => {
    const queue = buildQueue(tracks);
    set({ queue, currentQueueIndex: queue.length > 0 ? 0 : -1 });
    scheduleSave(get());
  },
  enqueueTrack: (track) => {
    set((s) => {
      const nextIdx = s.queue.length;
      return { queue: [...s.queue, { track, queueIndex: nextIdx }] };
    });
    scheduleSave(get());
  },
  removeFromQueue: (queueIndex) => {
    set((s) => {
      const newQueue = s.queue
        .filter((q) => q.queueIndex !== queueIndex)
        .map((q, i) => ({ ...q, queueIndex: i }));
      const newIdx =
        s.currentQueueIndex >= newQueue.length
          ? newQueue.length - 1
          : s.currentQueueIndex;
      return { queue: newQueue, currentQueueIndex: newIdx };
    });
    scheduleSave(get());
  },
  clearQueue: () => {
    set({ queue: [], currentQueueIndex: -1 });
    scheduleSave(get());
  },
  playTrackAt: (queueIndex) => {
    set({
      currentQueueIndex: queueIndex,
      playback: { ...get().playback, isPlaying: true, currentTime: 0 },
    });
    scheduleSave(get());
  },

  playNext: () => {
    const { queue, currentQueueIndex, repeatMode, shuffleMode } = get();
    if (queue.length === 0) return;
    let next: number;
    if (shuffleMode) {
      next = Math.floor(Math.random() * queue.length);
    } else if (currentQueueIndex < queue.length - 1) {
      next = currentQueueIndex + 1;
    } else if (repeatMode === "all") {
      next = 0;
    } else {
      set((s) => ({ playback: { ...s.playback, isPlaying: false } }));
      return;
    }
    set((s) => ({
      currentQueueIndex: next,
      playback: { ...s.playback, isPlaying: true, currentTime: 0 },
    }));
    scheduleSave(get());
  },

  playPrev: () => {
    const { queue, currentQueueIndex, playback } = get();
    if (queue.length === 0) return;
    // If more than 3s in, restart track
    if (playback.currentTime > 3) {
      set((s) => ({ playback: { ...s.playback, currentTime: 0 } }));
      return;
    }
    const prev = currentQueueIndex > 0 ? currentQueueIndex - 1 : 0;
    set((s) => ({
      currentQueueIndex: prev,
      playback: { ...s.playback, isPlaying: true, currentTime: 0 },
    }));
    scheduleSave(get());
  },

  // --- Playback state ---
  setPlaying: (isPlaying) =>
    set((s) => ({ playback: { ...s.playback, isPlaying } })),
  setCurrentTime: (currentTime) =>
    set((s) => ({
      playback: { ...s.playback, currentTime },
      lastPosition: currentTime,
    })),
  setDuration: (duration) =>
    set((s) => ({ playback: { ...s.playback, duration } })),
  setVolume: (volume) => {
    set((s) => ({ volume, playback: { ...s.playback, volume } }));
    scheduleSave(get());
  },
  setMuted: (isMuted) => set((s) => ({ playback: { ...s.playback, isMuted } })),
  setBuffering: (isBuffering) =>
    set((s) => ({ playback: { ...s.playback, isBuffering } })),
  toggleShuffle: () => {
    set((s) => ({ shuffleMode: !s.shuffleMode }));
    scheduleSave(get());
  },
  toggleRepeat: () => {
    const order: RepeatMode[] = ["none", "all", "one"];
    set((s) => {
      const next = order[(order.indexOf(s.repeatMode) + 1) % order.length];
      return { repeatMode: next };
    });
    scheduleSave(get());
  },

  // --- Session ---
  saveSession: () => {
    const { currentQueueIndex, queue, playback } = get();
    const currentTrack = queue[currentQueueIndex]?.track ?? null;
    set({
      lastTrackId: currentTrack?.id ?? null,
      lastPosition: playback.currentTime,
    });
    scheduleSave(get());
  },

  // --- Hydration ---
  hydrate: async () => {
    const saved = await loadFromDB<PersistedState>();
    if (saved) {
      set({
        tracks: saved.tracks ?? [],
        playlists: saved.playlists ?? [],
        queue: saved.queue ?? [],
        currentQueueIndex: saved.currentQueueIndex ?? -1,
        shuffleMode: saved.shuffleMode ?? false,
        repeatMode: saved.repeatMode ?? "none",
        volume: saved.volume ?? 1,
        lastTrackId: saved.lastTrackId ?? null,
        lastPosition: saved.lastPosition ?? 0,
        playback: { ...DEFAULT_PLAYBACK, volume: saved.volume ?? 1 },
      });
    }
  },
}));
