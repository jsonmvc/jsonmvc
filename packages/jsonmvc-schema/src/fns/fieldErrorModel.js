import Ajv from 'ajv'

function fieldErrorModel(id, ns, field, schema) {
  return {
    name: `/${id}/action/data/${ns}/${field}/error`,
    path: `/${id}/action/data/${ns}/${field}/error`,
    args: {
      data: `/${id}/action/data/${ns}/${field}/value`
    },
    fn: ({ data, submit }) => {
      if (data == undefined) {
        return
      }

      let ajv = new Ajv()
      let result = ajv.validate(schema, data)

      if (!result && ajv.errors) {
        return ajv.errors[0]
      } else {
        return
      }
    }
  }
}

export default fieldErrorModel