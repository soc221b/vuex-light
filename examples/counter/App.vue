<template>
  Clicked: {{ count }} times, count is {{ evenOrOdd }}.
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
  <button @click="incrementIfOdd">Increment if odd</button>
  <button @click="incrementAsync">Increment async</button>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from './store'

export default {
  name: 'HelloWorld',
  setup() {
    const store = useStore()

    return {
      count: computed(() => store.state.count),
      evenOrOdd: computed(() => store.getters.evenOrOdd),
      increment: store.actions.increment,
      decrement: store.actions.decrement,
      incrementIfOdd: store.actions.incrementIfOdd,
      incrementAsync: store.actions.incrementAsync,
    }
  },
}
</script>
