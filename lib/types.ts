import { ReadStream } from 'fs'

export type Limits = Record<symbol, ParsedLimits>

export interface LimitOptions {
  fieldNameSize?: number | string
  fieldSize?: number | string
  fields?: number
  fileSize?: number | string
  files?: number
  headerPairs?: number
}

export type ParsedLimits = Required<{
  [key in keyof LimitOptions]: number;
}>

export type FileStrategy = 'ARRAY' | 'OBJECT' | 'VALUE' | 'NONE'

export interface MulterOptions {
  /** @deprecated */
  dest?: never
  /** @deprecated */
  storage?: never
  /** @deprecated */
  fileFilter?: never

  limits?: LimitOptions
}

export const errorMessages = {
  CLIENT_ABORTED: 'Client aborted',
  LIMIT_FILE_SIZE: 'File too large',
  LIMIT_FILE_COUNT: 'Too many files',
  LIMIT_FIELD_KEY: 'Field name too long',
  LIMIT_FIELD_VALUE: 'Field value too long',
  LIMIT_FIELD_COUNT: 'Too many fields',
  LIMIT_UNEXPECTED_FILE: 'Unexpected file field'
} as const

export type MulterErrorCode = keyof typeof errorMessages

export interface MulterFile {
  path: string
  fieldName: string
  originalName: string
  size: number
  stream: ReadStream
  detectedMimeType: string | null
  detectedFileExtension: string
  clientReportedMimeType: string
  clientReportedFileExtension: string
}

export interface Field {
  name: string
  maxCount?: number
}

export type FileFilter = (file: MulterFile) => void

export interface CreateMiddlewareOptions {
  fields: Field[]
  limits: ParsedLimits
  fileFilter: FileFilter
  fileStrategy: FileStrategy
}
