module {
  // Internal mutable playlist record
  public type Playlist = {
    id : Nat;
    var name : Text;
    var trackIds : [Nat]; // ordered list of track IDs
  };

  // Shared (immutable) type for API boundary
  public type PlaylistInfo = {
    id : Nat;
    name : Text;
    trackIds : [Nat];
  };
};
