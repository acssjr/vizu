<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0
Bump rationale: Initial constitution creation (MAJOR - first ratification)

Modified principles: N/A (initial creation)

Added sections:
- Core Principles (5 principles)
- Technology Guidelines
- Development Workflow
- Governance

Removed sections: N/A (initial creation)

Templates reviewed:
- .specify/templates/plan-template.md ✅ Compatible (Constitution Check section present)
- .specify/templates/spec-template.md ✅ Compatible (technology-agnostic requirements)
- .specify/templates/tasks-template.md ✅ Compatible (flexible testing approach)

Follow-up TODOs: None
-->

# Vizu Constitution

## Core Principles

### I. Simplicity First (YAGNI)

Every feature and implementation MUST start with the simplest solution that works. Complexity is added
only when proven necessary through real requirements.

**Non-negotiables**:
- MUST NOT add features, abstractions, or configurations for hypothetical future needs
- MUST NOT create helper utilities for one-time operations
- MUST delete unused code rather than commenting it out
- MUST choose three lines of duplicated code over a premature abstraction
- MUST justify any complexity beyond the minimum needed for current requirements

**Rationale**: Over-engineering creates maintenance burden, obscures intent, and slows iteration.
Social platforms evolve rapidly; keeping code simple enables fast pivots.

### II. Type Safety

All code MUST leverage TypeScript's type system to catch errors at compile time rather than runtime.
Types serve as living documentation and enable confident refactoring.

**Non-negotiables**:
- MUST NOT use `any` type except when interfacing with untyped external libraries (and must add types as soon as practical)
- MUST enable strict mode in TypeScript configuration
- MUST define explicit types for API boundaries, props, and public interfaces
- MUST NOT use type assertions (`as`) to bypass type errors without documented justification

**Rationale**: Type errors caught during development cost minutes; runtime errors cost hours of
debugging and damage user trust in a social platform.

### III. User-Centric Design

Features MUST be designed from the user's perspective. Technical decisions serve user needs,
not the other way around.

**Non-negotiables**:
- MUST validate features against real user scenarios before implementation
- MUST prioritize user experience over developer convenience when trade-offs exist
- MUST handle error states gracefully with user-friendly messages
- MUST consider accessibility in all user-facing components
- MUST optimize perceived performance (loading states, optimistic updates) for social interactions
- MUST NEVER use emojis in the interface design
- MUST use SVG icons or icon libraries (Lucide React) for all iconography
- MUST maintain visual consistency through the defined design system

**Rationale**: A social platform's value comes entirely from its users. Technical excellence means
nothing if the product doesn't serve people effectively. Professional iconography ensures a polished,
trustworthy appearance that builds user confidence.

### IV. Incremental Delivery

Features MUST be designed for incremental rollout. Each increment MUST deliver testable user value
independently.

**Non-negotiables**:
- MUST structure user stories as independently testable slices
- MUST deploy and validate each increment before starting the next
- MUST NOT block feature delivery waiting for "complete" solutions
- MUST enable feature flags for gradual rollouts where appropriate
- MUST maintain backward compatibility within a feature's increments

**Rationale**: Social features need rapid feedback from real users. Shipping smaller increments
enables faster learning and reduces risk of building the wrong thing.

### V. Flexible Testing

Test coverage MUST be proportional to risk and complexity. Testing approach varies by feature
characteristics rather than following rigid rules.

**Non-negotiables**:
- MUST test critical user paths (authentication, data mutations, payments if applicable)
- MUST NOT skip tests for code that handles user data or security
- MUST write tests when they prevent regressions in complex logic
- SHOULD prefer integration tests over unit tests for UI components
- SHOULD use end-to-end tests for critical user journeys
- MAY skip tests for simple, low-risk utilities when cost exceeds benefit

**Rationale**: Rigid TDD can slow iteration without proportional benefit. Smart testing focuses
effort where it prevents real problems.

## Technology Guidelines

**Stack**: Next.js with TypeScript

**Boundaries**:
- Frontend and backend code coexist in Next.js app structure
- API routes live in `app/api/` or `pages/api/`
- Shared types MUST be centralized (e.g., `types/` directory)
- External service integrations MUST be isolated behind adapter interfaces

**Performance expectations**:
- Initial page load MUST feel instant (target <3s on 3G)
- Social interactions (likes, comments, follows) MUST respond within 200ms perceived
- Real-time features SHOULD use optimistic updates

**Constraints**:
- MUST support modern browsers (last 2 versions)
- SHOULD support mobile viewports as primary experience

## Development Workflow

**Code quality gates**:
- All code MUST pass TypeScript strict mode checks
- All code MUST pass linting (ESLint with Next.js recommended rules)
- All code MUST be formatted consistently (Prettier)
- All PRs MUST be reviewed before merge

**Branch strategy**:
- Feature branches follow `###-feature-name` naming convention
- Main branch MUST always be deployable
- Feature branches MUST be up-to-date with main before merge

**Documentation**:
- Public APIs and complex logic MUST have inline documentation
- README MUST contain setup instructions
- Architecture decisions SHOULD be documented in specs

## Governance

This constitution establishes the non-negotiable principles for Vizu development. All features,
pull requests, and technical decisions MUST comply with these principles.

**Amendment process**:
1. Propose changes via documented discussion (issue or RFC)
2. Changes require explicit justification
3. Breaking changes to principles require migration plan
4. Update version according to semantic versioning

**Compliance verification**:
- Code reviews MUST verify principle adherence
- Constitution Check in implementation plans MUST pass before development
- Violations MUST be documented and justified in Complexity Tracking

**Version**: 1.0.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2025-12-29
