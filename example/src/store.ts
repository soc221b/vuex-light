import { toRefs } from 'vue'
import { createStore, createPersistPlugin } from 'vuex-light'

const store = createStore({
  state: {
    count: 0,
  },
  getters: {
    double: state => state.count * 2,
  },
  mutations: {
    increment(state) {
      ++state.count
    },
    // with payload
    add(state, offset: number) {
      state.count += offset
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
  return {
    state: toRefs(store.state),
    getters: toRefs(store.getters),
    mutations: store.mutations,
  }
}
