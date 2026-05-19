module {
  // Session restore state
  public type Session = {
    var lastTrackId : ?Nat;
    var lastPosition : Nat; // seconds
  };

  // Shared type for API boundary
  public type SessionInfo = {
    lastTrackId : ?Nat;
    lastPosition : Nat;
  };
};
