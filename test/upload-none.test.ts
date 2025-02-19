/* eslint-env mocha */

import assert from 'node:assert'
import FormData from 'form-data'

import * as util from './_util'
import multer from '../lib'

describe('upload.none', () => {
  let parser

  beforeAll(() => {
    parser = multer().none()
  })

  it('should handle text fields', async () => {
    const form = new FormData()
    const parser = multer().none()

    form.append('foo', 'bar')
    form.append('test', 'yes')

    const req = await util.submitForm(parser, form)
    assert.strictEqual(req.file, undefined)
    assert.strictEqual(req.files, undefined)

    assert.strictEqual(req.body.foo, 'bar')
    assert.strictEqual(req.body.test, 'yes')
  })

  it('should reject single file', async () => {
    const form = new FormData()

    form.append('name', 'Multer')
    form.append('file', util.file('small'))

    await assert.rejects(
      util.submitForm(parser, form),
      (err) => err.code === 'LIMIT_UNEXPECTED_FILE' && err.field === 'file'
    )
  })

  it('should reject multiple files', async () => {
    const form = new FormData()

    form.append('name', 'Multer')
    form.append('file', util.file('tiny'))
    form.append('file', util.file('tiny'))

    await assert.rejects(
      util.submitForm(parser, form),
      (err) => err.code === 'LIMIT_UNEXPECTED_FILE' && err.field === 'file'
    )
  })
})
