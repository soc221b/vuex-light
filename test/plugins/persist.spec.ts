import { createStore, createPersistPlugin, defaultKey } from '../../src'
// @ts-ignore
import Storage from 'dom-storage'

it('can be created with the default options', () => {
  expect(() => {
    createStore({
      state: {
        count: 0,
      },
      plugins: [createPersistPlugin()],
    })
  }).not.toThrow()
})

it("replaces store's state when initializing", () => {
  const storage = new Storage()
  storage.setItem(defaultKey, JSON.stringify({ persisted: 'json' }))
  const store = createStore({
    state: {
      original: 'state',
    },
  })
  store.replaceState = jest.fn()
  const plugin = createPersistPlugin({ storage })
  plugin(store)

  expect(store.replaceState).toBeCalled()
  expect(store.replaceState).toBeCalledWith({
    original: 'state',
    persisted: 'json',
  })
})

it("does not replace store's state with invalid JSON", () => {
  const storage = new Storage()
  storage.setItem(defaultKey, '<invalid>')
  const store = createStore({
    state: {
      original: 'state',
    },
  })
  store.replaceState = jest.fn()
  const plugin = createPersistPlugin({ storage })
  plugin(store)

  expect(store.replaceState).not.toBeCalled()
  expect(store.state).toEqual({ original: 'state' })
})

it("does not replace store's state with null", () => {
  const storage = new Storage()
  storage.setItem(defaultKey, null)
  const store = createStore({
    state: {
      original: 'state',
    },
  })
  store.replaceState = jest.fn()
  const plugin = createPersistPlugin({ storage })
  plugin(store)

  expect(store.replaceState).not.toBeCalled()
  expect(store.state).toEqual({ original: 'state' })
})

it("does not overrite store's state by default", () => {
  const storage = new Storage()
  storage.setItem(defaultKey, JSON.stringify({ persisted: 'json' }))
  const store = createStore({
    state: {
      original: 'state',
    },
  })
  const plugin = createPersistPlugin({ storage })
  plugin(store)

  expect(store.state).toEqual({ original: 'state', persisted: 'json' })
})

it("overrite store's state", () => {
  const storage = new Storage()
  storage.setItem(defaultKey, JSON.stringify({ persisted: 'json' }))
  const store = createStore({
    state: {
      original: 'state',
    },
  })
  const plugin = createPersistPlugin({ storage, overwrite: true })
  plugin(store)

  expect(store.state).toEqual({ persisted: 'json' })
})

it('does not fetch before use by default', () => {
  const storage = new Storage()
  storage.getItem = jest.fn()
  const plugin = createPersistPlugin({ storage })

  expect(storage.getItem).not.toBeCalled()

  const store = createStore({
    state: {
      original: 'state',
    },
  })
  plugin(store)

  expect(storage.getItem).toBeCalledWith(defaultKey)
})

it('does not fetch before use by default', () => {
  const storage = new Storage()
  storage.getItem = jest.fn()
  createPersistPlugin({ storage, fetchBeforeUse: true })

  expect(storage.getItem).toBeCalledWith(defaultKey)
})

it('assert storage when initializing', () => {
  const storage = new Storage()
  expect(() => createPersistPlugin({ storage, fetchBeforeUse: true })).not.toThrow()

  const storage2 = new Storage()
  storage2.setItem = jest.fn(() => {
    throw Error()
  })
  expect(() => createPersistPlugin({ storage: storage2, fetchBeforeUse: true })).toThrow()

  const storage3 = new Storage()
  storage3.removeItem = jest.fn(() => {
    throw Error()
  })
  expect(() => createPersistPlugin({ storage: storage3, fetchBeforeUse: true })).toThrow()
})

it('filter mutation', () => {
  const storage = new Storage()
  const store = createStore({
    state: {
      original: 'state',
    },
    mutations: {
      save(state) {
        state.original = 'saved'
      },
      notSave(state) {
        state.original = 'notSaved'
      },
    },
  })
  function filter(mutationKey: string) {
    return mutationKey === 'save'
  }
  const plugin = createPersistPlugin({ storage, filter })
  plugin(store)

  store.mutations.save()
  expect(JSON.parse(storage.getItem(defaultKey))).toEqual({ original: 'saved' })

  store.mutations.notSave()
  expect(JSON.parse(storage.getItem(defaultKey))).toEqual({ original: 'saved' })
})

it('setState by custom function', () => {
  const storage = new Storage()
  const store = createStore({
    state: {
      original: 'state',
    },
    mutations: {
      change(state) {
        state.original = 'new state'
      },
    },
  })
  function setState(key: string, _: any, storage: typeof Storage) {
    storage.setItem(key, JSON.stringify({ original: 'changed' }))
  }
  const plugin = createPersistPlugin({ storage, setState })
  plugin(store)

  store.mutations.change()
  expect(JSON.parse(storage.getItem(defaultKey))).toEqual({ original: 'changed' })
})

it('setState by custom function', () => {
  const storage = new Storage()
  storage.setItem(defaultKey, JSON.stringify({ persisted: 'json' }))
  const store = createStore({
    state: {
      persisted: 'state',
    },
  })
  function getState() {
    return { persisted: 'changed' }
  }
  const plugin = createPersistPlugin({ storage, getState })
  plugin(store)

  expect(store.state).toEqual({ persisted: 'changed' })
})

it('should only save given paths', () => {
  const storage = new Storage()
  const store = createStore({
    state: {
      saved: 'saved',
      notSaved: 'notSaved',
    },
    mutations: {
      fireSetItem() {},
    },
  })
  const paths = ['saved']
  const plugin = createPersistPlugin({ storage, paths })
  plugin(store)

  store.mutations.fireSetItem()
  expect(JSON.parse(storage.getItem(defaultKey))).toEqual({ saved: 'saved' })
})

it('should save as given key', () => {
  const randomKey = Math.random().toString(36).slice(2)
  const storage = new Storage()
  const store = createStore({
    state: {
      original: 'state',
    },
    mutations: {
      fireSetItem() {},
    },
  })
  const plugin = createPersistPlugin({ storage, key: randomKey })
  plugin(store)

  store.mutations.fireSetItem()
  expect(JSON.parse(storage.getItem(defaultKey))).toBe(null)
  expect(JSON.parse(storage.getItem(randomKey))).toEqual({ original: 'state' })
})

it('should call rehydrate callback after rehydrated', () => {
  const storage = new Storage()
  storage.setItem(defaultKey, JSON.stringify({ persisted: 'json' }))
  const store = createStore({
    state: {},
  })
  const onRehydrated = jest.fn()
  const plugin = createPersistPlugin({ storage, onRehydrated })
  plugin(store)

  expect(onRehydrated).toBeCalled()
})

it('uses the custom reducer when persisting the state', () => {
  const storage = new Storage()
  const store = createStore({
    state: {
      original: 'state',
    },
    mutations: {
      fireSetItem() {},
    },
  })
  const customReducer = jest.fn()
  const plugin = createPersistPlugin({
    storage,
    paths: ['original'],
    reducer: customReducer,
  })
  plugin(store)

  store.mutations.fireSetItem()

  expect(customReducer).toBeCalledWith({ original: 'state' }, ['original'])
})

it('uses the custom arrayMerge when rehydrating', () => {
  const storage = new Storage()
  storage.setItem(defaultKey, JSON.stringify({ persisted: ['foo'] }))
  const store = createStore({
    state: {
      persisted: ['foo', 'bar'],
    },
  })
  const arrayMerge = jest.fn(() => {
    return ['baz']
  })
  const plugin = createPersistPlugin({
    storage,
    arrayMerge,
  })
  plugin(store)

  expect(arrayMerge).toBeCalled()
  expect(store.state).toEqual({ persisted: ['baz'] })
})
