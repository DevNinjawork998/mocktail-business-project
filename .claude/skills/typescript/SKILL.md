---
name: typescript-best-practices
description: TypeScript best practices for this Next.js project — strict typing, React component patterns, avoiding common mistakes with generics, type assertions, and SSR-safe code. Use when writing or reviewing TypeScript/TSX files.
argument-hint: "[question or file]"
---

# TypeScript Best Practices

## Strictness

The project uses `strict: true`. Never use `any` — use `unknown` for truly unknown shapes and narrow with type guards.

```ts
// Bad
function parse(data: any) { ... }

// Good
function parse(data: unknown): ParsedResult {
  if (typeof data !== "object" || data === null) throw new Error("invalid");
  ...
}
```

## Component Props

Always define explicit interfaces for component props. Don't use `React.FC` — use explicit return types.

```ts
// Bad
const MyComponent: React.FC<{ title: string }> = ({ title }) => ...

// Good
interface MyComponentProps {
  title: string;
  subtitle?: string;
}

export default function MyComponent({ title, subtitle }: MyComponentProps): React.ReactElement {
  ...
}
```

## Type Assertions

Avoid `as` except at system boundaries (API responses, JSON.parse, DOM). Never use `as any`.

```ts
// Bad
const user = data as User;

// Good — validate first
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}
```

## Non-Null Assertions

Avoid `!` (non-null assertion). Prefer explicit guards or optional chaining.

```ts
// Bad
const name = user!.name;

// Good
const name = user?.name ?? "Unknown";
```

## Enums

Avoid `enum` — use `as const` objects instead (they tree-shake better and behave more predictably).

```ts
// Bad
enum Role { ADMIN = "ADMIN", EDITOR = "EDITOR" }

// Good
const Role = { ADMIN: "ADMIN", EDITOR: "EDITOR" } as const;
type Role = (typeof Role)[keyof typeof Role];
```

## Server vs Client Type Safety

When passing data from server components (page.tsx) to client components (*PageClient.tsx), all props must be serializable — no class instances, no functions, no `Date` objects (use ISO strings instead).

```ts
// Bad — Date is not serializable across RSC boundary
interface Props { createdAt: Date }

// Good
interface Props { createdAt: string }  // ISO string, convert with .toISOString()
```

## Prisma Types

Don't re-define types that Prisma generates. Import from `@prisma/client`.

```ts
import type { Product, Ingredient } from "@prisma/client";
```

For partial shapes, use Prisma utility types:
```ts
import type { Prisma } from "@prisma/client";
type ProductWithIngredients = Prisma.ProductGetPayload<{
  include: { ingredients: true }
}>;
```

## Generic Constraints

Always constrain generics when the shape matters:

```ts
// Bad
function getFirst<T>(arr: T[]): T | undefined

// Good — communicates intent
function getFirst<T extends object>(arr: T[]): T | undefined
```

## Utility Types

Prefer built-in utility types over manual redefinition:
- `Partial<T>` — all fields optional
- `Required<T>` — all fields required
- `Pick<T, K>` — subset of fields
- `Omit<T, K>` — exclude fields
- `ReturnType<typeof fn>` — infer return type

## Type Narrowing Patterns

Use discriminated unions for state that has multiple shapes:

```ts
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

This pattern is already used in server actions (`result.success && result.data`). Follow it consistently.

## SSR Safety

Never assume browser globals exist — even in `"use client"` files, the file runs on the server during SSR. Always use `typeof window !== "undefined"` guards or (better) refactor to not need the API at all.

```ts
// Bad — crashes SSR
const parser = new DOMParser();

// Good — universal alternative
const text = htmlString.replace(/<[^>]*>/g, "").trim();
```

See the `browser-apis-ssr` memory for the full incident record.
