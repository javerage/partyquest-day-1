// Location stays in the browser during D1: it is never sent to the API or the
// prompt, and no coverage classification is made.
export type LocationState =
  | { status: "idle" }
  | { status: "offered" }
  | { status: "requesting" }
  | { status: "unavailable" }
  | { status: "captured"; latitude: number; longitude: number }
  | { status: "zone"; zone: string };

// TODO(D1·B6.1): Export `useLocation(geolocation)`, where `geolocation` is the
// browser `Geolocation` object or `undefined`. It returns the `location` state, a
// `zoneEntry` flag and the actions `offer`, `requestPosition`, `startZoneEntry`,
// `saveZone` and `reset`. Denied, unavailable or timed-out requests end in
// `unavailable`, which offers the written zone. The browser answer can arrive late:
// once the person starts or saves a written zone, that answer (success or error) is
// discarded. A new request made while the zone field is open, if granted, closes
// that field. Test it in
// `frontend/src/features/location/tests/location.test.tsx` with a fake geolocation
// (granted, denied, not available). Read docs/01-chat-integration.md and
// docs/day-1/interface-reference.md before this increment.
