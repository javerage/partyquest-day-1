---
name: verification
description: "Trigger: verify a PartyQuest increment, run its checks, or report completion evidence. Match observed proof to the roadmap without overstating it."
---

## Activation Contract
Use before closing a PartyQuest increment or reviewing its evidence.

## Hard Rules
- Run only the authorized checks; do not install, access accounts, or call providers unless explicitly authorized.
- A simulated provider proves contract behavior, not live connectivity.
- Missing browser, Windows, package, or account evidence remains pending.

## Decision Gates
- If a required check fails, report partial; do not mark the increment complete.
- If a check is unavailable, state why and the specific proof still needed.

## Steps
1. Map each roadmap acceptance criterion to an exact command or observed manual action.
2. Run checks in the prescribed order and capture exit status and test counts.
3. Check package paths, student-only scope, and relevant secret boundaries.
4. Report passes, failures, and unverified platform behavior separately.

## Output
List each exact check and observed result, then state remaining proof. The student owns roadmap status.

## References
- [Roadmap](../../../docs/day-1/roadmap.md)
- [API contract](../../../docs/api-contract.md)
