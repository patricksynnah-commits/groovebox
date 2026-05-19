import Storage "mo:caffeineai-object-storage/Storage";

module {
  // Internal mutable track record
  public type Track = {
    id : Nat;
    var title : Text;
    var artist : Text;
    var duration : Nat; // seconds
    var blob : Storage.ExternalBlob;
  };

  // Shared (immutable) type for API boundary
  public type TrackInfo = {
    id : Nat;
    title : Text;
    artist : Text;
    duration : Nat;
    blob : Storage.ExternalBlob;
  };
};
