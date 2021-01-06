<template>
  Clicked: {{ store.state.count }} times, count is {{ store.state.evenOrOdd }}.
  <button @click="store.actions.increment">+</button>
  <button @click="store.actions.decrement">-</button>
  <button @click="store.actions.incrementIfOdd">Increment if odd</button>
  <button @click="store.actions.incrementAsync">Increment async</button>
</template>

<script lang="ts">
export default {
  name: 'HelloWorld',
  inject: ['store'],
}
</script>
