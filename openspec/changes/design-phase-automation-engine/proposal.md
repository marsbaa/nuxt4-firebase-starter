# Design Phase Automation Engine v0.1

## Why

Feature development workflows require consistent, high-quality design artifacts before implementation begins. Manual design creation is time-consuming, inconsistent, and lacks objective quality validation. Teams need an automated system that:

- Generates framework-agnostic design artifacts using AI agents
- Enforces quality standards through deterministic evaluation
- Provides visual previews for human review
- Requires explicit human approval before design freeze
- Maintains design immutability after approval

This automation engine will streamline the Design phase while preserving human authority over critical decisions.

## What Changes

### Core Automation Pipeline

- Add Design Generator agent (LLM) that creates design artifacts from feature requirements
- Add Design Critic agent (LLM) that evaluates designs against quality dimensions
- Implement deterministic evaluation loop with quality threshold (default: 80/100)
- Add iteration limit (default: 10) to prevent infinite loops
- Create state machine with 7 states: IDLE, GENERATING, EVALUATING, CANDIDATE, REVISING, FROZEN, FAILED

### Design Artifacts

- Create `design/intent.json` - machine-readable design specification following strict JSON schema
- Create `design/preview.html` - human-readable visual representation generated via Google Stitch MCP tool
- Create `design/critique.json` - structured evaluation report with scores and recommendations
- Create `design/state.json` - current automation state with iteration count and scores
- Create `design/final/FROZEN.md` - immutability marker with checksum and approval metadata

### JSON Schema Contract

Define strict schema for design intent including:
- Feature identifier and version
- Design goals (array of strings)
- User flows with steps, actions, and components
- Component structure (framework-agnostic types: view, container, control, data, utility)
- Data model with entities, attributes, and relationships
- Interaction patterns

### Evaluation Dimensions

Implement 5 weighted scoring dimensions:
- **Completeness** (25%): All required sections populated with meaningful content
- **Coherence** (25%): User flows align with defined components and data model
- **Clarity** (20%): Descriptions are specific and unambiguous
- **Framework Agnosticism** (15%): No framework-specific terminology detected
- **Data Model Integrity** (15%): Entities support all user flows

### Deterministic Execution Guarantees

To ensure reproducible, verifiable automation:

**LLM Configuration:**
- Design Generator agent temperature MUST be 0
- Design Critic agent temperature MUST be 0
- Model version MUST be fixed and recorded in `state.json` at run start
- Model version MUST NOT change during a run
- If model version changes mid-run, execution MUST transition to FAILED

**Prompt Governance:**
- Prompt templates MUST be versioned (semantic versioning)
- Prompt template version MUST be recorded in `state.json` at run start
- Prompt templates MUST be frozen (immutable) during a run
- Prompt template path MUST be recorded in `state.json`

**Determinism Enforcement:**
- Identical design intent input MUST produce identical critic scores
- Critic evaluation MUST NOT use randomness, timestamps, or external state
- If deterministic guarantees cannot be met, execution MUST transition to FAILED
- Determinism violations MUST be logged with specific failure reason

**Prompt Hash Recording:**
- Compute SHA-256 hash of prompt template content at run start
- Record prompt template hash in `state.json` for both Generator and Critic
- On each agent invocation, verify prompt template content matches recorded hash
- If prompt template content changes mid-run, execution MUST transition to FAILED

**Verification:**
- On each EVALUATING transition, record input hash and output score
- If same input hash produces different score, MUST transition to FAILED

### State Transition Table

The automation engine SHALL enforce the following state machine:

| Current State | Allowed Next States | Trigger Condition | Forbidden Transitions |
|---------------|---------------------|-------------------|----------------------|
| **IDLE** | GENERATING | User initiates design generation | EVALUATING, CANDIDATE, REVISING, FROZEN |
| **GENERATING** | EVALUATING, FAILED | Design artifact produced OR agent timeout/error | IDLE, CANDIDATE, REVISING, FROZEN |
| **EVALUATING** | CANDIDATE, REVISING, FAILED | Score ≥ threshold → CANDIDATE<br>Score < threshold → REVISING<br>Validation/timeout → FAILED | IDLE, GENERATING, FROZEN |
| **CANDIDATE** | FROZEN, REVISING, FAILED | Human approves → FROZEN<br>Human rejects → REVISING<br>Human aborts → FAILED | IDLE, GENERATING, EVALUATING |
| **REVISING** | GENERATING | Revision feedback prepared | IDLE, EVALUATING, CANDIDATE, FROZEN, FAILED |
| **FROZEN** | *(terminal)* | None - requires manual unfreeze | ALL (FROZEN is terminal) |
| **FAILED** | IDLE | Manual reset only | GENERATING, EVALUATING, CANDIDATE, REVISING, FROZEN |

**Enforcement Rules:**
- Any attempt to transition to a forbidden state MUST be rejected
- Rejected transitions MUST log violation and maintain current state
- FROZEN state is terminal - unfreeze requires manual deletion of `FROZEN.md` and state reset
- FAILED state requires manual intervention - no automatic recovery

### Artifact Authority Hierarchy

The following authority hierarchy governs artifact relationships:

**Authoritative Artifact:**
- `design/intent.json` is the single source of truth
- Freeze applies to `intent.json` and its SHA-256 checksum
- Modifications to `intent.json` invalidate all derivative artifacts

**Derivative Artifacts:**
- `design/preview.html` is derived from `intent.json`
- Preview changes alone MUST NOT be freezable
- Preview MUST be regenerated if `intent.json` changes

**Evaluative Artifacts:**
- `design/critique.json` evaluates `intent.json`
- Critique does not modify `intent.json`
- Critique is regenerated each iteration

**Runtime Metadata:**
- `design/state.json` tracks execution state
- State changes do not modify design artifacts
- State is mutable until FROZEN

**Immutability Governance:**
- `design/final/FROZEN.md` governs immutability
- Presence of `FROZEN.md` makes `design/final/intent.json` immutable
- Checksum in `FROZEN.md` verifies `intent.json` integrity

### Human Approval Gate Behavior

When state transitions to CANDIDATE, the system SHALL present three options:

**Approve:**
- Transition to FROZEN
- Execute freeze mechanism (copy artifacts, generate checksum, write `FROZEN.md`)
- Record approver identity, timestamp, final score, iteration count
- Make `design/final/intent.json` immutable

**Reject:**
- Transition to REVISING
- Prompt human for rejection feedback (freeform text)
- Inject rejection feedback into Design Generator prompt
- Increment iteration counter
- Reset candidate status
- Transition to GENERATING with augmented prompt

**Abort:**
- Transition to FAILED
- Preserve all current artifacts in `design/` directory
- Do NOT delete or modify existing artifacts
- Record abort reason and timestamp in `state.json`
- Require manual restart (transition FAILED → IDLE)

**Enforcement:**
- No default selection - human MUST explicitly choose
- No timeout-based auto-approval
- Approval choice MUST be recorded in `state.json` history

### Loop Termination Priority Order

On each iteration, the system SHALL evaluate exit conditions in this deterministic order:

**Priority 1: Schema Validation Failure**
- Check: Does `intent.json` conform to JSON schema?
- If NO → Transition to FAILED
- Log: Specific schema violation details

**Priority 2: Agent Timeout**
- Check: Did Design Generator or Design Critic exceed timeout (default: 5 minutes)?
- If YES → Transition to FAILED
- Log: Which agent timed out and duration

**Priority 3: Max Iteration Exceeded**
- Check: Is `iteration >= maxIterations` (default: 10)?
- If YES → Transition to FAILED
- Log: Final score, iteration count, threshold

**Priority 4: No Progress Detected**
- Check: Has overall score been unchanged for 3 consecutive iterations?
- If YES → Transition to FAILED
- Log: Stagnant score, iteration range

**Priority 5: Threshold Met**
- Check: Is `overallScore >= threshold`?
- If YES → Transition to CANDIDATE
- Log: Score, threshold, iteration count

**Enforcement:**
- Only ONE condition may trigger per iteration
- Conditions are evaluated in priority order (1 → 5)
- First matching condition determines transition
- If no condition matches, continue loop (REVISING → GENERATING)

### No Progress Detection Rules

**Score Comparison Method:**
- Compare weighted overall scores (0-100 scale)
- Use dimension scores as secondary comparison if overall scores are equal

**Float Tolerance:**
- Scores are considered equal if `|score1 - score2| < 0.01`
- Tolerance applies to overall score only
- Dimension scores use exact comparison for tie-breaking

**Comparison Logic:**
- Record overall score in `state.json` after each EVALUATING transition
- Maintain score history array: `scoreHistory: [iteration, score][]`
- Check last 3 scores: if all within tolerance → no progress

**Stagnation Threshold:**
- 3 consecutive iterations with unchanged score triggers FAILED
- Iteration counter increments even if score is unchanged
- Stagnation check occurs at Priority 4 in termination order

**Example:**
```
Iteration 5: score = 72.45
Iteration 6: score = 72.46  (within tolerance, count = 1)
Iteration 7: score = 72.44  (within tolerance, count = 2)
Iteration 8: score = 72.45  (within tolerance, count = 3) → FAILED
```

### Freeze Immutability Enforcement

**Enforcement Mechanism:**

The system SHALL enforce immutability using **SHA-256 checksum verification**:

**Canonical Hashing Requirement:**

Before computing SHA-256 checksum, `intent.json` MUST be canonicalized:
- Keys sorted lexicographically (recursive for nested objects)
- No insignificant whitespace (compact JSON formatting)
- UTF-8 encoding enforced
- Consistent number formatting (no trailing zeros)

This prevents checksum variance due to formatting differences.

1. **On Freeze:**
   - Canonicalize `design/final/intent.json` content
   - Compute SHA-256 hash of canonicalized content
   - Write hash to `FROZEN.md` in `checksumSHA256` field
   - Record freeze timestamp

2. **On Load (any operation accessing frozen design):**
   - Check for presence of `design/final/FROZEN.md`
   - If present, canonicalize `design/final/intent.json` content
   - Compute SHA-256 of canonicalized content
   - Compare computed hash with `checksumSHA256` in `FROZEN.md`
   - If hashes do NOT match → integrity violation → FAILED

3. **On Modification Attempt:**
   - Before any write to `design/final/intent.json`, check for `FROZEN.md`
   - If `FROZEN.md` exists → reject modification
   - Log attempted modification with timestamp and user

**Verification Frequency:**
- Checksum verification MUST occur on every load of frozen design
- Checksum verification MUST occur before any state transition from IDLE
- Checksum verification MUST occur before unfreeze operation

**Integrity Violation Response:**
- Transition to FAILED
- Log: expected hash, actual hash, timestamp
- Notify user of integrity violation
- Require manual investigation before reset

**Unfreeze Procedure:**
1. Human MUST manually delete `design/final/FROZEN.md`
2. System detects deletion
3. Transition FROZEN → IDLE
4. Log unfreeze event with timestamp and reason

### Threshold Governance

**Configurability:**
- Threshold MAY be configured per feature
- Default threshold: 80/100
- Valid range: 70 ≤ threshold ≤ 95

**Mid-Run Immutability:**
- Threshold MUST be set before transition to GENERATING
- Threshold MUST be recorded in `state.json` at run start
- Threshold MUST NOT change during a run (IDLE → FROZEN or FAILED)
- Any attempt to modify threshold mid-run MUST be rejected

**Freeze Recording:**
- Threshold value MUST be recorded in `FROZEN.md`
- Threshold is part of freeze metadata (not part of checksum input)
- `FROZEN.md` MUST include field: `qualityThreshold: <value>`

**Checksum Metadata:**
- Threshold is NOT part of `intent.json` checksum
- Checksum applies only to `intent.json` content
- Threshold is recorded separately in `FROZEN.md` for audit purposes

**Example `FROZEN.md` excerpt:**
```markdown
**Quality Threshold:** 80/100
**Final Score:** 87/100
**Checksum (SHA-256):** a3f5b8c...
```

### Feature Isolation

**Directory Scoping:**
- All design artifacts MUST be scoped to feature directory: `<feature-id>/design/`
- Each feature maintains independent `state.json`
- No shared state between features

**State Independence:**
- Feature A's state transitions MUST NOT affect Feature B
- Iteration counters are per-feature
- Thresholds are per-feature (may differ)

**Artifact Isolation:**
- `<feature-id>/design/intent.json` is isolated to that feature
- `<feature-id>/design/final/FROZEN.md` governs only that feature's freeze
- No cross-feature artifact references allowed

**Concurrent Execution:**
- Multiple features MAY be in design phase simultaneously
- Each feature runs independent state machine
- Shared resources (LLM API) MUST be managed by implementation (out of scope for this proposal)

**Example Directory Structure:**
```
features/
  user-authentication/
    design/
      intent.json
      preview.html
      critique.json
      state.json
      final/
        FROZEN.md
        intent.json
        preview.html
  payment-processing/
    design/
      intent.json
      state.json
```

### Integration

- Integrate Google Stitch MCP tool for HTML preview generation
- Run as local Node.js pipeline within VS Code
- No external dependencies or cloud services

## Impact

### Affected Specs

This is a **new capability** that does not affect existing specs. It introduces:
- Design automation workflow specification
- Design artifact schema specification
- Critic evaluation rules specification
- State machine governance specification
- Deterministic execution contract

### Affected Code

New code will be added for:
- `src/automation/design-generator.ts` - Design Generator agent with deterministic LLM config
- `src/automation/design-critic.ts` - Design Critic agent with deterministic scoring
- `src/automation/state-machine.ts` - State management with transition enforcement
- `src/automation/schema-validator.ts` - JSON schema validation
- `src/automation/freeze-manager.ts` - Freeze/unfreeze with checksum verification
- `src/automation/preview-generator.ts` - Stitch MCP tool integration
- `src/automation/approval-gate.ts` - Human approval workflow with Approve/Reject/Abort
- `src/automation/determinism-enforcer.ts` - LLM config validation and input/output hashing
- `src/automation/progress-detector.ts` - No-progress detection with float tolerance
- `schemas/design-intent.schema.json` - JSON schema definition
- `templates/FROZEN.md.template` - Freeze marker template with checksum field
- `templates/prompts/design-generator-v1.0.0.txt` - Versioned prompt template
- `templates/prompts/design-critic-v1.0.0.txt` - Versioned prompt template

### Constraints

**Deterministic Execution:**
- LLM temperature MUST be 0
- Model version MUST be fixed during run
- Prompt templates MUST be versioned and frozen
- Identical input MUST produce identical critic scores

**State Governance:**
- State transitions MUST follow transition table
- FROZEN is terminal (requires manual unfreeze)
- FAILED requires manual reset
- Only one exit condition may trigger per iteration

**Artifact Authority:**
- `intent.json` is authoritative
- Preview changes alone MUST NOT be freezable
- Freeze applies to `intent.json` checksum

**Immutability Enforcement:**
- SHA-256 checksum verification on load
- Modification attempts blocked if `FROZEN.md` exists
- Integrity violations transition to FAILED

**Threshold Governance:**
- Threshold MUST NOT change mid-run
- Threshold recorded in `FROZEN.md`
- Threshold NOT part of checksum

**Feature Isolation:**
- All artifacts scoped per feature directory
- No cross-feature state sharing
- Independent state machines per feature

### Scope Boundaries

This proposal defines **ONLY** the Design phase automation engine.

**Out of scope:**
- Specification phase automation
- Task phase automation
- AI Foundry orchestration
- Design-to-spec transition automation
- Multi-feature parallel processing coordination
- Cloud deployment or remote execution
- LLM API rate limiting or quota management
