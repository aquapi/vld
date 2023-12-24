# `vld-ts`
A fast, lightweight validation library for every enviroment.
This library implements a subset of the JSON Schema Draft 7 with additional properties to improve performance.

## Usage
Install `vld-ts` using your favorite package manager:
```bash
# NPM
npm i vld-ts

# Yarn
yarn add vld-ts

# PNPM
pnpm add vld-ts

# Bun
bun add vld-ts
```

Code examples:
```ts
import { t, vld } from 'vld-ts';

// Use the schema builder
const Person = t.obj({
    name: t.str,
    age: t.num
});

// Compile the schema
const isPerson = vld(Person);

console.log(isPerson({ name: 'Reve', age: 15 })); // true
```
