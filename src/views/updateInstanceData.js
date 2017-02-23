
const getPath = require('./getPath')
const createDataListener = require('./createDataListener')

function updateInstanceData(db, schema, props, data, self, prop, val) {

  // Unsubscribe all listeners for this prop
  props.schema.subscribes[prop].forEach(y => y())
  props.schema.subscribes[prop] = []

  // For all the paths that are impacted by this prop
  props.schema.tokens[prop].props.forEach(x => {
    let path = getPath(schema, props, self, x)

    let listener = createDataListener(db, path, data, x)

    props.schema.subscribes[prop].push(listener)
  })

}

module.exports = updateInstanceData
