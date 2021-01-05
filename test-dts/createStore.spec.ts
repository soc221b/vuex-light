import { expectType, TypeEqual } from 'ts-expect'
import { createStore } from '../src'

it('state', () => {
  const store = createStore({
    state: {
      count: 0,
    },
  })

  expectType<TypeEqual<number, typeof store.state.count>>(true)
  expectType<TypeEqual<any, typeof store.state.count>>(false)
  // @ts-expect-error
  store.state.count = 0
  // @ts-expect-error
  store.state.notExists
  // @ts-expect-error
  store.state.notExists = 0
})

it("state as getter's param", () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {
      double({ state }) {
        expectType<TypeEqual<number, typeof state.count>>(true)
        expectType<TypeEqual<any, typeof state.count>>(false)
        // @ts-expect-error
        state.count = 0
        // @ts-expect-error
        state.notExists
        // @ts-expect-error
        state.notExists = 0
      },
    },
  })
})

it("getter as getter's param", () => {
  createStore({
    state: {},
    getters: {
      double({ getters }) {
        expectType<TypeEqual<any, typeof getters>>(true)
      },
    },
  })
})

it('getter', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation()

  const store = createStore({
    state: {},
    getters: {
      double() {
        return 0
      },
    },
  })

  expectType<TypeEqual<number, typeof store.getters.double>>(true)
  expectType<TypeEqual<any, typeof store.getters.double>>(false)
  // @ts-expect-error
  store.getters.double = 0
  // @ts-expect-error
  store.getters.notExists
  // @ts-expect-error
  store.getters.notExists = 0

  spy.mockRestore()
})

it("state as mutation's param", () => {
  createStore({
    state: {
      count: 0,
    },
    mutations: {
      increment({ state }) {
        expectType<TypeEqual<number, typeof state.count>>(true)
        expectType<TypeEqual<any, typeof state.count>>(false)
        state.count = 0
        // @ts-expect-error
        state.notExists
        // @ts-expect-error
        state.notExists = 0
      },
    },
  })
})

it("getter as mutation's param", () => {
  createStore({
    state: {},
    getters: {
      double: () => 0,
    },
    mutations: {
      increment({ getters }) {
        expectType<TypeEqual<number, typeof getters.double>>(true)
        // TODO
        // expectType<TypeEqual<any, typeof getters.double>>(false)
        // TODO: @ts-expect-error
        getters.double = 0
        // TODO: @ts-expect-error
        getters.notExists
        // TODO: @ts-expect-error
        getters.notExists = 0
      },
    },
  })
})

it("mutation as mutation's param", () => {
  createStore({
    state: {},
    mutations: {
      increment({ mutations }) {
        expectType<TypeEqual<any, typeof mutations.notExists>>(true)
      },
    },
  })
})

it('mutation', () => {
  const store = createStore({
    state: {},
    mutations: {
      increment() {},
    },
  })

  expectType<TypeEqual<() => void, typeof store.mutations.increment>>(true)
  expectType<TypeEqual<any, typeof store.mutations.increment>>(false)
  // @ts-expect-error
  store.mutations.increment(0)
  // @ts-expect-error
  store.mutations.increment = () => {}
  // @ts-expect-error
  store.mutations.notExists
  // @ts-expect-error
  store.mutations.notExists = () => {}
})

it('mutation with payload', () => {
  const store = createStore({
    state: {},
    mutations: {
      incrementByNumberIf({}, _number: number, _condition: boolean) {},
    },
  })

  expectType<TypeEqual<(number: number, condition: boolean) => void, typeof store.mutations.incrementByNumberIf>>(true)
  expectType<TypeEqual<(number: number) => void, typeof store.mutations.incrementByNumberIf>>(false)
  expectType<
    TypeEqual<(number: number, condition: boolean, notExists: any) => void, typeof store.mutations.incrementByNumberIf>
  >(false)
})

it("state as action's param", () => {
  createStore({
    state: {
      count: 0,
    },
    actions: {
      increment({ state }) {
        expectType<TypeEqual<number, typeof state.count>>(true)
        expectType<TypeEqual<any, typeof state.count>>(false)
        // @ts-expect-error
        state.count = 0
        // @ts-expect-error
        state.notExists
        // @ts-expect-error
        state.notExists = 0
      },
    },
  })
})

it("getters as action's param", () => {
  createStore({
    state: {},
    getters: {
      double: () => 0,
    },
    actions: {
      increment({ getters }) {
        expectType<TypeEqual<number, typeof getters.double>>(true)
        // TODO
        // expectType<TypeEqual<any, typeof getters.double>>(false)
        // TODO: @ts-expect-error
        getters.double = 0
        // TODO: @ts-expect-error
        getters.notExists
        // TODO: @ts-expect-error
        getters.notExists = 0
      },
    },
  })
})

it("mutations as action's param", () => {
  createStore({
    state: {},
    mutations: {
      increment() {},
    },
    actions: {
      increment({ mutations }) {
        expectType<TypeEqual<() => void, typeof mutations.increment>>(true)
        // TODO: @ts-expect-error
        mutations.increment('notExists')
        // @ts-expect-error
        mutations.increment = () => {}
        // TODO: @ts-expect-error
        mutations.notExists
        // @ts-expect-error
        mutations.notExists = () => {}
      },
    },
  })
})

it("mutations with payload as action's param", () => {
  createStore({
    state: {},
    mutations: {
      incrementByNumberIf({}, _number: number, _condition: boolean) {},
    },
    actions: {
      increment({ mutations }) {
        expectType<TypeEqual<(number: number, condition: boolean) => void, typeof mutations.incrementByNumberIf>>(true)
        // TODO: @ts-expect-error
        mutations.incrementByNumberIf(0)
        // TODO: @ts-expect-error
        mutations.incrementByNumberIf(0, false, 'notExists')
      },
    },
  })
})

it("action as action's param", () => {
  createStore({
    state: {},
    actions: {
      increment({ actions }) {
        expectType<TypeEqual<any, typeof actions.increment>>(true)
      },
    },
  })
})

it('action', () => {
  const store = createStore({
    state: {},
    actions: {
      increment() {},
    },
  })

  expectType<TypeEqual<() => void, typeof store.actions.increment>>(true)
  // @ts-expect-error
  store.actions.increment('notExists')
  // @ts-expect-error
  store.actions.increment = () => {}
  // @ts-expect-error
  store.actions.notExists
  // @ts-expect-error
  store.actions.notExists = () => {}
})

it('action with payload', () => {
  const store = createStore({
    state: {},
    actions: {
      incrementByNumberIf({}, _number: number, _condition: boolean) {},
    },
  })

  expectType<TypeEqual<(number: number, condition: boolean) => void, typeof store.actions.incrementByNumberIf>>(true)
  expectType<TypeEqual<(number: number) => void, typeof store.actions.incrementByNumberIf>>(false)
  expectType<
    TypeEqual<(number: number, condition: boolean, notExists: any) => void, typeof store.actions.incrementByNumberIf>
  >(false)
})
