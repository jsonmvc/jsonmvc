
import getPath from './getPath'
import createDataListener from './createDataListener'

function updateInstanceData (db, schema, props, data, self, prop, val) {

  function parseToken(token) {
    // Unsubscribe all listeners for this prop
    if (props.schema.subscribes[token]) {
      props.schema.subscribes[token].forEach(y => y())
    }

    props.schema.subscribes[token] = []

    // For all the paths that are impacted by this prop
    if (props.schema.tokens[token] && props.schema.tokens[token].props) {
      props.schema.tokens[token].props.forEach(x => {
        let path = getPath(schema, props, self, x)

        self.paths[x] = path
        let listener = createDataListener(db, path, data, x)
        props.schema.subscribes[token].push(listener)

        if (props.schema.tokens[x]) {
          let toUpdate = props.schema.tokens[x].props
          let newVal = db.get(path)
          if (toUpdate) {
            toUpdate.forEach(y => {
              let uPath = schema[y]
              self.paths[y] = uPath.replace(new RegExp(props.schema.tokens[x].token, 'g'), newVal);
            })
          }
          parseToken(x)
        }

      })
    }
  }

  parseToken(prop)
}

export default updateInstanceData
