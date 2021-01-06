import { createStore } from 'vuex-light'

const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    increment({ state }) {
      ++state.count
    },
  },
})
export default store
