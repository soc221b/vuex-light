import { ref, computed, Ref, isReactive, toRefs, DeepReadonly, UnwrapRef, readonly, reactive } from 'vue'
import { getOwnKeys, assert, OmitFirst, isPlainObject } from './util'

/**
 * @public
 */
export type StateOption = {
  [P: string]: unknown
}

/**
 * @public
 */
export type StateType<S extends StateOption> = Ref<
  {
    [P in keyof S]: S[P]
  }
>

/**
 * @public
 */
export type StateReturnType<S extends StateOption> = DeepReadonly<
  {
    [P in keyof S]: S[P]
  }
>

/**
 * @public
 */
export type GettersOption<S extends StateOption> = {
  [P: string]: ({ state, getters }: { state: StateReturnType<S>; getters: any }) => unknown
}

/**
 * @public
 */
export type GettersReturnType<G extends GettersOption<any>> = DeepReadonly<
  {
    [P in keyof G]: ReturnType<G[P]>
  }
>

/**
 * @public
 */
export type MutationsOption<S extends StateOption> = {
  [P: string]: (
    { state, getters }: { state: S; getters: GettersReturnType<GettersOption<S>> },
    ...payloads: any[]
  ) => void
}

/**
 * @public
 */
export type MutationsReturnType<M extends MutationsOption<any>> = {
  readonly [P in keyof M]: (...args: OmitFirst<Parameters<M[P]>>) => void
}

/**
 * @public
 */
export type Subscriber = (mutation: { key: string; payloads: unknown[] }) => void

/**
 * @public
 */
export type Plugin<Store> = (store: Store) => void

/**
 * @public
 */
export type CreateStoreReturnType<
  State extends StateOption,
  Getters extends GettersOption<State>,
  Mutations extends MutationsOption<State>
> = {
  state: StateReturnType<State>
  getters: GettersReturnType<Getters>
  mutations: MutationsReturnType<Mutations>
  subscribe: (subscriber: Subscriber) => void
  replaceState: (newState: UnwrapRef<StateType<State>>) => void
}

/**
 * @public
 */
export function createStore<
  State extends StateOption,
  Getters extends GettersOption<State>,
  Mutations extends MutationsOption<State>
>(options: {
  state: State
  getters?: Getters
  mutations?: Mutations
  plugins?: Plugin<CreateStoreReturnType<State, Getters, Mutations>>[]
}): CreateStoreReturnType<State, Getters, Mutations> {
  if (__DEV__) {
    assert(isPlainObject(options.state), 'invalid state type.')
  }

  const optionState = isReactive(options.state) ? toRefs(options.state) : options.state
  const state = ref(
    getOwnKeys(optionState).reduce((state, stateKey) => {
      return Object.assign(state, { [stateKey]: ref(optionState[stateKey]) })
    }, {}),
  ) as StateType<State>

  const optionGetters = options.getters || ({} as Getters)
  const getters = readonly(
    reactive(
      getOwnKeys(optionGetters).reduce((getters, getterKey) => {
        const getter = computed(() => optionGetters[getterKey]({ state: state.value as DeepReadonly<State>, getters }))
        return Object.assign(getters, { [getterKey]: getter })
      }, {}),
    ),
  ) as GettersReturnType<Getters>

  const optionMutations = options.mutations || ({} as Mutations)
  const mutations = getOwnKeys(optionMutations).reduce((mutations, mutationKey) => {
    const mutation = (...payloads: unknown[]) => {
      optionMutations[mutationKey]({ state: state.value, getters: getters as any }, ...payloads)
      subscribers.forEach(subscriber => subscriber.call(null, { key: mutationKey as string, payloads }))
    }
    return Object.assign(mutations, { [mutationKey]: mutation })
  }, {}) as MutationsReturnType<Mutations>

  const subscribers: Subscriber[] = []
  const subscribe = function (subscriber: Subscriber) {
    subscribers.push(subscriber)
  }

  const replaceState = function (newState: UnwrapRef<typeof state>) {
    getOwnKeys(state.value)
      .filter(key => newState[key as any] === undefined)
      .forEach(key => delete state.value[key])
    getOwnKeys(newState).forEach(key => {
      ;(state.value as any)[key] = newState[key]
    })
  }

  const store = {
    state: state.value as StateReturnType<State>,
    getters,
    mutations,
    subscribe,
    replaceState,
  }

  const optionPlugins = options.plugins || []
  optionPlugins.forEach(plugin => plugin(store))

  return store
}
