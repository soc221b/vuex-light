import { createStore } from '../src'

it('can create store with state', () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {},
    mutations: {},
  })
})

it('can create store with computed state', () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {
      double: state => state.count.value * 2,
    },
    mutations: {},
  })
})

it("computed's state parameter should be readonly", () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {
      // @ts-expect-error
      mutate: state => state.count.value++,
    },
    mutations: {},
  })
})

it("computed's state parameter should only have state types", () => {
  createStore({
    state: {},
    getters: {
      // @ts-expect-error
      mutate: state => state.count.value,
    },
    mutations: {},
  })
})

it('computed should be reactive', () => {
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

  const double = store.double
  expect(double.value).toBe(0)

  store.mutations.increment()
  expect(double.value).toBe(2)
})

it('can create store with mutations', () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {},
    mutations: {
      increment(state) {
        ++state.count.value
      },
    },
  })
})

it("mutations's state parameter should only have state types", () => {
  createStore({
    state: {},
    getters: {},
    mutations: {
      increment(state) {
        // @ts-expect-error
        state.count.value
      },
    },
  })
})

it('mutation should auto bind state to mutations', () => {
  const store = createStore({
    state: {
      count: 0,
    },
    getters: {},
    mutations: {
      increment(state) {
        state.count.value
      },
    },
  })

  store.mutations.increment()
})

it('can pass payload to mutations', () => {
  const store = createStore({
    state: {
      count: 0,
    },
    getters: {},
    mutations: {
      increment(state, payload: number) {
        state.count.value = payload
      },
    },
  })

  store.mutations.increment(42)
  expect(store.count.value).toBe(42)
})
