import { nextTick, reactive, toRefs, watch } from 'vue'
import { createStore } from '../src'

it('can create store with state', () => {
  createStore({
    state: {
      count: 0,
    },
  })
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

  const handler2 = jest.fn()
  watch(() => count.value, handler2)
  store.mutations.increment()
  await nextTick()
  expect(handler2).toBeCalled()
  expect(handler2.mock.calls[0].slice(0, 2)).toEqual([3, 2])
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
  watch(() => originalState.count, handler)
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

it('can create store with getters', () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {
      double: () => 2,
    },
  })
})

it('getter should auto bind state and getters to mutations', () => {
  const store = createStore({
    state: {
      count: 0,
    },
    getters: {
      double: ({ state }) => state.count * 2,
      isDoubleGreaterThan4: ({ getters }) => getters.double > 4,
    },
    mutations: {
      increment({ state }) {
        ++state.count
      },
    },
  })

  store.mutations.increment()
  expect(store.getters.isDoubleGreaterThan4).toBe(false)

  store.mutations.increment()
  expect(store.getters.isDoubleGreaterThan4).toBe(false)

  store.mutations.increment()
  expect(store.getters.isDoubleGreaterThan4).toBe(true)
})

it('getter should be reactive', async () => {
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

it('mutation should auto bind state and getters to mutations', () => {
  const store = createStore({
    state: {
      count: 0,
    },
    getters: {
      isLessThan2: ({ state }) => state.count < 2,
    },
    mutations: {
      incrementIfLessThan2({ state, getters }) {
        if (getters.isLessThan2) {
          ++state.count
        }
      },
    },
  })

  store.mutations.incrementIfLessThan2()
  expect(store.state.count).toBe(1)

  store.mutations.incrementIfLessThan2()
  expect(store.state.count).toBe(2)

  store.mutations.incrementIfLessThan2()
  expect(store.state.count).toBe(2)
})

it('can pass payload to mutations', () => {
  const store = createStore({
    state: {
      count: 0,
    },
    mutations: {
      incrementByNumber({ state }, number: number) {
        state.count = number
      },
    },
  })

  store.mutations.incrementByNumber(42)
  expect(store.state.count).toBe(42)
})

it('should auto bind state, getters and mutations to actions', () => {
  const store = createStore({
    state: {
      count: 0,
    },
    getters: {
      isOdd: ({ state }) => state.count % 2 === 1,
    },
    mutations: {
      increment({ state }) {
        ++state.count
      },
    },
    actions: {
      incrementIfOddAndLessThan4({ state, getters, mutations }) {
        if (state.count >= 4) return
        if (getters.isOdd === false) return
        mutations.increment()
      },
    },
  })

  store.actions.incrementIfOddAndLessThan4()
  expect(store.state.count).toBe(0)

  store.mutations.increment()
  store.actions.incrementIfOddAndLessThan4()
  expect(store.state.count).toBe(2)

  store.mutations.increment()
  store.actions.incrementIfOddAndLessThan4()
  expect(store.state.count).toBe(4)

  store.mutations.increment()
  store.actions.incrementIfOddAndLessThan4()
  expect(store.state.count).toBe(5)
})
