import List "mo:core/List";
import LibraryTypes "../types/library";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Track = LibraryTypes.Track;
  public type TrackInfo = LibraryTypes.TrackInfo;

  public func addTrack(
    tracks : List.List<Track>,
    state : { var nextTrackId : Nat },
    title : Text,
    artist : Text,
    duration : Nat,
    blob : Storage.ExternalBlob,
  ) : TrackInfo {
    let id = state.nextTrackId;
    state.nextTrackId += 1;
    let track : Track = { id; var title; var artist; var duration; var blob = blob };
    tracks.add(track);
    { id; title; artist; duration; blob = track.blob };
  };

  public func deleteTrack(
    tracks : List.List<Track>,
    id : Nat,
  ) : Bool {
    let sizeBefore = tracks.size();
    let filtered = tracks.filter(func(t : Track) : Bool { t.id != id });
    tracks.clear();
    tracks.append(filtered);
    tracks.size() < sizeBefore;
  };

  public func listTracks(tracks : List.List<Track>) : [TrackInfo] {
    tracks.map<Track, TrackInfo>(func(t) {
      { id = t.id; title = t.title; artist = t.artist; duration = t.duration; blob = t.blob }
    }).toArray();
  };

  public func getTrack(tracks : List.List<Track>, id : Nat) : ?TrackInfo {
    switch (tracks.find(func(t : Track) : Bool { t.id == id })) {
      case (?t) ?{ id = t.id; title = t.title; artist = t.artist; duration = t.duration; blob = t.blob };
      case null null;
    };
  };
};
