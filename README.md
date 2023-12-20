# `vld-ts``
A fast, lightweight validation library for all platform.

```ts
import { t, vld } from 'vld-ts';

// Create a schema
const User = t.obj({
    name: t.str,
    age: t.num
});

// The type corresponding to the schema
export type User = Infer<typeof User>;

// Create a validation function from the type
export const check = vld(User); // (o: any) => User | null
```

