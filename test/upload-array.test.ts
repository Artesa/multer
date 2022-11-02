/* eslint-env mocha */

import assert from 'node:assert'
import FormData from 'form-data'

import * as util from './_util'
import multer from '../lib'

describe('upload.array', () => {
  let parser

  beforeAll(() => {
    parser = multer().array('files', 3)
  })

  it('should accept single file', async () => {
    const form = new FormData()

    form.append('name', 'Multer')
    form.append('files', util.file('small'))

    const req = await util.submitForm(parser, form)
    assert.strictEqual(req.body.name, 'Multer')
    assert.strictEqual(req.files.length, 1)

    await util.assertFile(req.files[0], 'files', 'small')
  })

  it('should accept array of files', async () => {
    const form = new FormData()

    form.append('name', 'Multer')
    form.append('files', util.file('empty'))
    form.append('files', util.file('small'))
    form.append('files', util.file('tiny'))

    const req = await util.submitForm(parser, form)
    assert.strictEqual(req.body.name, 'Multer')
    assert.strictEqual(req.files.length, 3)

    await util.assertFiles([
      [req.files[0], 'files', 'empty'],
      [req.files[1], 'files', 'small'],
      [req.files[2], 'files', 'tiny']
    ])
  })

  it('should reject too many files', async () => {
    const form = new FormData()

    form.append('name', 'Multer')
    form.append('files', util.file('small'))
    form.append('files', util.file('small'))
    form.append('files', util.file('small'))
    form.append('files', util.file('small'))

    await assert.rejects(
      util.submitForm(parser, form),
      (err) => err.code === 'LIMIT_FILE_COUNT' && err.field === 'files'
    )
  })

  it('should reject unexpected field', async () => {
    const form = new FormData()

    form.append('name', 'Multer')
    form.append('unexpected', util.file('small'))

    await assert.rejects(
      util.submitForm(parser, form),
      (err) => err.code === 'LIMIT_UNEXPECTED_FILE' && err.field === 'unexpected'
    )
  })
})
