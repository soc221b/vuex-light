import { ref, computed, Ref, ComputedRef } from 'vue'
import { DeepReadonly, OmitFirst } from './util'

/**
 * @alpha
 */
export type StateParamType = {
  [P: string]: unknown
}

/**
 * @alpha
 */
export type InnerStateType<S extends StateParamType> = {
  [P in keyof S]: Ref<S[P]>
}

/**
 * @alpha
 */
export type StateReturnType<S extends StateParamType> = {
  [P in keyof S]: DeepReadonly<Ref<S[P]>>
}

/**
 * @alpha
 */
export type GettersParamType<S extends StateParamType> = {
  [P: string]: (state: StateReturnType<S>) => unknown
}

/**
 * @alpha
 */
export type GettersReturnType<G extends GettersParamType<any>> = {
  [P in keyof G]: ComputedRef<ReturnType<G[P]>>
}

/**
 * @alpha
 */
export type MutationsParamType<S extends StateParamType> = {
  [P: string]: (state: InnerStateType<S>, ...payload: any[]) => void
}

/**
 * @alpha
 */
export type MutationsReturnType<M extends MutationsParamType<any>> = {
  [P in keyof M]: (...args: OmitFirst<Parameters<M[P]>>) => void
}

/**
 * @alpha
 */
export function createStore<
  State extends StateParamType,
  Getters extends GettersParamType<State>,
  Mutations extends MutationsParamType<State>
>(options: { state: State; getters: Getters; mutations: Mutations }) {
  const optionState = options.state
  const state = (Array.from(Object.keys(options.state)) as Array<keyof typeof optionState>).reduce(
    (state, stateKey) => {
      return Object.assign(state, { [stateKey]: ref(optionState[stateKey]) })
    },
    {},
  ) as InnerStateType<State>

  const getters = (Array.from(Object.keys(options.getters)) as Array<keyof typeof options.getters>).reduce(
    (getters, getterKey) => {
      const getter = computed(() => options.getters[getterKey](state as any))
      return Object.assign(getters, { [getterKey]: getter })
    },
    {},
  ) as GettersReturnType<Getters>

  const optionMutations = options.mutations || {}
  const mutations = (Array.from(Object.keys(optionMutations)) as Array<keyof typeof optionMutations>).reduce(
    (mutations, mutationKey) => {
      const mutation = (...payload: unknown[]) => optionMutations[mutationKey](state, ...payload)
      return Object.assign(mutations, { [mutationKey]: mutation })
    },
    {},
  ) as MutationsReturnType<Mutations>

  return {
    ...(state as StateReturnType<State>),
    ...getters,
    mutations: {
      ...mutations,
    },
  }
}

export * from './install'
export * from './util'
