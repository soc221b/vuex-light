import { createApp } from 'vue'
import App from './App.vue'

import store, { storeKey } from './store'
import { install } from 'vuex-light'

import 'todomvc-app-css/index.css'

const app = createApp(App)
// pass the injection key
app.use(install, { store, storeKey })
app.mount('#app')
