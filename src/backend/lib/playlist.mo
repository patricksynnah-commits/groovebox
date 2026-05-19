import List "mo:core/List";
import PlaylistTypes "../types/playlist";

module {
  public type Playlist = PlaylistTypes.Playlist;
  public type PlaylistInfo = PlaylistTypes.PlaylistInfo;

  public func createPlaylist(
    playlists : List.List<Playlist>,
    state : { var nextPlaylistId : Nat },
    name : Text,
  ) : PlaylistInfo {
    let id = state.nextPlaylistId;
    state.nextPlaylistId += 1;
    let playlist : Playlist = { id; var name; var trackIds = [] };
    playlists.add(playlist);
    { id; name; trackIds = [] };
  };

  public func renamePlaylist(
    playlists : List.List<Playlist>,
    id : Nat,
    name : Text,
  ) : Bool {
    switch (playlists.find(func(p : Playlist) : Bool { p.id == id })) {
      case (?p) { p.name := name; true };
      case null false;
    };
  };

  public func deletePlaylist(
    playlists : List.List<Playlist>,
    id : Nat,
  ) : Bool {
    let sizeBefore = playlists.size();
    let filtered = playlists.filter(func(p : Playlist) : Bool { p.id != id });
    playlists.clear();
    playlists.append(filtered);
    playlists.size() < sizeBefore;
  };

  public func addTrackToPlaylist(
    playlists : List.List<Playlist>,
    playlistId : Nat,
    trackId : Nat,
  ) : Bool {
    switch (playlists.find(func(p : Playlist) : Bool { p.id == playlistId })) {
      case (?p) {
        p.trackIds := p.trackIds.concat([trackId]);
        true;
      };
      case null false;
    };
  };

  public func removeTrackFromPlaylist(
    playlists : List.List<Playlist>,
    playlistId : Nat,
    trackId : Nat,
  ) : Bool {
    switch (playlists.find(func(p : Playlist) : Bool { p.id == playlistId })) {
      case (?p) {
        let before = p.trackIds.size();
        p.trackIds := p.trackIds.filter(func(tid : Nat) : Bool { tid != trackId });
        p.trackIds.size() < before;
      };
      case null false;
    };
  };

  public func listPlaylists(playlists : List.List<Playlist>) : [PlaylistInfo] {
    playlists.map<Playlist, PlaylistInfo>(func(p) {
      { id = p.id; name = p.name; trackIds = p.trackIds }
    }).toArray();
  };

  public func getPlaylist(playlists : List.List<Playlist>, id : Nat) : ?PlaylistInfo {
    switch (playlists.find(func(p : Playlist) : Bool { p.id == id })) {
      case (?p) ?{ id = p.id; name = p.name; trackIds = p.trackIds };
      case null null;
    };
  };
};
