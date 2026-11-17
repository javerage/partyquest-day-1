---
name: contract-testing
description: "Trigger: write contract tests, test an API increment, or verify observable behavior. Derive deterministic tests from the PartyQuest student contract."
---

## Activation Contract
Use when planning or writing tests for a PartyQuest API or UI contract increment.

## Hard Rules
- Read the active roadmap row and relevant student contract before writing tests.
- Test public interfaces and exact observable results; use fake providers, never live credentials.
- Keep each test within the authorized increment; do not distribute instructor solution tests.

## Decision Gates
- If expected status, response, boundary, or error is unspecified, stop and ask rather than inventing behavior.
- If a test needs a real account, network, or secret, replace it with a deterministic fake or report the limitation.

## Steps
1. List each named rule, example, boundary, and error to cover.
2. Add one focused test per requested rule and observe the expected failure before implementation.
3. Assert status, relevant response data, and that rejected inputs produce no forbidden side effects.
4. Run the focused test after implementation and report exact evidence and uncovered cases.

## Output
Report test paths, command, pass/fail counts, and what the tests do not prove.

## References
- [API contract](../../../docs/api-contract.md)
- [Roadmap](../../../docs/day-1/roadmap.md)
