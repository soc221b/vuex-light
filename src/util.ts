/**
 * @public
 */
export type OmitFirst<T> = T extends [any, ...infer Rest] ? [...Rest, void] : void

/**
 * @public
 */
export function getOwnKeys<O extends object>(object: O) {
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
