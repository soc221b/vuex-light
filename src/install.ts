import { App } from 'vue'

/**
 * @public
 */
export const defaultStoreKey = '$store'

/**
 * @public
 */
export function install<Store>(app: App, { store, storeKey }: { store: Store; storeKey?: string }) {
  const theStoreKey = storeKey || defaultStoreKey
  app.config.globalProperties[theStoreKey] = store
}
