import { ref, computed, isReactive, Ref, toRefs, readonly, reactive } from 'vue'
import {
  getOwnKeys,
  assert,
  OmitFirstParameter,
  isPlainObject,
  ShallowReadonly,
  DeepReadonly,
  Func,
  AsyncFunc,
} from './util'

/**
 * @public
 */
export type StateOption = {
  [P: string]: any
}

/**
 * @public
 */
export type StateReturnType<StateOption> = DeepReadonly<StateOption>

/**
 * @public
 */
export type GettersOption<StateReturnType> = {
  [P: string]: ({ state, getters }: { state: StateReturnType; getters: any }) => any
}

/**
 * @public
 */
export type GettersReturnType<GettersOption extends { [P: string]: Func }> = DeepReadonly<
  {
    [P in keyof GettersOption]: ReturnType<GettersOption[P]>
  }
>

/**
 * @public
 */
export type MutationsOption<StateOption, GettersReturnType> = {
  [P: string]: (
    { state, getters, mutations }: { state: StateOption; getters: GettersReturnType; mutations: any },
    ...payloads: any[]
  ) => void
}

/**
 * @public
 */
export type MutationsReturnType<MutationsOption> = ShallowReadonly<
  {
    [P in keyof MutationsOption]: Exclude<OmitFirstParameter<MutationsOption[P]>, AsyncFunc>
  }
>

/**
 * @public
 */
export type ActionsOption<StateReturnType, GettersReturnType, MutationsReturnType> = {
  [P: string]: (
    {
      state,
      getters,
      mutations,
    }: {
      state: StateReturnType
      getters: GettersReturnType
      mutations: MutationsReturnType
      actions: any
    },
    ...payloads: any[]
  ) => void
}

/**
 * @public
 */
export type ActionsReturnType<ActionsOption extends { [P: string]: Func }> = ShallowReadonly<
  {
    [P in keyof ActionsOption]: OmitFirstParameter<ActionsOption[P]>
  }
>

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
export type Plugin = (store: ReturnType<typeof createStore>) => void

/**
 * @public
 */
export type CreateStoreReturnType = ReturnType<typeof createStore>

/**
 * @public
 */
export function createStore<
  State extends StateOption,
  Getters extends GettersOption<StateReturnType<State>> = GettersOption<StateReturnType<State>>,
  Mutations extends MutationsOption<State, GettersReturnType<Getters>> = MutationsOption<
    State,
    GettersReturnType<Getters>
  >,
  Actions extends ActionsOption<
    StateReturnType<State>,
    GettersReturnType<Getters>,
    MutationsReturnType<Mutations>
  > = ActionsOption<StateReturnType<State>, GettersReturnType<Getters>, MutationsReturnType<Mutations>>
>(options: { state: State; getters?: Getters; mutations?: Mutations; actions?: Actions; plugins?: Plugin[] }) {
  if (__DEV__) {
    assert(isPlainObject(options.state), 'invalid state type.')
  }

  const optionState = isReactive(options.state) ? toRefs(options.state) : options.state
  const state = ref(
    getOwnKeys(optionState).reduce((state, stateKey) => {
      return Object.assign(state, { [stateKey]: optionState[stateKey] })
    }, {}),
  ) as Ref<State>

  const optionGetters = options.getters || ({} as Getters)
  const getters = readonly(
    reactive(
      getOwnKeys(optionGetters).reduce((rawGetters, getterKey) => {
        const getter = computed(() =>
          optionGetters[getterKey]({ state: state.value as StateReturnType<any>, getters }),
        ) as any
        return Object.assign(rawGetters, { [getterKey]: getter })
      }, {}),
    ) as GettersReturnType<Getters>,
  ) as DeepReadonly<GettersReturnType<Getters>>

  const optionMutations = options.mutations || ({} as Mutations)
  const mutations = getOwnKeys(optionMutations).reduce((mutations, mutationKey) => {
    const mutation = (...payloads: unknown[]) => {
      const result = (optionMutations as any)[mutationKey]({ state: state.value, getters, mutations }, ...payloads)
      subscribers.forEach(subscriber => subscriber.call(null, { key: mutationKey as string, payloads }))
      return result
    }
    return Object.assign(mutations, { [mutationKey]: mutation })
  }, {}) as MutationsReturnType<Mutations>

  const optionActions = options.actions || ({} as Actions)
  const actions = getOwnKeys(optionActions).reduce((actions, actionKey) => {
    const action = (...payloads: unknown[]) => {
      actionSubscribers.forEach(subscriber => subscriber.call(null, { key: actionKey as string, payloads }))
      return (optionActions as any)[actionKey](
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

  const replaceState = function (newState: State) {
    getOwnKeys(state.value)
      .filter(key => newState[key] === undefined)
      .forEach(key => delete state.value[key])
    getOwnKeys(newState).forEach(key => {
      ;(state.value as any)[key] = newState[key]
    })
  }

  const store = {
    state: state.value as StateReturnType<State>,
    getters,
    mutations,
    actions,
    subscribe,
    actionSubscribe,
    replaceState,
  }

  const optionPlugins = options.plugins || []
  optionPlugins.forEach(plugin => plugin(store as any))

  return store
}
