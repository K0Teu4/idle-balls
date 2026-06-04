---
name: Phaser 4 quirks
description: Non-obvious behavior differences in Phaser 4 vs 3
---

## Gravity config requires Vector2Like (both x and y)

In Phaser 4, the Matter.js gravity config requires a `Vector2Like` object:

```typescript
// WRONG — TypeScript error: Property 'x' is missing
matter: { gravity: { y: 1.5 } }

// CORRECT
matter: { gravity: { x: 0, y: 1.5 } }
```

**Why:** Phaser 4 tightened the type from `Partial<Vector2Like>` to `Vector2Like`, so x is required.

**How to apply:** Any time you configure Matter.js gravity in Phaser 4, always include both x and y.
