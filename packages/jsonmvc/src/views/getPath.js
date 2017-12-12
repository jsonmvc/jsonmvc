
function getPath (schema, props, instance, prop) {
  let path = schema[prop]
  let usedProps = props.schema.paths[path]

  // The path can have multiple props required
  usedProps.forEach(y => {
    let val
    if (instance.paths && instance.paths[y]) {
      val = db.get(instance.paths[y])
    } else {
      val = instance[y]
    }
    path = path.replace(new RegExp(props.schema.tokens[y].token, 'g'), val);
  })

  return path
}

export default getPath
