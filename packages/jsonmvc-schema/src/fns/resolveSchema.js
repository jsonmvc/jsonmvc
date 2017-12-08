import deref from 'json-schema-deref'
import path from 'path'
import Ajv from 'ajv'

import loadFile from './loadFile'
import refLoader from './refLoader'

export default function resolveSchema(file) {
  return new Promise((resolve, reject) => {
    const schema = loadFile(file)
    deref(schema, {
      baseFolder: path.parse(file).dir,
      loader: refLoader
    }, (e, result) => {
      const { errors } = (new Ajv()).compile(result)
      if (e || errors) {
        reject(e || errors)
      } else {
        resolve(result)
      }
    })
  })
}