<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      />
    </header>
    <!-- main section -->
    <section class="main" v-show="todos.length">
      <input
        class="toggle-all"
        id="toggle-all"
        type="checkbox"
        :checked="allChecked"
        @change="toggleAll(!allChecked)"
      />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <TodoItem v-for="(todo, index) in filteredTodos" :key="index" :todo="todo" />
      </ul>
    </section>
    <!-- footer -->
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ pluralize(remaining, 'item') }} left
      </span>
      <ul class="filters">
        <template v-for="(val, key) in filters" :key="key">
          <li>
            <a :href="'#/' + key" :class="{ selected: visibility === key }" @click="() => switchTab(key)">{{
              capitalize(key)
            }}</a>
          </li>
        </template>
      </ul>
      <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">Clear completed</button>
    </footer>
  </section>
</template>

<script lang="ts">
import { ref, computed, defineComponent, DeepReadonly } from 'vue'
import { useStore } from './store'
import { Todo } from './types'
import TodoItem from './components/TodoItem.vue'

const filters = {
  all: (todos: DeepReadonly<Todo[]>) => todos,
  active: (todos: DeepReadonly<Todo[]>) => todos.filter(todo => !todo.done),
  completed: (todos: DeepReadonly<Todo[]>) => todos.filter(todo => todo.done),
}
export default defineComponent({
  components: { TodoItem },
  setup() {
    const visibility = ref<keyof typeof filters>('all')
    const switchTab = (key: string) => {
      if (key in Object.keys(filters)) {
        visibility.value = key as keyof typeof filters
      }
    }
    const store = useStore()
    const todos = computed(() => store.state.todos)
    const allChecked = computed(() => todos.value.every(todo => todo.done))
    const filteredTodos = computed(() => filters[visibility.value](todos.value))
    const remaining = computed(() => todos.value.filter(todo => !todo.done).length)
    const toggleAll = (done: boolean) => store.actions.toggleAll(done)
    const clearCompleted = () => store.actions.clearCompleted()
    function addTodo(e: any) {
      const text = e.target.value
      if (text.trim()) {
        store.actions.addTodo(text)
      }
      e.target.value = ''
    }
    const pluralize = (n: number, w: string) => (n === 1 ? w : w + 's')
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
    return {
      visibility,
      switchTab,
      filters,
      todos,
      allChecked,
      filteredTodos,
      remaining,
      addTodo,
      clearCompleted,
      toggleAll,
      pluralize,
      capitalize,
    }
  },
})
</script>
