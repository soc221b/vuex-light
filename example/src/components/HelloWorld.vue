<template>
  <h1>{{ msg }}</h1>

  <button @click="mutations.increment">count is: {{ state.count }}</button>
</template>

<script lang="ts">
import { useStore } from '../store'

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup() {
    const {
      state, // typed as { readonly count: number }
      mutations,
    } = useStore()

    return {
      state,
      mutations,
    }
  },
}
</script>
