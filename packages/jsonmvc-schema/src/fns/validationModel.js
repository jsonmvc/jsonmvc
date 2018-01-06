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
      let errors = ajv.errors

      if (!result && errors) {
        errors = errors.map(x => {
          if (x.keyword === 'required') {
            x.message = 'The field ' + x.dataPath + ' is required.'
          }
          return x
        });
        return {
          store: errors.reduce((acc, x) => {
            let path = x.dataPath
            let parts = path.split('.')
            parts.shift()

            let cur = acc
            let part
            while (parts.length) {
              part = parts.shift()
              if (!cur[part]) {
                cur[part] = {}
              }
            }
            cur[part] = x.message.replace(x.dataPath, part)
            return acc
          }, {}),
          list: errors,
          count: errors.length
        }
      } else {
        return
      }
    }
  }
}

export default validationModel