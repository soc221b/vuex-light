<template>
  <li class="todo" :class="{ completed: todo.done, editing }">
    <div class="view">
      <input class="toggle" type="checkbox" :checked="todo.done" @change="toggleTodo(todo)" />
      <label v-text="todo.text" @dblclick="editing = true"></label>
      <button class="destroy" @click="removeTodo(todo)"></button>
    </div>
    <input
      class="edit"
      v-show="editing"
      :value="todo.text"
      ref="input"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    />
  </li>
</template>

<script lang="ts">
import { ref, watch, nextTick, defineComponent, PropType } from 'vue'
import { useStore } from './store'
import { Todo } from './types'

export default defineComponent({
  name: 'Todo',
  props: {
    todo: {
      required: true,
      type: Object as PropType<Todo>,
    },
  },
  setup(props) {
    const input = ref<HTMLInputElement | null>(null)
    const editing = ref(false)
    watch(editing, v => {
      v &&
        nextTick(() => {
          input.value!.focus()
        })
    })
    const store = useStore()
    const editTodo = (todo: Todo, value: string) => store.actions.editTodo({ todo, value })
    const toggleTodo = (todo: Todo) => store.actions.toggleTodo(todo)
    const removeTodo = (todo: Todo) => store.actions.removeTodo(todo)
    function doneEdit(e: any) {
      const value: string = e.target.value.trim()
      if (!value) {
        removeTodo(props.todo)
      } else if (editing.value) {
        editTodo(props.todo, value)
      }
      editing.value = false
    }
    function cancelEdit(e: any) {
      e.target.value = props.todo!.text
      editing.value = false
    }
    return {
      input,
      editing,
      toggleTodo,
      doneEdit,
      cancelEdit,
      removeTodo,
    }
  },
})
</script>
