import Ajv from 'ajv'

function validationModel(id, schema) {
  return {
    name: `/${id}/action/errors`,
    path: `/${id}/action/errors`,
    args: {
      data: `/${id}/action/data`,
      submit: `/${id}/action/submit`
    },
    fn: ({ data, submit }) => {
      if (!submit) {
        return
      }

      let ajv = new Ajv({
        allErrors: true
      })

      let result = ajv.validate(schema, data)

      if (!result && ajv.errors) {
        return ajv.errors
      } else {
        return
      }
    }
  }
}

export default validationModel