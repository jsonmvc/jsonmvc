
function parsePatch(x) {

  let reg = /(add|merge|remove)\s([\/[a-z0-9]+)(?:\s([0-9]+|\[[a-z0-9\-]+\]|\'[a-z0-9]+\'|\"[a-z0-9]+\"|{[a-z\s0-9{}"':,]+}))?/gi

  let found
  let results = []
  while ((found = reg.exec(x)) !== null) {
    let op = found[1]
    let path = found[2]
    let value = found[3]

    let patch = {
      op,
      path
    }

    if (op !== 'remove') {
      patch.value = value
    }

    results.push(patch)
  }

  return results
}

export default parsePatch