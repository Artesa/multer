import { Field, FileStrategy } from './types'
import type { Request } from 'express'

export default function createFileAppender (strategy: FileStrategy, req: Request, fields: Field[]) {
  switch (strategy) {
    case 'NONE': break
    case 'VALUE': req.file = null; break
    case 'ARRAY': req.files = []; break
    case 'OBJECT': req.files = Object.create(null); break
    /* c8 ignore next */
    default: throw new Error(`Unknown file strategy: ${strategy}`)
  }

  if (strategy === 'OBJECT') {
    for (const field of fields) {
      req.files[field.name] = []
    }
  }

  return function append (file) {
    switch (strategy) {
      case 'VALUE': req.file = file; break
      case 'ARRAY': req.files.push(file); break
      case 'OBJECT': req.files[file.fieldName].push(file); break
    }
  }
}
