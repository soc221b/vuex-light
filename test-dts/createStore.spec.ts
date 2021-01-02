import { expectType, expectError } from './util'
import { createStore } from '../src'

it('state', () => {
  const store = createStore({
    state: {
      count: 0,
    },
  })

  expectType<number>(store.state.count)
  // @ts-expect-error
  expectError(store.state.count++)
  // @ts-expect-error
  expectError<void>(store.state.count)
  // @ts-expect-error
  expectError(store.state.notExists)
  // @ts-expect-error
  expectError((store.state.notExists = 0))
})

it("state as getter's param", () => {
  createStore({
    state: {
      count: 0,
    },
    getters: {
      double({ state }) {
        expectType<number>(state.count)
        // @ts-expect-error
        expectError(state.count++)
        // @ts-expect-error
        expectError<void>(state.count)
        // @ts-expect-error
        expectError(state.notExists)
        // @ts-expect-error
        expectError((state.notExists = false))
      },
    },
  })
})

it("getter as getter's param", () => {
  createStore({
    state: {},
    getters: {
      double: () => 2,
      doubleDouble({ getters }) {
        expectType<any>(getters.double)
      },
    },
  })
})

it('getter', () => {
  const store = createStore({
    state: {},
    getters: {
      double() {
        return 0
      },
    },
  })

  expectType<number>(store.getters.double)
  // @ts-expect-error
  expectError(store.getters.double++)
  // @ts-expect-error
  expectError<void>(store.getters.double)
  // @ts-expect-error
  expectError(store.getters.notExists)
  // @ts-expect-error
  expectError((store.getters.notExists = 0))
})

it("state as mutation's param", () => {
  createStore({
    state: {
      count: 0,
    },
    mutations: {
      increment({ state }) {
        expectType<number>(state.count)
        expectType(state.count++)
        // @ts-expect-error
        expectError<void>(state.count)
        // @ts-expect-error
        expectError(state.notExists)
        // @ts-expect-error
        expectError((state.notExists = false))
      },
    },
  })
})

it("getter as mutation's param", () => {
  createStore({
    state: {},
    getters: {
      double: () => 2,
    },
    mutations: {
      increment({ getters }) {
        expectType<number>(getters.double)
        // @ts-expect-error
        expectType(getters.double++)
        // @ts-expect-error
        expectError<void>(getters.double)
        // @ts-expect-error
        expectError(getters.notExists)
        // @ts-expect-error
        expectError((getters.notExists = false))
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

  expectType<() => void>(store.mutations.increment)
  // @ts-expect-error
  store.mutations.increment(0)
  // @ts-expect-error
  expectError<() => never>(store.mutations.increment)
  // @ts-expect-error
  expectError((store.mutations.increment = () => {}))
  // @ts-expect-error
  expectError(store.mutations.notExists)
  // @ts-expect-error
  expectError((store.mutations.notExists = () => {}))
})

it('mutation with payload', () => {
  const store = createStore({
    state: {},
    mutations: {
      incrementByNumberIf({}, _number: number, _condition: boolean) {},
    },
  })

  expectType<(number: number, condition: boolean) => void>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: void, condition: boolean) => void>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: void) => void>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: boolean) => never>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  store.mutations.incrementByNumberIf(0, false, 'notExists')
})

it("state as action's param", () => {
  createStore({
    state: {
      count: 0,
    },
    actions: {
      increment({ state }) {
        expectType<number>(state.count)
        // @ts-expect-error
        expectError(state.count++)
        // @ts-expect-error
        expectError<void>(state.count)
        // @ts-expect-error
        expectError(state.notExists)
        // @ts-expect-error
        expectError((state.notExists = false))
      },
    },
  })
})

it("getters as action's param", () => {
  createStore({
    state: {},
    getters: {
      isOdd: () => false,
    },
    actions: {
      incrementIfOdd({ getters }) {
        expectType<boolean>(getters.isOdd)
        // @ts-expect-error
        expectError((getters.isOdd = false))
        // @ts-expect-error
        expectError<void>(getters.isOdd)
        // @ts-expect-error
        expectError(getters.notExists)
        // @ts-expect-error
        expectError((getters.notExists = false))
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
        expectType<() => void>(mutations.increment)
        // @ts-expect-error
        expectError((mutations.increment = () => {}))
        // TODO: @ts-expect-error
        expectError<(payload: number) => void>(mutations.increment)
        // @ts-expect-error
        expectError<() => never>(mutations.increment)
        // TODO: @ts-expect-error
        // expectError(mutations.notExists)
        // @ts-expect-error
        expectError((mutations.notExists = () => {}))
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
        expectType<(number: number, condition: boolean) => void>(mutations.incrementByNumberIf)
        // TODO: @ts-expect-error
        // expectError<(number: void, condition: boolean) => void>(mutations.incrementByNumberIf)
        // TODO: @ts-expect-error
        // expectError<(number: number, condition: void) => void>(mutations.incrementByNumberIf)
        // @ts-expect-error
        expectError<(number: number, condition: boolean) => never>(mutations.incrementByNumberIf)
        // TODO: @ts-expect-error
        // mutations.incrementByNumberIf(0, false, 'notExists')
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

  expectType<() => void>(store.actions.increment)
  // @ts-expect-error
  store.actions.increment('notExists')
  // @ts-expect-error
  expectError<() => never>(store.actions.increment)
  // @ts-expect-error
  expectError((store.actions.increment = () => {}))
  // @ts-expect-error
  expectError(store.actions.notExists)
  // @ts-expect-error
  expectError((store.actions.notExists = () => {}))
})

it('action with payload', () => {
  const store = createStore({
    state: {},
    actions: {
      incrementByNumberIf({}, _number: number, _condition: boolean) {},
    },
  })

  expectType<(number: number, condition: boolean) => void>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: void, condition: boolean) => void>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: void) => void>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: boolean) => never>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  store.actions.incrementByNumberIf(0, false, 'notExists')
})
