import { set, get } from 'shvl'
import { Subscriber, CreateStoreReturnType } from '../../'
import { mergeDeepWithKey } from 'ramda'
import { DeepReadonly } from 'src/util'

/**
 * @public
 */
export function defaultReducer<State extends DeepReadonly<Record<any, any>>>(state: State, paths: string[] | null) {
  const unwrappedState = Object.keys(state).reduce((unwrappedState, key) => {
    unwrappedState[key] = state[key]
    return unwrappedState
  }, {} as any)
  return paths === null
    ? unwrappedState
    : paths.reduce((substate: any, path: string) => set(substate, path, get(unwrappedState, path)), {})
}

/**
 * @public
 */
export function defaultSubscriber<Store extends CreateStoreReturnType>(store: Store) {
  return function (handler: Subscriber) {
    return store.subscribe(handler)
  }
}

/**
 * @public
 */
export type Storage = {
  getItem: (key: string) => any
  setItem: (key: string, value: any) => void
  removeItem: (key: string) => void
}

/**
 * @public
 */
export function defaultGetState(key: Parameters<Storage['getItem']>['0'], storage: Storage) {
  const value = storage.getItem(key)

  try {
    return typeof value !== 'undefined' ? JSON.parse(value) : undefined
  } catch (err) {}

  return undefined
}

/**
 * @public
 */
export function defaultSetState(key: Parameters<Storage['setItem']>['0'], state: any, storage: Storage) {
  return storage.setItem(key, JSON.stringify(state))
}

const randomKey = '4u33j8eqxxyndzw5slhe6xyt9tuymkvf'
/**
 * @public
 */
export function defaultAssertStorage(storage: Storage): void | Error {
  storage.setItem(randomKey, 1)
  storage.removeItem(randomKey)
}

/**
 * @public
 */
export type PersistPluginRequiredOptions = {
  key: string
  paths: string[] | null
  reducer: typeof defaultReducer
  subscriber: typeof defaultSubscriber
  storage: Storage
  getState: typeof defaultGetState
  setState: typeof defaultSetState
  filter: (mutation: string) => boolean
  overwrite: boolean
  fetchBeforeUse: boolean
  assertStorage: typeof defaultAssertStorage
  mergeDeepWithKeyFn: (k: string, l: any, r: any) => any
  onRehydrated: <Store extends CreateStoreReturnType>(_: Store) => void
}

/**
 * @public
 */
export type PersistPluginOptions = Partial<PersistPluginRequiredOptions>

function normalize(options: PersistPluginOptions): PersistPluginRequiredOptions {
  return {
    key: options.key || 'vuex',
    paths: options.paths || null,
    reducer: options.reducer || defaultReducer,
    subscriber: options.subscriber || defaultSubscriber,
    storage: options.storage || window.localStorage,
    getState: options.getState || defaultGetState,
    setState: options.setState || defaultSetState,
    filter: options.filter || (() => true),
    overwrite: options.overwrite !== undefined ? options.overwrite : false,
    fetchBeforeUse: options.fetchBeforeUse !== undefined ? options.fetchBeforeUse : false,
    assertStorage: options.assertStorage || defaultAssertStorage,
    mergeDeepWithKeyFn: options.mergeDeepWithKeyFn || ((_k, _l, r) => r),
    onRehydrated: options.onRehydrated || (() => {}),
  }
}

/**
 * @public
 */
export function createPersistPlugin(options?: PersistPluginOptions) {
  const normalizedOptions = normalize(options || {})

  normalizedOptions.assertStorage(normalizedOptions.storage)

  let savedState: any
  if (normalizedOptions.fetchBeforeUse) {
    savedState = normalizedOptions.getState(normalizedOptions.key, normalizedOptions.storage)
  }

  // TODO: add type info
  return function (store: any) {
    if (normalizedOptions.fetchBeforeUse === false) {
      savedState = normalizedOptions.getState(normalizedOptions.key, normalizedOptions.storage)
    }

    if (typeof savedState === 'object' && savedState !== null) {
      store.replaceState(
        normalizedOptions.overwrite
          ? savedState
          : mergeDeepWithKey(normalizedOptions.mergeDeepWithKeyFn, store.state, savedState),
      )
      normalizedOptions.onRehydrated(store)
    }

    normalizedOptions.subscriber(store)(mutation => {
      if (normalizedOptions.filter(mutation.key))
        normalizedOptions.setState(
          normalizedOptions.key,
          normalizedOptions.reducer(store['state'], normalizedOptions.paths),
          normalizedOptions.storage,
        )
    })
  }
}
