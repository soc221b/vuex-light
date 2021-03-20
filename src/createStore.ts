import { ref, computed, isReactive, Ref, toRefs, readonly, reactive } from 'vue'
import { getOwnKeys, assert, OmitFirstParameter, isPlainObject, DeepReadonly, AsyncFunc } from './util'

/**
 * @public
 */
export type Key = string | number

/**
 * @public
 */
export type Payload = any

/**
 * @public
 */
export type StateOptionType = Record<Key, any>

/**
 * @public
 */
export type GettersOptionType<StateOption extends StateOptionType> = Record<
  Key,
  ({ state, getters }: { state: DeepReadonly<StateOption>; getters: any }) => any
>

/**
 * @public
 */
export type MutationsOptionType<
  StateOption extends StateOptionType,
  GettersOption extends GettersOptionType<StateOption>
> = Record<
  Key,
  Exclude<
    (
      {
        state,
        getters,
        mutations,
      }: {
        state: StateOption
        getters: DeepReadonly<{ [P in keyof GettersOption]: ReturnType<GettersOption[P]> }>
        mutations: any
      },
      ...payload: Payload[]
    ) => void,
    AsyncFunc
  >
>

/**
 * @public
 */
export type ActionsOptionType<
  StateOption extends StateOptionType,
  GettersOption extends GettersOptionType<StateOption>,
  MutationsOption extends MutationsOptionType<StateOption, GettersOption>
> = Record<
  Key,
  (
    {
      state,
      getters,
      mutations,
      actions,
    }: {
      state: DeepReadonly<StateOption>
      getters: DeepReadonly<{ [P in keyof GettersOption]: ReturnType<OmitFirstParameter<GettersOption[P]>> }>
      mutations: DeepReadonly<{ [P in keyof MutationsOption]: OmitFirstParameter<MutationsOption[P]> }>
      actions: any
    },
    ...payload: Payload[]
  ) => void
>

/**
 * @public
 */
export type Plugin = (store: ReturnType<typeof createStore>) => void

/**
 * @public
 */
export type Subscriber = (mutation: { key: string; payload: unknown }) => void

/**
 * @public
 */
export type ActionSubscriber = (action: { key: string; payload: unknown }) => void

/**
 * @public
 */
export type CreateStoreReturnType = ReturnType<typeof createStore>

/**
 * @public
 */
export function createStore<
  StateOption extends StateOptionType,
  GettersOption extends GettersOptionType<StateOption>,
  MutationsOption extends MutationsOptionType<StateOption, GettersOption>,
  ActionsOption extends ActionsOptionType<StateOption, GettersOption, MutationsOption>,
  Modules extends { [P: string]: any }
>(
  stateOption: StateOption,
  gettersOption?: GettersOption,
  mutationsOption?: MutationsOption,
  actionsOption?: ActionsOption,
  pluginsOption?: Plugin[],
  modules: Modules = {} as Modules,
) {
  if (__DEV__) {
    assert(isPlainObject(stateOption), 'invalid state type.')
  }

  const { subscribe, subscribers } = useSubscriber<Subscriber>()
  const { subscribe: actionSubscribe, subscribers: actionSubscribers } = useSubscriber<ActionSubscriber>()

  const normalizedStateOption = isReactive(stateOption) ? toRefs(stateOption) : stateOption
  const state = ref(
    getOwnKeys(normalizedStateOption).reduce((state, stateKey) => {
      return Object.assign(state, { [stateKey]: normalizedStateOption[stateKey] })
    }, {}),
  ) as Ref<StateOption>

  const normalizedGettersOption = gettersOption || ({} as GettersOption)
  const getters = readonly(
    reactive(
      getOwnKeys(normalizedGettersOption).reduce((rawGetters, getterKey) => {
        const getter = computed(() =>
          (normalizedGettersOption[getterKey] as any)({ state: state.value, getters }),
        ) as any
        return Object.assign(rawGetters, { [getterKey]: getter })
      }, {}),
    ),
  ) as { readonly [P in keyof GettersOption]: DeepReadonly<ReturnType<OmitFirstParameter<GettersOption[P]>>> }

  const normalizedMutationsOption = mutationsOption || ({} as MutationsOption)
  const mutations = getOwnKeys(normalizedMutationsOption).reduce((mutations, mutationKey) => {
    const mutation = (payload: unknown) => {
      const result = (normalizedMutationsOption as any)[mutationKey](
        { state: state.value, getters, mutations },
        payload,
      )
      subscribers.forEach(subscriber => subscriber.call(null, { key: mutationKey as string, payload }))
      return result
    }
    return Object.assign(mutations, { [mutationKey]: mutation })
  }, {}) as { readonly [P in keyof MutationsOption]: Exclude<OmitFirstParameter<MutationsOption[P]>, AsyncFunc> }

  const normalizedActionsOption = actionsOption || ({} as ActionsOption)
  const actions = getOwnKeys(normalizedActionsOption).reduce((actions, actionKey) => {
    const action = (payload: unknown) => {
      actionSubscribers.forEach(subscriber => subscriber.call(null, { key: actionKey as string, payload }))
      return (normalizedActionsOption as any)[actionKey](
        {
          state: state.value,
          getters,
          mutations,
          actions,
        },
        payload,
      )
    }
    return Object.assign(actions, { [actionKey]: action })
  }, {}) as { readonly [P in keyof ActionsOption]: OmitFirstParameter<ActionsOption[P]> }

  const replaceState = function (newState: StateOption) {
    getOwnKeys(state.value)
      .filter(key => newState[key] === undefined)
      .forEach(key => delete state.value[key])
    getOwnKeys(newState).forEach(key => {
      ;(state.value as any)[key] = newState[key]
    })
  }

  const store = {
    state: state.value as DeepReadonly<StateOption>,
    getters,
    mutations,
    actions,
    subscribe,
    actionSubscribe,
    replaceState,
    modules,
  }

  const optionPlugins = pluginsOption || []
  optionPlugins.forEach(plugin => plugin(store as any))

  return store
}

/**
 * @public
 */
export function useSubscriber<Subscriber>() {
  const subscribers: Subscriber[] = []

  const subscribe = function (subscriber: Subscriber) {
    subscribers.push(subscriber)
  }

  return {
    subscribe,
    subscribers,
  }
}
