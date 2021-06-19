# vuex-light

[![npm](https://img.shields.io/npm/v/vuex-light)](https://www.npmjs.com/package/vuex-light)
[![npm bundle size](https://img.shields.io/bundlephobia/min/vuex-light)](https://bundlephobia.com/result?p=vuex-light@latest)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/iendeavor/vuex-light/CI/main)](https://github.com/iendeavor/vuex-light/actions?query=workflow%3ACI+branch%3Amain+)
![npm downloads](https://img.shields.io/npm/dm/vuex-light)
![last commit](https://img.shields.io/github/last-commit/iendeavor/vuex-light/main)

## Why

Have you ever wanted to [have type-ahead feature or intelligense](https://github.com/vuejs/vuex/issues/564) when commit
a mutation or dispatch actions?

Have you want to use such a token which is saved in the store and you
[cannot inject `useStore` hook](https://github.com/vuejs/vuex/issues/1873) due to you aren't in setup lifecycle?

## Features

- :bulb: Better DX - consistent and intuitive interface
- :muscle: Robust typescript support
- VM agnostic - you can directly import and use it **anywhere**, no matter whether in `setup` lifecycle or not.

## Getting Started

### Setup

via npm

```
yarn add vuex-light
```

via cdn

```html
<script src="https://unpkg.com/vuex-light@latest"></script>
```

### Getting Started

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

   Example: [Hello world](https://codesandbox.io/s/github/iendeavor/vuex-light/tree/main/examples/hello-world)

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

   Example: [Counter](https://codesandbox.io/s/github/iendeavor/vuex-light/tree/main/examples/counter)

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

   Example: [Todo MVC](https://codesandbox.io/s/github/iendeavor/vuex-light/tree/main/examples/todomvc-vite)

## API

### Core

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
  // modules
  {
    module: createStore({
      moduleCount: 0,
    }),
  },
)

store.state.count
store.getters.isOdd
store.mutations.increment()
store.actions.incrementIfOdd()
store.modules.module.state.moduleCount
```

### Plugins

#### `createLoggerPlugin`

https://iendeavor.github.io/vuex-light/vuex-light.createloggerplugin.html

#### `createPersistPlugin`

https://iendeavor.github.io/vuex-light/vuex-light.createpersistplugin.html

## Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests to us.

### Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details
