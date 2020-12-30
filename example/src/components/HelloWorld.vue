<template>
  <h1>{{ msg }}</h1>
  <button @click="increment">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '../store'

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup() {
    const {
      count,
      mutations: { increment },
    } = useStore()

    return {
      count,
      increment,
    }
  },
}
</script>
