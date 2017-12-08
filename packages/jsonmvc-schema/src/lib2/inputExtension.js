
module.exports = function inputExtension(data) {

  let input = {}
  if (data.type === 'object') {
    input.type = 'object'
    input.properties = {}

    for (let i in data.properties) {
      let val = data.properties[i]

      if (val.type === 'object') {
        input.properties[i] = {
          type: 'object',
          properties: {}
        }
        for (let x in val.properties) {
          input.properties[i].properties[x] = inputExtension(val.properties[x])
        }
      } else {
        input.properties[i] = inputExtension(val)
      }
    }
  } else if (data.type === 'array') {
    input = {
      $ref: 'types.valueArray'
    }
  } else {
    input = {
      $ref: 'types.valueInput'
    }
  }
  return input
}