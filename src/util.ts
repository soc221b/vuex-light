/**
 * @alpha
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * @alpha
 */
export type OmitFirst<T> = T extends [any, ...infer Rest] ? Rest : never
