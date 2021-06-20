<template>
  Clicked: {{ store.state.count }} times, count is {{ store.getters.evenOrOdd }}.
  <button @click="store.actions.increment">+</button>
  <button @click="store.actions.decrement">-</button>
  <button @click="store.actions.incrementIfOdd">Increment if odd</button>
  <button @click="store.actions.incrementAsync">Increment async</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from './store'

export default defineComponent({
  name: 'Counter',
  setup() {
    const store = useStore()

    return {
      store,
    }
  },
})
</script>
