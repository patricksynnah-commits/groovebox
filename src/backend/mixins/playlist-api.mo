import List "mo:core/List";
import PlaylistTypes "../types/playlist";
import PlaylistLib "../lib/playlist";

mixin (
  playlists : List.List<PlaylistTypes.Playlist>,
  playlistState : { var nextPlaylistId : Nat },
) {
  /// Create a new playlist with the given name.
  public shared func createPlaylist(name : Text) : async PlaylistTypes.PlaylistInfo {
    PlaylistLib.createPlaylist(playlists, playlistState, name);
  };

  /// Rename an existing playlist.
  public shared func renamePlaylist(id : Nat, name : Text) : async Bool {
    PlaylistLib.renamePlaylist(playlists, id, name);
  };

  /// Delete a playlist.
  public shared func deletePlaylist(id : Nat) : async Bool {
    PlaylistLib.deletePlaylist(playlists, id);
  };

  /// Add a track to a playlist (appended to the end).
  public shared func addTrackToPlaylist(playlistId : Nat, trackId : Nat) : async Bool {
    PlaylistLib.addTrackToPlaylist(playlists, playlistId, trackId);
  };

  /// Remove a track from a playlist.
  public shared func removeTrackFromPlaylist(playlistId : Nat, trackId : Nat) : async Bool {
    PlaylistLib.removeTrackFromPlaylist(playlists, playlistId, trackId);
  };

  /// Return all playlists.
  public query func listPlaylists() : async [PlaylistTypes.PlaylistInfo] {
    PlaylistLib.listPlaylists(playlists);
  };

  /// Return a single playlist by ID.
  public query func getPlaylist(id : Nat) : async ?PlaylistTypes.PlaylistInfo {
    PlaylistLib.getPlaylist(playlists, id);
  };
};
