# vuex-light

# You might not need Vuex in Vue3

```ts
import { ref, readonly, watchEffect } from 'vue'

const StoreKey = '$store'

// encapsulate your state, mutations, etc. in a hook function
function useCount() {
  const count = ref(0)
  function increment() {
    ++count.value
  }
  return {
    count: readonly(count) as Readonly<typeof count>,
    increment,
  }
}

// and then create the store
const store =
  window.localStorage.getItem(StoreKey) !== null
    ? JSON.parse(window.localStorage.getItem(StoreKey)!)
    : {
        ...useCount(),
      }

// use plugins
function usePersistentStore<S>(store: S) {
  watchEffect(() => {
    window.localStorage.setItem(StoreKey, JSON.stringify(store))
  })
}

const plugins = [usePersistentStore]
plugins.forEach(plugin => plugin.call(null, store))

export default store
```

# Installation

via npm

```
yarn add vuex-light
```

via cdn

```html
<script src="https://unpkg.com/vuex-light@latest"></script>
```

# Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests to us.

# Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

# License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details
