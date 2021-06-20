import { createStore } from 'vuex-light'

const store = createStore(
  {
    count: 0,
  },
  {
    isOdd: ({ state }) => state.count % 2,
    evenOrOdd: ({ getters }) => (getters.isOdd ? 'odd' : 'even'),
  },
  {
    increment({ state }) {
      state.count++
    },
    decrement({ state }) {
      state.count--
    },
  },
  {
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
)

export function useStore() {
  return store
}
