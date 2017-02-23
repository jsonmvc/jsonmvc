

function createModels(db, models, schema) {
  let names = Object.keys(schema)

  let instances = names.reduce((acc, x) => {
    let model = schema[x]
    let path = x

    acc[x] = db.node(path, model.args, models[model.fn])

    return acc
  }, {})

  return instances
}

module.exports = createModels
