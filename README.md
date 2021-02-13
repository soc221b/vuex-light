# vuex-light

[![npm](https://img.shields.io/npm/v/vuex-light)](https://www.npmjs.com/package/vuex-light)
[![npm bundle size](https://img.shields.io/bundlephobia/min/vuex-light)](https://bundlephobia.com/result?p=vuex-light@latest)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/js-cosmos/vuex-light/CI/main)](https://github.com/js-cosmos/vuex-light/actions?query=workflow%3ACI+branch%3Amain+)
![npm downloads](https://img.shields.io/npm/dm/vuex-light)
![last commit](https://img.shields.io/github/last-commit/js-cosmos/vuex-light/main)

<p align="center">
  <a href="http://www.youtube.com/watch?v=bXR1VQWUd20" target="_blank">
    <img src="./screenshots/typing.png" alt="demo" width="720" />
  </a>
</p>

# Why

With _vuex_, you often want to know what **the payload** is and what **action type** is, but it always gives you the
**any** type:

<p align="center">
  <img src="./screenshots/vuex.png" alt="simple store" width="720">
</p>

But with _vuex-light_, you have full type inference:

<p align="center">
  <img src="./screenshots/vuex-light.png" alt="simple store" width="720">
</p>

# Features

- Robust typescript support :muscle:
- Consistent and intuitive interface :bulb:
- Implement with vue 3 reactivity system only
- Light weight

# Installation

via npm

```
yarn add vuex-light
```

via cdn

```html
<script src="https://unpkg.com/vuex-light@latest"></script>
```

# Getting Started

Create the simplest store:

```ts
// store.ts
import { createStore } from 'vuex-light'

// Create a new store instance.
export const store = createStore(
  // state
  {
    count: 0,
  },
  // getters
  {},
  // mutations
  {
    increment({ state }) {
      state.count++
    },
  },
)
```

Now, your can access the store by the following ways:

1. [globalProperty](https://v3.vuejs.org/api/application-config.html#globalproperties)

   ```ts
   // main.ts
   // Adds the $store property that can be accessed in any component instance inside the application.
   app.config.globalProperties.$store = store

   app.component('child-component', {
     mounted() {
       console.log(this.$store.state.count)
     },
   })
   ```

   Example: [Hello world](https://codesandbox.io/s/github/js-cosmos/vuex-light/tree/main/examples/hello-world)

2. [provide/inject](https://v3.vuejs.org/api/application-api.html#provide)

   ```ts
   // main.ts
   import { createApp } from 'vue'
   import { store } from './store'

   const app = createApp({
     inject: ['store'],
     template: `
       <div>
         {{ store.state.count }}
       </div>
     `,
   })

   // Sets the store that can be injected into all components within the application.
   app.provide('store', store)
   ```

   Example: [Counter](https://codesandbox.io/s/github/js-cosmos/vuex-light/tree/main/examples/counter)

3. useStore

   ```ts
   // store.ts
   // create the `useStore` composition function
   export function useStore() {
     return store
   }
   ```

   ```ts
   // in a vue component
   import { defineComponent } from 'vue'
   import { useStore } from './store'

   export default defineComponent({
     setup() {
       const { state, mutations } = useStore()

       return {
         state,
         mutations,
       }
     },
   })
   ```

   Example: [Todo MVC](https://codesandbox.io/s/github/js-cosmos/vuex-light/tree/main/examples/todomvc)

# Core API

```ts
const store = createStore(
  // state
  {
    count: 0,
  },
  // getters
  {
    isOdd({ state, getters }) {
      // ...
    },
  },
  // mutations
  {
    increment({ state, getters, mutations }, ...payloads) {
      // ...
    },
  },
  // actions
  {
    incrementIfOdd({ state, getters, mutations, actions }, ...payloads) {
      // ...
    },
  },
)

store.state.count
store.getters.isOdd
store.mutations.increment()
store.actions.incrementIfOdd()
```

# Plugins

## `createLoggerPlugin`

https://js-cosmos.github.io/vuex-light/vuex-light.createloggerplugin.html

## `createPersistPlugin`

https://js-cosmos.github.io/vuex-light/vuex-light.createpersistplugin.html

# Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests to us.

# Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

# License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details
