const fs = require('fs')
const yaml = require('js-yaml')

let mod
if(__DEV__) {
  mod = require('./../src/index')
} else {
  mod = require('./../dist/index')
}

/*

const parseSchemaFromFiles = require('./../lib/parseSchemaFromFiles')
const walkSync = require('./../lib/walkSync')
const resolveSchema = require('./../lib/resolveSchema')
const emptySchema = require('./../lib/emptySchema')

let files = walkSync('./schema')
let schema = parseSchemaFromFiles(files)
schema = resolveSchema(schema)

const empty = emptySchema(schema)

*/

it('should compose a nested schema', () => {
  return mod(__dirname + '/schema/app.yml').then(x => {
    let expectedSchema = yaml.safeLoad(fs.readFileSync(__dirname + '/schema/app.expected.yml', 'utf-8'))
    expect(x.schema).toEqual(expectedSchema)
  }).catch(e => {
    throw e
  })
})