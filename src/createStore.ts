import { ref, computed, Ref, isReactive, toRefs, DeepReadonly, UnwrapRef, readonly, reactive } from 'vue'
import { getOwnKeys, assert, OmitFirst, isPlainObject } from './util'

/**
 * @alpha
 */
export type StateOption = {
  [P: string]: unknown
}

/**
 * @alpha
 */
export type StateType<S extends StateOption> = Ref<
  {
    [P in keyof S]: S[P]
  }
>

/**
 * @alpha
 */
export type StateReturnType<S extends StateOption> = DeepReadonly<
  {
    [P in keyof S]: S[P]
  }
>

/**
 * @alpha
 */
export type GettersOption<S extends StateOption> = {
  [P: string]: (state: StateReturnType<S>) => unknown
}

/**
 * @alpha
 */
export type GettersReturnType<G extends GettersOption<any>> = DeepReadonly<
  {
    [P in keyof G]: ReturnType<G[P]>
  }
>

/**
 * @alpha
 */
export type MutationsOption<S extends StateOption> = {
  [P: string]: (state: S, ...payload: any[]) => void
}

/**
 * @alpha
 */
export type MutationsReturnType<M extends MutationsOption<any>> = {
  [P in keyof M]: (...args: OmitFirst<Parameters<M[P]>>) => void
}

/**
 * @alpha
 */
export type Subscriber = (mutation: { key: string; payloads: unknown[] }) => void

/**
 * @alpha
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
 * @alpha
 */
export function createStore<
  State extends StateOption,
  Getters extends GettersOption<State>,
  Mutations extends MutationsOption<State>
>(options: {
  state: State
  getters?: Getters
  mutations?: Mutations
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
        const getter = computed(() => optionGetters[getterKey](state.value as DeepReadonly<State>))
        return Object.assign(getters, { [getterKey]: getter })
      }, {}),
    ),
  ) as GettersReturnType<Getters>

  const optionMutations = options.mutations || ({} as Mutations)
  const mutations = getOwnKeys(optionMutations).reduce((mutations, mutationKey) => {
    const mutation = (...payloads: unknown[]) => {
      optionMutations[mutationKey](state.value, ...payloads)
      subscribers.forEach(subscriber => subscriber.call(null, { key: mutationKey as string, payloads }))
    }
    return Object.assign(mutations, { [mutationKey]: mutation })
  }, {}) as MutationsReturnType<Mutations>

  const subscribers: Subscriber[] = []
  const subscribe = function (subscriber: Subscriber) {
    subscribers.push(subscriber)
  }

  const replaceState = function (newState: UnwrapRef<typeof state>) {
    getOwnKeys(newState).forEach(key => {
      ;(state.value as any)[key].value = newState[key]
    })
  }

  return {
    state: state.value as StateReturnType<State>,
    getters,
    mutations,
    subscribe,
    replaceState,
  }
}
