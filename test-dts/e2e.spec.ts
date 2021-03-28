import { expectType, TypeEqual } from 'ts-expect'
import { createStore, createPersistPlugin, createLoggerPlugin } from '../src'

it('e2e', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation()

  // =========================================================================
  // createStore
  // =========================================================================
  const store = createStore({
    state: {
      count: 0,
    },

    getters: {
      double({ state, getters }) {
        expectType<TypeEqual<number, typeof state.count>>(true)
        expectType<TypeEqual<any, typeof state.count>>(false)
        // @ts-expect-error
        state.count = 0
        // @ts-expect-error
        state.notExists
        // @ts-expect-error
        state.notExists = 0

        expectType<TypeEqual<any, typeof getters>>(true)

        return state.count * 2
      },
    },

    mutations: {
      increment() {},
      incrementByNumberIf({ state, getters, mutations }, _number: number, _condition: boolean) {
        expectType<TypeEqual<number, typeof state.count>>(true)
        expectType<TypeEqual<any, typeof state.count>>(false)
        state.count = 0
        // @ts-expect-error
        state.notExists
        // @ts-expect-error
        state.notExists = 0

        expectType<TypeEqual<number, typeof getters.double>>(true)
        expectType<TypeEqual<any, typeof getters.double>>(false)
        // @ts-expect-error
        getters.double = 0
        // @ts-expect-error
        getters.notExists
        // @ts-expect-error
        getters.notExists = 0

        expectType<TypeEqual<any, typeof mutations.notExists>>(true)
      },
    },

    actions: {
      increment() {},
      incrementByNumberIf({ state, getters, mutations, actions }, _number: number, _condition: boolean) {
        expectType<TypeEqual<number, typeof state.count>>(true)
        expectType<TypeEqual<any, typeof state.count>>(false)
        // @ts-expect-error
        state.count = 0
        // @ts-expect-error
        state.notExists
        // @ts-expect-error
        state.notExists = 0

        expectType<TypeEqual<number, typeof getters.double>>(true)
        expectType<TypeEqual<any, typeof getters.double>>(false)
        // @ts-expect-error
        getters.double = 0
        // @ts-expect-error
        getters.notExists
        // @ts-expect-error
        getters.notExists = 0

        expectType<TypeEqual<() => void, typeof mutations.increment>>(true)
        // @ts-expect-error
        mutations.increment('notExists')
        // @ts-expect-error
        mutations.increment = () => {}
        // @ts-expect-error
        mutations.notExists
        // @ts-expect-error
        mutations.notExists = () => {}

        expectType<TypeEqual<(number: number, condition: boolean) => void, typeof mutations.incrementByNumberIf>>(true)
        // @ts-expect-error
        mutations.incrementByNumberIf(0)
        // @ts-expect-error
        mutations.incrementByNumberIf(0, false, 'notExists')

        expectType<TypeEqual<any, typeof actions.increment>>(true)
      },
    },

    plugins: [createLoggerPlugin({ logActions: false, logMutations: false }), createPersistPlugin()],

    modules: {
      module: createStore({
        state: {
          moduleCount: 0,
        },
      }),
    },
  })

  // =========================================================================
  // state
  // =========================================================================
  expectType<TypeEqual<number, typeof store.state.count>>(true)
  expectType<TypeEqual<any, typeof store.state.count>>(false)
  // @ts-expect-error
  store.state.count = 0
  // @ts-expect-error
  store.state.notExists
  // @ts-expect-error
  store.state.notExists = 0

  // =========================================================================
  // getters
  // =========================================================================
  expectType<TypeEqual<number, typeof store.getters.double>>(true)
  expectType<TypeEqual<any, typeof store.getters.double>>(false)
  // @ts-expect-error
  store.getters.double = 0
  // @ts-expect-error
  store.getters.notExists
  // @ts-expect-error
  store.getters.notExists = 0

  // =========================================================================
  // mutations
  // =========================================================================
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

  expectType<TypeEqual<(number: number, condition: boolean) => void, typeof store.mutations.incrementByNumberIf>>(true)
  expectType<TypeEqual<(number: number) => void, typeof store.mutations.incrementByNumberIf>>(false)
  expectType<
    TypeEqual<(number: number, condition: boolean, notExists: any) => void, typeof store.mutations.incrementByNumberIf>
  >(false)

  // =========================================================================
  // actions
  // =========================================================================
  expectType<TypeEqual<() => void, typeof store.actions.increment>>(true)
  // @ts-expect-error
  store.actions.increment('notExists')
  // @ts-expect-error
  store.actions.increment = () => {}
  // @ts-expect-error
  store.actions.notExists
  // @ts-expect-error
  store.actions.notExists = () => {}

  expectType<TypeEqual<(number: number, condition: boolean) => void, typeof store.actions.incrementByNumberIf>>(true)
  expectType<TypeEqual<(number: number) => void, typeof store.actions.incrementByNumberIf>>(false)
  expectType<
    TypeEqual<(number: number, condition: boolean, notExists: any) => void, typeof store.actions.incrementByNumberIf>
  >(false)

  // =========================================================================
  // modules
  // =========================================================================
  expectType<TypeEqual<number, typeof store.modules.module.state.moduleCount>>(true)

  spy.mockRestore()
})
