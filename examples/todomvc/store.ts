import { createStore, createPersistPlugin, createLoggerPlugin } from 'vuex-light'
import { Todo } from './types'

const store = createStore({
  state: {
    todos: [] as Todo[],
  },
  mutations: {
    addTodo({ state }, todo: Todo) {
      state.todos.push(todo)
    },

    removeTodo({ state }, todo: Todo) {
      state.todos.splice(state.todos.indexOf(todo), 1)
    },

    editTodo(
      { state },
      { todo, text = todo.text, done = todo.done }: { todo: Todo; text: Todo['text']; done: Todo['done'] },
    ) {
      const index = state.todos.indexOf(todo)

      state.todos.splice(index, 1, {
        ...todo,
        text,
        done,
      })
    },
  },
  actions: {
    addTodo({ mutations }, text: string) {
      mutations.addTodo({
        text,
        done: false,
      })
    },

    removeTodo({ mutations }, todo: Todo) {
      mutations.removeTodo(todo)
    },

    toggleTodo({ mutations }, todo: Todo) {
      mutations.editTodo({ todo, done: !todo.done })
    },

    editTodo({ mutations }, { todo, value }: { todo: Todo; value: Todo['text'] }) {
      mutations.editTodo({ todo, text: value })
    },

    toggleAll({ state, mutations }, done: Todo['done']) {
      state.todos.forEach(todo => {
        mutations.editTodo({ todo, done })
      })
    },

    clearCompleted({ state, mutations }) {
      state.todos
        .filter(todo => todo.done)
        .forEach(todo => {
          mutations.removeTodo(todo)
        })
    },
  },
  plugins: [createPersistPlugin(), createLoggerPlugin()],
})
export default store

// define injection
export const storeKey = '$store'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    [storeKey]: typeof store
  }
}

// declare the `useStore` composition function
export function useStore() {
  return store
}
