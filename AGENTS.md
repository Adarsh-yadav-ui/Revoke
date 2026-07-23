<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

<!-- BEGIN:project-schema-rules -->
# Project Data Model & Convex File Map

This is a workflow-automation app (Zapier/n8n-style). Before writing any
query, mutation, or feature touching data, **read this section** to know
which file already owns the logic you need — do not duplicate existing
functions or reinvent auth/ownership checks.

## Schema (`convex/schema.ts`)

| Table         | Purpose                                                              |
|---------------|-----------------------------------------------------------------------|
| `users`       | Mirrors the Clerk-authenticated user inside Convex.                  |
| `workflows`   | One row per automation a user builds (the graph container).          |
| `nodes`       | One row per node in a workflow's graph (trigger/action/AI step).     |
| `connections` | Edges between nodes (`sourceNodeId` → `targetNodeId`).               |
| `executions`  | One row per time a workflow actually runs.                           |
| `responses`   | One row per node, per execution — what that node produced that run.  |
| `credentials` | Per-user reusable secrets (Discord webhook, Slack token, API keys).  |

## File map — where logic already lives

- `convex/users.ts` — user CRUD, Clerk sync (`upsertFromClerk`,
  `deleteFromClerk`, `store`), and the shared auth helpers
  **`getCurrentUser`** / **`getCurrentUserOrThrow`**. **Always import these
  helpers rather than writing new `ctx.auth.getUserIdentity()` logic.**
- `convex/workflows.ts` — CRUD for workflows, scoped to the owning user.
- `convex/nodes.ts` — CRUD for nodes within a workflow; includes
  `assertWorkflowOwnership` used to gate access via the parent workflow.
- `convex/connections.ts` — CRUD for edges between nodes.
- `convex/executions.ts` — `startExecution` / `finishExecution` are
  `internalMutation` — **only call these from Inngest/server-side code**,
  never expose them to the client directly.
- `convex/responses.ts` — `recordResponse` is `internalMutation`, written
  by the execution engine as each node finishes. Query functions here are
  client-facing and read-only.
- `convex/credentials.ts` — CRUD for user secrets. `getCredentialInternal`
  is `internalQuery`, only for use inside Inngest execution logic — it
  bypasses per-user auth checks because the caller is the backend engine,
  not a request from that user.

## Rules for the agent

1. **Check the file map above before creating a new Convex file.** If a
   table already has a file, add functions there — don't scatter logic
   across new files.
2. **Ownership pattern:** every table below `workflows` is scoped through
   it. Any query/mutation touching `nodes`, `connections`, `executions`,
   or `responses` must verify the parent `workflow.userId` matches the
   current user (see `assertWorkflowOwnership` in `nodes.ts` /
   `connections.ts` as the reference implementation) — reuse or mirror
   that pattern, don't skip it.
3. **`internal*` functions are not client-callable.** Anything prefixed
   `internalMutation`/`internalQuery` (in `executions.ts`, `responses.ts`,
   `credentials.ts`) is meant to be called from Inngest functions via
   `ctx.runMutation(internal.<file>.<fn>, {...})` — never wire these
   directly to a client hook.
4. **`config` / `output` / `data` / `triggerPayload` fields are `v.any()`**
   by design (each node `type` has a different shape). Validate their
   actual shape with a per-node-type Zod schema in application code, not
   in the Convex schema.
5. **Data flow for a run:** `executions` (one row per run) →
   `responses` (one row per node per run) — the `responses` rows for a
   given `executionId` are what you reduce into a `{ [nodeId]: output }`
   context object to resolve `{{nodeId.path}}` template strings before
   running the next node.
6. When adding a new node integration (new external service), check
   `credentials.ts` first — secrets should go through the `credentials`
   table and be referenced by ID from `nodes.config`, not embedded
   directly in a node's config.
<!-- END:project-schema-rules -->