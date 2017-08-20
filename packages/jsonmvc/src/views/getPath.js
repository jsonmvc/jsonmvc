
function getPath (schema, props, instance, prop) {
  let path = schema[prop]
  let usedProps = props.schema.paths[path]

  // The path can have multiple props required
  usedProps.forEach(y => {
    path = path.replace(new RegExp(props.schema.tokens[y].token, 'g'), instance[y])
  })

  return path
}

export default getPath
