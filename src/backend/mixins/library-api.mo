import List "mo:core/List";
import Storage "mo:caffeineai-object-storage/Storage";
import LibraryTypes "../types/library";
import LibraryLib "../lib/library";

mixin (
  tracks : List.List<LibraryTypes.Track>,
  libraryState : { var nextTrackId : Nat },
) {
  /// Upload a new audio track to the library.
  public shared func addTrack(
    title : Text,
    artist : Text,
    duration : Nat,
    blob : Storage.ExternalBlob,
  ) : async LibraryTypes.TrackInfo {
    LibraryLib.addTrack(tracks, libraryState, title, artist, duration, blob);
  };

  /// Remove a track from the library.
  public shared func deleteTrack(id : Nat) : async Bool {
    LibraryLib.deleteTrack(tracks, id);
  };

  /// Return all tracks in the library.
  public query func listTracks() : async [LibraryTypes.TrackInfo] {
    LibraryLib.listTracks(tracks);
  };

  /// Return a single track by ID.
  public query func getTrack(id : Nat) : async ?LibraryTypes.TrackInfo {
    LibraryLib.getTrack(tracks, id);
  };
};
