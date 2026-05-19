// Shared TypeScript types for the Music Player app

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // seconds
  blobUrl: string; // object URL for local playback
  addedAt: number; // timestamp
}

export interface Playlist {
  id: number;
  name: string;
  trackIds: number[];
}

export type RepeatMode = "none" | "one" | "all";

export interface QueueItem {
  track: Track;
  queueIndex: number; // position in queue
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number; // seconds
  duration: number; // seconds
  volume: number; // 0-1
  isMuted: boolean;
  isBuffering: boolean;
}

export interface PlayerState {
  // Library
  tracks: Track[];
  playlists: Playlist[];

  // Queue & playback
  queue: QueueItem[];
  currentQueueIndex: number; // index in queue array
  shuffleMode: boolean;
  repeatMode: RepeatMode;

  // Playback state
  playback: PlaybackState;

  // Session
  lastTrackId: number | null;
  lastPosition: number;
}
