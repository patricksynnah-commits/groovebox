import List "mo:core/List";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import LibraryTypes "types/library";
import PlaylistTypes "types/playlist";
import SessionTypes "types/session";
import LibraryApi "mixins/library-api";
import PlaylistApi "mixins/playlist-api";
import SessionApi "mixins/session-api";

actor {
  // --- Library state ---
  let tracks = List.empty<LibraryTypes.Track>();
  let libraryState = { var nextTrackId : Nat = 0 };

  // --- Playlist state ---
  let playlists = List.empty<PlaylistTypes.Playlist>();
  let playlistState = { var nextPlaylistId : Nat = 0 };

  // --- Session state ---
  let session : SessionTypes.Session = { var lastTrackId = null; var lastPosition = 0 };

  // --- Mixins ---
  include MixinObjectStorage();
  include LibraryApi(tracks, libraryState);
  include PlaylistApi(playlists, playlistState);
  include SessionApi(session);
};
