import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'

import validationModel from './validationModel'
import fieldErrorModel from './fieldErrorModel'

// Fields are organizated as so:
// [entity]/[ns]/[field]
function buildValidation(schema, data) {
  let files = {}
  Object.keys(data).forEach(id => {
    let entity = data[id]
    if (entity.fields) {
      let validationSchema = {
        type: 'object',
        properties: {},
        required: []
      }

      Object.keys(entity.fields).forEach(ns => {
        let fields = entity.fields[ns]
        if (fields) {
          validationSchema.properties[ns] = cloneDeep(get(schema, `properties.${id}.properties.${ns}`))
          Object.keys(fields).forEach(fieldName => {
            fields[fieldName].valuePath = `/${id}/action/data/${ns}/${fieldName}`
            fields[fieldName].submitPath = `/${id}/action/submit`
            let fieldSchema = get(schema, `properties.${id}.properties.${ns}.properties.${fieldName}`)
            files[`./models/${id}/action/data/${ns}/${fieldName}/error`] = fieldErrorModel(id, ns, fieldName, fieldSchema)
          })
        }
      })

      Object.keys(validationSchema.properties).forEach(ns => {
        if (validationSchema.properties[ns] && validationSchema.properties[ns].properties) {
          let required = validationSchema.properties[ns].required || []
          Object.keys(validationSchema.properties[ns].properties).forEach(fieldName => {
            let newField = {
              type: 'object',
              properties: {
                value: validationSchema.properties[ns].properties[fieldName]
              }
            }

            if (required.indexOf(fieldName) !== -1) {
              newField.required = ['value']
            }

            validationSchema.properties[ns].properties[fieldName] = newField
          })
        }
      })

      files[`./models/${id}/action/error`] = validationModel(id, validationSchema)
    }
  })

  return files
}

export default buildValidation
