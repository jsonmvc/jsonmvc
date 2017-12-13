import Ajv from 'ajv'
import deref from 'json-schema-ref-parser'
import allOf from 'json-schema-resolve-allof'
import yaml from 'js-yaml'

import replacePlaceholers from './replacePlaceholders'

function buildSchema(source, placeholders) {
  let ajv = new Ajv()
  return deref.dereference(source).then(schema => {
    let data = JSON.parse(JSON.stringify(schema))
    data = allOf(data)
    ajv.compile(data)
    if (placeholders) {
      data = yaml.safeDump(data)
      data = replacePlaceholers(data, placeholders)
      data = yaml.safeLoad(data)
    }
    return data
  })
}

export default buildSchema
