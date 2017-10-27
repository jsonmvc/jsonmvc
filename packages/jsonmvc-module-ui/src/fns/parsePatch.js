
let text = '[a-z0-9\-+&\/]*'
let op = '(add|merge|replace)'
let separator = '\\s'
let path = '([\\/[a-z0-9]+)'
let valueObj = `({[a-z\\s0-9{}"':,]+})`

let valueNumber = `-?(?:(?:[1-9]\d*)|0)\.?\d*`
let valueText = `('.*?')` 
let patchReg =
  op +
  separator +
  path +
  `(?:\\s([0-9]+|\\[[a-z0-9\-]+\\]|\\'[a-z0-9]+\\'|\\"[a-z0-9]+\\"|))?`

let updateReg =
  '(add|replace)' +
  separator +
  path +
  separator +
  '(?:' + valueText + '|' + valueNumber + ')'

let removeReg = 
  '(remove)' +
  separator +
  path

let mergeReg = 
  '(merge)' +
  separator +
  path +
  separator +
  valueObj

function parsePatch(x) {

  let reg = new RegExp(updateReg, 'gi')

  let found
  let results = []
  while ((found = reg.exec(x)) !== null) {
    let op = found[1]
    let path = found[2]
    let value = found[3] || found[4]

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