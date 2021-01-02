import { nextTick, reactive, toRefs, watch } from 'vue'
import { createStore } from '../src'

it('can create store with state', () => {
  createStore({
    state: {
      count: 0,
    },
  })
})

it('can not create store without state', () => {
  // @ts-expect-error
  expect(() => createStore({})).toThrow()
})

it('state should be readonly', () => {
  const store = createStore({
    state: {
      count: 0,
    },
  })
  // @ts-expect-error
  store.state.count++
})

it('state should be reactive', async () => {
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

  const { count } = toRefs(store.state)
  expect(count.value).toBe(0)

  store.mutations.increment()
  expect(count.value).toBe(1)

  const handler = jest.fn()
  watch(() => store.state.count, handler)
  store.mutations.increment()
  await nextTick()
  expect(handler).toBeCalled()
  expect(handler.mock.calls[0].slice(0, 2)).toEqual([2, 1])
})

it('can reactive with existing reactivity object', async () => {
  const originalState = reactive({
    count: 0,
  })
  const store = createStore({
    state: originalState,
    mutations: {
      increment({ state }) {
        ++state.count
      },
    },
  })

  expect(store.state.count).toBe(0)
  expect(originalState.count).toBe(0)

  store.mutations.increment()
  expect(store.state.count).toBe(1)
  expect(originalState.count).toBe(1)

  ++originalState.count
  expect(store.state.count).toBe(2)
  expect(originalState.count).toBe(2)

  const handler = jest.fn()
  watch(() => store.state.count, handler)
  store.mutations.increment()
  await nextTick()
  expect(handler).toBeCalled()
  expect(handler.mock.calls[0].slice(0, 2)).toEqual([3, 2])

  const handler2 = jest.fn()
  watch(() => store.state.count, handler2)
  ++originalState.count
  await nextTick()
  expect(handler2).toBeCalled()
  expect(handler2.mock.calls[0].slice(0, 2)).toEqual([4, 3])
})

it('getters should be computed', () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {
      double: ({ state }) => state.count * 2,
    },
  })
})

it('getters should be readonly', () => {
  const spy = jest.spyOn(global.console, 'warn').mockImplementation()

  const store = createStore({
    state: {
      count: 0,
    },
    getters: {
      double: ({ state }) => state.count * 2,
    },
  })
  // @ts-expect-error
  store.getters.double++
  expect(spy.mock.calls.length).toBe(1)

  spy.mockRestore()
})

it("getters' state parameter should be readonly", () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {
      // @ts-expect-error
      mutate: state => state.count++,
    },
  })
})

it("getters' state parameter should only have state types", () => {
  createStore({
    state: {},
    getters: {
      // @ts-expect-error
      mutate: state => state.count,
    },
  })
})

it('computed should be reactive', async () => {
  const store = createStore({
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
    },
  })

  const { double } = toRefs(store.getters)
  expect(double.value).toBe(0)

  store.mutations.increment()
  expect(double.value).toBe(2)

  const handler = jest.fn()
  watch(() => store.getters.double, handler)
  store.mutations.increment()
  await nextTick()
  expect(handler).toBeCalled()
  expect(handler.mock.calls[0].slice(0, 2)).toEqual([4, 2])
})

it('can create store with mutations', () => {
  createStore({
    state: {
      count: 0,
    },
    mutations: {
      increment({ state }) {
        ++state.count
      },
    },
  })
})

it("mutations's state parameter should only have state types", () => {
  createStore({
    state: {},
    mutations: {
      increment(state) {
        // @ts-expect-error
        state.count
      },
    },
  })
})

it('mutation should auto bind state to mutations', () => {
  const store = createStore({
    state: {
      count: 0,
    },
    mutations: {
      increment({ state }) {
        state.count
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
    mutations: {
      increment({ state }, payload: number) {
        state.count = payload
      },
    },
  })

  store.mutations.increment(42)
  expect(store.state.count).toBe(42)
})
