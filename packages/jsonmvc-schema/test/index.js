const fs = require('fs')
const yaml = require('js-yaml')

let mod
if(__DEV__) {
  mod = require('./../src/index')
} else {
  mod = require('./../dist/index')
}

it('should compose a nested schema', () => {
  let placeholders = {
    '__SAMPLE_PLACEHOLDER__': 123
  }
  return mod.buildSchema(__dirname + '/schema/app.yml', placeholders).then(x => {
    let expectedSchema = yaml.safeLoad(fs.readFileSync(__dirname + '/schema/app.expected.yml', 'utf-8'))
    expect(x).toEqual(expectedSchema)
  }).catch(e => {
    throw e
  })
})