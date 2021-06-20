import { createStore, createPersistPlugin, createLoggerPlugin } from 'vuex-light'
import { Todo } from './types'

const store = createStore(
  {
    todos: [
      {
        text: 'Give it a try.',
        done: true,
      },
      {
        text: 'Create awesome app!',
        done: false,
      },
      {
        text: 'Star vuex-light repository',
        done: false,
      },
    ] as Todo[],
  },
  {},
  {
    addTodo({ state }, todo: Todo) {
      state.todos.push(todo)
    },

    removeTodo({ state }, todo: Todo) {
      state.todos.splice(state.todos.indexOf(todo), 1)
    },

    editTodo(
      { state },
      { todo, text = todo.text, done = todo.done }: { todo: Todo; text?: Todo['text']; done?: Todo['done'] },
    ) {
      const index = state.todos.indexOf(todo)

      state.todos.splice(index, 1, {
        ...todo,
        text,
        done,
      })
    },
  },
  {
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
  [createPersistPlugin(), createLoggerPlugin()],
)

export function useStore() {
  return store
}
