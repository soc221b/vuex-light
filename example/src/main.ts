import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import store from './store'
import { install } from 'vuex-light'

const app = createApp(App)

app.use(install, { store })
app.mount('#app')
