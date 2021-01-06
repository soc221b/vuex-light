<template>
  <button @click="$store.mutations.increment">count is: {{ $store.state.count }}</button>
</template>

<script lang="ts">
export default {
  name: 'HelloWorld',
}
</script>
