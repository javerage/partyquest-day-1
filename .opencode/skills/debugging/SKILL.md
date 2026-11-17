---
name: debugging
description: "Trigger: debug a failing PartyQuest check, investigate an error, or isolate a regression. Diagnose evidence without expanding the authorized increment."
---

## Activation Contract
Use when a PartyQuest command or deterministic check fails.

## Hard Rules
- Preserve the failure output and existing work before changing anything.
- Do not hide, retry indefinitely, or rewrite unrelated failures.
- Never print credentials, environment dumps, or raw provider payloads.

## Decision Gates
- If a fix requires changing another increment or a human choice, stop and explain the evidence.
- If a failure is environmental, separate it from a product defect without claiming a pass.

## Steps
1. Reproduce with the smallest authorized command and record exit code/stdout/stderr.
2. Trace the failure to the nearest responsible public behavior or boundary.
3. Make one focused correction and rerun the failed check once; make at most one further correction if that check still fails after a real fix.
4. Report the remaining failure and missing evidence if unresolved.

## Output
Provide cause supported by evidence, paths changed, exact rerun, and remaining risk.

## References
- [Student rules](../../../AGENTS.md)
- [Roadmap](../../../docs/day-1/roadmap.md)
