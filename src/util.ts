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

/**
 * @alpha
 */
export function getOwnKeys<O extends object>(object: O) {
  return Array.from(Object.keys(object)) as (keyof O)[]
}

/**
 * @alpha
 */
export function assert(condition: unknown, message: string) {
  if (!condition) throw Error(`[vuex-light]: ${message}`)
}

/**
 * @alpha
 */
export function isPlainObject(object: unknown): boolean {
  return Object.prototype.toString.call(object) === '[object Object]'
}
