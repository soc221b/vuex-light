/**
 * @public
 */
export type OmitFirstParameter<F> = F extends (x: any, ...params: infer Rest) => infer R
  ? (...params: Rest) => R
  : never

/**
 * @public
 */
export type ShallowReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

/**
 * @public
 */
export type DeepReadonly<T> = T extends Func
  ? T
  : T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>
    }
  : T

/**
 * @public
 */
export type Func = { (...args: any): any }

/**
 * @public
 */
export type AsyncFunc = { (...args: any): Promise<any> }

/**
 * @public
 */
export function getOwnKeys<O extends Record<any, any>>(object: O) {
  return Array.from(Object.keys(object)) as (keyof O)[]
}

/**
 * @public
 */
export function assert(condition: unknown, message: string) {
  if (!condition) throw Error(`[vuex-light]: ${message}`)
}

/**
 * @public
 */
export function isPlainObject(object: unknown): boolean {
  return Object.prototype.toString.call(object) === '[object Object]'
}
