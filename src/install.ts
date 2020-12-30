import { App } from 'vue'

const defaultStoreKey = '$store'

/**
 * @alpha
 */
export function install<Store>(app: App, { store, storeKey }: { store: Store; storeKey?: string }) {
  const theStoreKey = storeKey || defaultStoreKey
  app.config.globalProperties[theStoreKey] = store
}