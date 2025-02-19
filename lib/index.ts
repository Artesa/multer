import bytes from 'bytes'

import createFileFilter from './file-filter.js'
import createMiddleware from './middleware.js'
import { Field, FileStrategy, LimitOptions, Limits, MulterOptions, ParsedLimits } from './types.js'

const kLimits = Symbol('limits')

function parseLimit (limits: LimitOptions, key: keyof LimitOptions, defaultValue: number | string) {
  const input = limits[key] == null ? defaultValue : limits[key]
  const value = bytes.parse(input)
  if (!Number.isFinite(value)) throw new Error(`Invalid limit "${key}" given: ${limits[key]}`)
  if (!Number.isInteger(value)) throw new Error(`Invalid limit "${key}" given: ${value}`)
  return value
}

function _middleware (limits: ParsedLimits, fields: Field[], fileStrategy: FileStrategy) {
  return createMiddleware(() => ({
    fields,
    limits,
    fileFilter: createFileFilter(fields),
    fileStrategy
  }))
}

class Multer {
  constructor (options: MulterOptions) {
    this[kLimits] = {
      fieldNameSize: parseLimit(options.limits || {}, 'fieldNameSize', '100B'),
      fieldSize: parseLimit(options.limits || {}, 'fieldSize', '8KB'),
      fields: parseLimit(options.limits || {}, 'fields', 1000),
      fileSize: parseLimit(options.limits || {}, 'fileSize', '8MB'),
      files: parseLimit(options.limits || {}, 'files', 10),
      headerPairs: parseLimit(options.limits || {}, 'headerPairs', 2000)
    }
  }

  single (name: string) {
    return _middleware(this[kLimits], [{ name, maxCount: 1 }], 'VALUE')
  }

  array (name: string, maxCount?: number) {
    return _middleware(this[kLimits], [{ name, maxCount }], 'ARRAY')
  }

  fields (fields: Field[]) {
    return _middleware(this[kLimits], fields, 'OBJECT')
  }

  none () {
    return _middleware(this[kLimits], [], 'NONE')
  }

  any () {
    return createMiddleware(() => ({
      fields: [],
      limits: this[kLimits],
      fileFilter: () => {},
      fileStrategy: 'ARRAY'
    }))
  }
}

export default function multer (options: MulterOptions = {}) {
  if (options === null) throw new TypeError('Expected object for argument "options", got null')
  if (typeof options !== 'object') throw new TypeError(`Expected object for argument "options", got ${typeof options}`)

  if (options.dest || options.storage || options.fileFilter) {
    throw new Error('The "dest", "storage" and "fileFilter" options where removed in Multer 2.0. Please refer to the latest documentation for new usage.')
  }

  return new Multer(options)
}

export * from './types'
