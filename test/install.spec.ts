import { h } from 'vue'
import { createStore, install } from '../src'
import { mount } from '@vue/test-utils'

function create() {
  return createStore({
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
      reset(state) {
        state.count.value = 0
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
    $store: typeof store
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

  expect(vm.vm.$store.count.value).toBe(0)
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $foo: typeof store
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
      plugins: [[{ install }, { store, storeKey: '$foo' }]],
    },
  })

  store.mutations.increment()

  expect(vm.vm.$foo.count.value).toBe(1)
  expect(() => vm.vm.$store.count.value).toThrow()
})