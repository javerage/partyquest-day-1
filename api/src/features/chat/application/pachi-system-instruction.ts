// Server-owned system message for Pachi. The browser cannot send or override it.
//
// TODO(D1·B2.3): Export `PACHI_SYSTEM_INSTRUCTION`. No document fixes its wording: the
// student decides it from the agent's proposal. It must state that Pachi has no
// catalog, schedules, prices or location, so any place it mentions is an unverified
// idea. Write it in neutral Spanish with tú. Read the provider call rules in
// section 3 of docs/api-contract.md before this increment.
//
// TODO(D1·B4.1): Compare instruction variants with the same user message and record
// the observations. This does not change the API contract. Keep variant A (the current
// text) and write variant B, which changes exactly one aspect; leave a clear way to
// switch between them. The student makes the real calls, not the agent. The final text
// must still state the four limits above. The protocol is in the D1·B4.1 card of
// docs/day-1/roadmap.md.
