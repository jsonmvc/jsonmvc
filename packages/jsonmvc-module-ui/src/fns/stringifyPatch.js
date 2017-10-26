
function stringifyPatch(x) {

  x = x.reduce((acc, z, i) => {
    acc += `${z.op} ${z.path}`

    if (z.value) {
      acc += ` ${z.value}`
    }

    if (i !== x.length - 1) {
      acc += '; '
    }

    return acc
  }, '')

  return x
}

export default stringifyPatch