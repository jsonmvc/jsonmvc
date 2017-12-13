
function stringifyPatch(x) {

  x = x.reduce((acc, z, i) => {
    acc += `${z.op} ${z.path}`

    if (z.value) {
      let type = typeof z.value 
      if (type === 'string') {
        acc += ` ${z.value}`
      } else if (type === 'number') {
        acc += ` ${z.value}`
      } else if (type === 'object') {
        acc += ` ${JSON.stringify(z.value)}`
      }
    }

    if (i !== x.length - 1) {
      acc += '; '
    }

    return acc
  }, '')

  return x
}

export default stringifyPatch