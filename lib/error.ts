import { errorMessages, MulterErrorCode } from "./types"

export default class MulterError extends Error {
  code: MulterErrorCode
  field?: string
  
  constructor (code: MulterErrorCode, optionalField?) {
    super(errorMessages[code])

    this.code = code
    this.name = this.constructor.name
    if (optionalField) this.field = optionalField

    Error.captureStackTrace(this, this.constructor)
  }
}
