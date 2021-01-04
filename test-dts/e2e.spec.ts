import { expectType, expectError } from './util'
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
        expectType<number>(state.count)
        // @ts-expect-error
        expectError(state.count++)
        // @ts-expect-error
        expectError<void>(state.count)
        // @ts-expect-error
        expectError(state.notExists)
        // @ts-expect-error
        expectError((state.notExists = false))

        expectType<any>(getters.notExists)

        return state.count * 2
      },
    },

    mutations: {
      incrementByNumberIf({ state, getters, mutations }, _number: number, _condition: boolean) {
        expectType<number>(state.count)
        expectType(state.count++)
        // @ts-expect-error
        expectError<void>(state.count)
        // @ts-expect-error
        expectError(state.notExists)
        // @ts-expect-error
        expectError((state.notExists = false))

        expectType<number>(getters.double)
        // @ts-expect-error
        expectError(getters.double++)
        // @ts-expect-error
        expectError<void>(getters.double)
        // TODO: @ts-expect-error
        // expectError(getters.notExists)
        // @ts-expect-error
        expectError((getters.notExists = false))

        expectType<any>(mutations.notExists)
      },
    },

    actions: {
      incrementByNumberIf({ state, getters, mutations, actions }, _number: number, _condition: boolean) {
        expectType<number>(state.count)
        // @ts-expect-error
        expectError(state.count++)
        // @ts-expect-error
        expectError<void>(state.count)
        // @ts-expect-error
        expectError(state.notExists)
        // @ts-expect-error
        expectError((state.notExists = false))

        expectType<boolean>(getters.double)
        // @ts-expect-error
        expectError((getters.double = false))
        // @ts-expect-error
        expectError<void>(getters.double)
        // TODO: @ts-expect-error
        // expectError(getters.notExists)
        // @ts-expect-error
        expectError((getters.notExists = false))

        expectType<(number: number, condition: boolean) => void>(mutations.incrementByNumberIf)
        // TODO: @ts-expect-error
        // expectError<(number: void, condition: boolean) => void>(mutations.incrementByNumberIf)
        // TODO: @ts-expect-error
        // expectError<(number: number, condition: void) => void>(mutations.incrementByNumberIf)
        // @ts-expect-error
        expectError<(number: number, condition: boolean) => never>(mutations.incrementByNumberIf)
        // TODO: @ts-expect-error
        // mutations.incrementByNumberIf(0, false, 'notExists')

        expectType<any>(actions.notExists)
      },
    },

    plugins: [createLoggerPlugin({ logActions: false, logMutations: false }), createPersistPlugin()],
  })

  // =========================================================================
  // state
  // =========================================================================
  expectType<number>(store.state.count)
  // @ts-expect-error
  expectError(store.state.count++)
  // @ts-expect-error
  expectError<void>(store.state.count)
  // @ts-expect-error
  expectError(store.state.notExists)
  // @ts-expect-error
  expectError((store.state.notExists = 0))

  // =========================================================================
  // getters
  // =========================================================================
  expectType<number>(store.getters.double)
  // @ts-expect-error
  expectError(store.getters.double++)
  // @ts-expect-error
  expectError<void>(store.getters.double)
  // @ts-expect-error
  expectError(store.getters.notExists)
  // @ts-expect-error
  expectError((store.getters.notExists = 0))

  // =========================================================================
  // mutations
  // =========================================================================
  expectType<(number: number, condition: boolean) => void>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: void, condition: boolean) => void>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: void) => void>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: boolean) => never>(store.mutations.incrementByNumberIf)
  // @ts-expect-error
  store.mutations.incrementByNumberIf(0, false, 'notExists')

  // =========================================================================
  // actions
  // =========================================================================
  expectType<(number: number, condition: boolean) => void>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: void, condition: boolean) => void>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: void) => void>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  expectError<(number: number, condition: boolean) => never>(store.actions.incrementByNumberIf)
  // @ts-expect-error
  store.actions.incrementByNumberIf(0, false, 'notExists')

  spy.mockRestore()
})
