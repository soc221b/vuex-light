import { createStore } from 'vuex-light'

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
  },
})

export function useStore() {
  return store
}

export default store
