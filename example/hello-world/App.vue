<template>
  <button @click="mutations.increment">count is: {{ state.count }}</button>
</template>

<script lang="ts">
import { useStore } from './store'

export default {
  name: 'HelloWorld',
  setup() {
    const { state, mutations } = useStore()

    return {
      state,
      mutations,
    }
  },
}
</script>
