import { App } from 'vue'

export function install<Store>(app: App, { store, storeKey }: { store: Store; storeKey?: string }) {
  app.config.globalProperties[storeKey || '$store'] = store
}
