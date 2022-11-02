export function hasOwnProperty (object, name) {
  return Object.prototype.hasOwnProperty.call(object, name)
}

export type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<infer K, unknown> ? K : never