import SessionTypes "../types/session";
import SessionLib "../lib/session";

mixin (session : SessionTypes.Session) {
  /// Persist the last played track and playback position for session restore.
  public shared func saveSession(lastTrackId : ?Nat, lastPosition : Nat) : async () {
    SessionLib.saveSession(session, lastTrackId, lastPosition);
  };

  /// Retrieve the last session state.
  public query func getSession() : async SessionTypes.SessionInfo {
    SessionLib.getSession(session);
  };
};
