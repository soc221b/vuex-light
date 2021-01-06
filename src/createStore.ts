import { ref, computed, Ref, isReactive, toRefs, UnwrapRef, readonly, reactive } from 'vue'
import { getOwnKeys, assert, OmitFirstParameter, isPlainObject } from './util'

/**
 * @public
 */
export type StateOption = {
  [P: string]: any
}

/**
 * @public
 */
export type StateType<S extends StateOption> = Ref<S>

/**
 * @public
 */
export type StateReturnType<S extends StateOption> = {
  readonly [P in keyof S]: S[P]
}

/**
 * @public
 */
export type GettersOption<S extends StateOption> = {
  [P: string]: ({ state, getters }: { state: StateReturnType<S>; getters: any }) => any
}

/**
 * @public
 */
export type GettersReturnType<G extends GettersOption<any>> = {
  readonly [P in keyof G]: ReturnType<G[P]>
}

/**
 * @public
 */
export type MutationsOption<S extends StateOption, G extends GettersOption<S>> = {
  [P: string]: (
    { state, getters, mutations }: { state: S; getters: GettersReturnType<G>; mutations: any },
    ...payloads: any[]
  ) => void
}

/**
 * @public
 */
export type MutationsReturnType<M extends MutationsOption<any, any>> = {
  readonly [P in keyof M]: OmitFirstParameter<M[P]>
}

/**
 * @public
 */
export type ActionsOption<S extends StateOption, G extends GettersOption<S>, M extends MutationsOption<S, G>> = {
  [P: string]: (
    {
      state,
      getters,
      mutations,
    }: {
      state: StateReturnType<S>
      getters: GettersReturnType<G>
      mutations: MutationsReturnType<M>
      actions: any
    },
    ...payloads: any[]
  ) => void
}

/**
 * @public
 */
export type ActionsReturnType<A extends ActionsOption<any, any, any>> = {
  readonly [P in keyof A]: OmitFirstParameter<A[P]>
}

/**
 * @public
 */
export type Subscriber = (mutation: { key: string; payloads: unknown[] }) => void

/**
 * @public
 */
export type ActionSubscriber = (action: { key: string; payloads: unknown[] }) => void

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
  Mutations extends MutationsOption<State, Getters>,
  Actions extends ActionsOption<State, Getters, Mutations>
> = {
  state: StateReturnType<State>
  getters: GettersReturnType<Getters>
  mutations: MutationsReturnType<Mutations>
  actions: ActionsReturnType<Actions>
  subscribe: (subscriber: Subscriber) => void
  actionSubscribe: (subscriber: ActionSubscriber) => void
  replaceState: (newState: UnwrapRef<StateType<State>>) => void
}

/**
 * @public
 */
export function createStore<
  State extends StateOption,
  Getters extends GettersOption<State>,
  Mutations extends MutationsOption<State, Getters>,
  Actions extends ActionsOption<State, Getters, Mutations>
>(options: {
  state: State
  getters?: Getters
  mutations?: Mutations
  actions?: Actions
  plugins?: Plugin<CreateStoreReturnType<State, Getters, Mutations, Actions>>[]
}): CreateStoreReturnType<State, Getters, Mutations, Actions> {
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
      getOwnKeys(optionGetters).reduce((rawGetters, getterKey) => {
        const getter = computed(() => optionGetters[getterKey]({ state: state.value, getters }))
        return Object.assign(rawGetters, { [getterKey]: getter })
      }, {}),
    ),
  ) as GettersReturnType<Getters>

  const optionMutations = options.mutations || ({} as Mutations)
  const mutations = getOwnKeys(optionMutations).reduce((mutations, mutationKey) => {
    const mutation = (...payloads: unknown[]) => {
      optionMutations[mutationKey]({ state: state.value, getters, mutations }, ...payloads)
      subscribers.forEach(subscriber => subscriber.call(null, { key: mutationKey as string, payloads }))
    }
    return Object.assign(mutations, { [mutationKey]: mutation })
  }, {}) as MutationsReturnType<Mutations>

  const optionActions = options.actions || ({} as Actions)
  const actions = getOwnKeys(optionActions).reduce((actions, actionKey) => {
    const action = (...payloads: unknown[]) => {
      actionSubscribers.forEach(subscriber => subscriber.call(null, { key: actionKey as string, payloads }))
      optionActions[actionKey](
        {
          state: state.value,
          getters,
          mutations,
          actions,
        },
        ...payloads,
      )
    }
    return Object.assign(actions, { [actionKey]: action })
  }, {}) as ActionsReturnType<Actions>

  const subscribers: Subscriber[] = []
  const subscribe = function (subscriber: Subscriber) {
    subscribers.push(subscriber)
  }

  const actionSubscribers: ActionSubscriber[] = []
  const actionSubscribe = function (subscriber: ActionSubscriber) {
    actionSubscribers.push(subscriber)
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
    state: state.value,
    getters,
    mutations,
    actions,
    subscribe,
    actionSubscribe,
    replaceState,
  }

  const optionPlugins = options.plugins || []
  optionPlugins.forEach(plugin => plugin(store))

  return store
}
