<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup() {
    return {
      count: ref(0),
    }
  },
}
</script>
