import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SessionInfo {
    lastPosition: bigint;
    lastTrackId?: bigint;
}
export interface TrackInfo {
    id: bigint;
    title: string;
    duration: bigint;
    blob: ExternalBlob;
    artist: string;
}
export interface PlaylistInfo {
    id: bigint;
    name: string;
    trackIds: Array<bigint>;
}
export interface backendInterface {
    addTrack(title: string, artist: string, duration: bigint, blob: ExternalBlob): Promise<TrackInfo>;
    addTrackToPlaylist(playlistId: bigint, trackId: bigint): Promise<boolean>;
    createPlaylist(name: string): Promise<PlaylistInfo>;
    deletePlaylist(id: bigint): Promise<boolean>;
    deleteTrack(id: bigint): Promise<boolean>;
    getPlaylist(id: bigint): Promise<PlaylistInfo | null>;
    getSession(): Promise<SessionInfo>;
    getTrack(id: bigint): Promise<TrackInfo | null>;
    listPlaylists(): Promise<Array<PlaylistInfo>>;
    listTracks(): Promise<Array<TrackInfo>>;
    removeTrackFromPlaylist(playlistId: bigint, trackId: bigint): Promise<boolean>;
    renamePlaylist(id: bigint, name: string): Promise<boolean>;
    saveSession(lastTrackId: bigint | null, lastPosition: bigint): Promise<void>;
}
