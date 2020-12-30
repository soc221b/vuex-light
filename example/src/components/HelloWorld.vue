<template>
  <h1>{{ msg }}</h1>

  <button @click="increment">count is: {{ count }}</button>

  <br />
  <input v-model="offsetCount" type="number" style="width: 30px" />
  <button @click="add(parseInt(offsetCount, 10))">add</button>

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
      state: {
        count, // typed as DeepReadonly<Ref<number>>
      },
      mutations: {
        increment, // typed as () => void
        add, // typed as (offset: number) => void
      },
    } = useStore()
    const offsetCount = ref(42)

    return {
      count,
      increment,
      add,
      offsetCount,
    }
  },
}
</script>
