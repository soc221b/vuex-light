import { createStore, createPersistPlugin } from 'vuex-light'

const store = createStore({
  state: {
    count: 0,
  },
  getters: {
    double: state => state.count.value * 2,
  },
  mutations: {
    increment(state) {
      ++state.count.value
    },
    // with payload
    add(state, offset: number) {
      state.count.value += offset
    },
  },
})
createPersistPlugin()(store)
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
