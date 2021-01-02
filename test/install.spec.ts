import { h } from 'vue'
import { createStore, install, defaultStoreKey } from '../src'
import { mount } from '@vue/test-utils'

function create() {
  return createStore({
    state: {
      count: 0,
    },
    getters: {
      double: ({ state }) => state.count * 2,
    },
    mutations: {
      increment({ state }) {
        ++state.count
      },
      reset({ state }) {
        state.count = 0
      },
    },
  })
}
let store: ReturnType<typeof create>

beforeEach(() => {
  store = create()
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    [defaultStoreKey]: typeof store
  }
}
it('should add to global properties', () => {
  const app = {
    render() {
      return h('div')
    },
  }

  const vm = mount(app, {
    global: {
      plugins: [[{ install }, { store }]],
    },
  })

  expect(vm.vm[defaultStoreKey].state.count).toBe(0)
})

const customStoreKey = '$foo'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    [customStoreKey]: typeof store
  }
}
it("should allow to customize global property's name", () => {
  const app = {
    render() {
      return h('div')
    },
  }

  const vm = mount(app, {
    global: {
      plugins: [[{ install }, { store, storeKey: customStoreKey }]],
    },
  })

  store.mutations.increment()

  expect(vm.vm[customStoreKey].state.count).toBe(1)
  expect(() => vm.vm[defaultStoreKey].state.count).toThrow()
})
