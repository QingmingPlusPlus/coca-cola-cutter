# agent-governance Specification

## Purpose

Agent memory keeps future work focused by routing from a target path or module to the smallest useful set of docs, specs, and reusable skills.

## Requirements

### Requirement: Agents read routed memory before substantive work

Before development, review, debugging, or documentation/spec/skill changes, agents MUST read `doc/agent-memory-map.md` and then read the most specific matching docs and specs.

#### Scenario: A routed path exists

- **WHEN** a user request targets a path or module listed in the routing map
- **THEN** the agent reads the mapped `doc` and `spec`
- **AND** uses the mapped skill only when the task needs that workflow

#### Scenario: No routed path exists

- **WHEN** no routing row matches the target
- **THEN** the agent searches `doc/`, `spec/`, `openspec/specs/`, and `.agents/skills/`
- **AND** adds a routing row when the work creates a durable memory entry

### Requirement: Memory content lives in the right layer

Long-term behavior constraints and acceptance scenarios MUST live in `spec/` or `openspec/specs/`. Current implementation state MUST live in `doc/`. Stable repeatable workflows MUST live in `.agents/skills/`.

#### Scenario: A module implementation changes

- **WHEN** a change alters current files, fields, routes, component ownership, or module status
- **THEN** the matching `doc/` entry is updated

#### Scenario: A behavior contract changes

- **WHEN** a change alters expected user-visible behavior or acceptance criteria
- **THEN** the matching spec is updated

#### Scenario: A reusable workflow emerges

- **WHEN** a procedure is stable, repeated, and has clear steps and self-checks
- **THEN** it is documented as a skill
- **AND** transient project state is kept out of the skill

### Requirement: AGENTS.md stays a root policy file

`AGENTS.md` MUST contain repository-wide agent rules and memory entry guidance. It SHOULD NOT duplicate detailed module state that belongs in routed docs.

#### Scenario: New module documentation is added

- **WHEN** a new module doc, spec, or skill is added
- **THEN** `doc/agent-memory-map.md` points to it
- **AND** `AGENTS.md` is changed only if repository-wide behavior changes

### Requirement: Sensitive or short-lived data is excluded from memory

Project memory MUST NOT include secrets, credentials, customer-private data, or one-off debugging noise.

#### Scenario: Debugging produces temporary findings

- **WHEN** findings are short-lived and do not change future behavior
- **THEN** they are not written into project memory
