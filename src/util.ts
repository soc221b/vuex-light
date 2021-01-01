export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type OmitFirst<T> = T extends [any, ...infer Rest] ? Rest : never
