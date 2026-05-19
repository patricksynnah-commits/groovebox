import Debug "mo:core/Debug";
import SessionTypes "../types/session";

module {
  public type Session = SessionTypes.Session;
  public type SessionInfo = SessionTypes.SessionInfo;

  public func saveSession(
    session : Session,
    lastTrackId : ?Nat,
    lastPosition : Nat,
  ) {
    session.lastTrackId := lastTrackId;
    session.lastPosition := lastPosition;
  };

  public func getSession(session : Session) : SessionInfo {
    { lastTrackId = session.lastTrackId; lastPosition = session.lastPosition };
  };
};
