import { createStore } from 'vuex-light'

const store = createStore(
  {
    count: 0,
  },
  {},
  {
    increment({ state }) {
      ++state.count
    },
  },
)
export default store
