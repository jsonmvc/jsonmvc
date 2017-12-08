
module.exports = function emptySchema(schema, data) {
  data = data || {}

  if (schema.type === 'object' && schema.properties) {
    for (let i in schema.properties) {
      data[i] = emptySchema(schema.properties[i])
    }
  } else if (schema.type === 'array') {
    data = []
  } else {
    data = null
  }

  return data
}