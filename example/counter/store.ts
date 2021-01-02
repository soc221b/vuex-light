import { createStore } from 'vuex-light'

const store = createStore({
  state: {
    count: 0,
  },
  getters: {
    isOdd: ({ state }) => state.count % 2,
    evenOrOdd: ({ getters }) => (getters.isOdd ? 'odd' : 'even'),
  },
  mutations: {
    increment({ state }) {
      state.count++
    },
    decrement({ state }) {
      state.count--
    },
  },
  actions: {
    increment: ({ mutations }) => mutations.increment(),
    decrement: ({ mutations }) => mutations.decrement(),
    incrementIfOdd({ mutations, getters }) {
      if (getters.isOdd) {
        mutations.increment()
      }
    },
    incrementAsync({ mutations }) {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          mutations.increment()
          resolve()
        }, 1000)
      })
    },
  },
})
export default store

// define injection
export const storeKey = '$store'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    [storeKey]: typeof store
  }
}

// declare the `useStore` composition function
export function useStore() {
  return store
}
