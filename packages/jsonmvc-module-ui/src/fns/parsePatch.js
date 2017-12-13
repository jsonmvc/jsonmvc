
let opRegExpStr = '(add|merge|replace|remove)'
let separator = '\\s+'
let pathRegExpStr = '([\\/[a-zA-Z0-9]+)'
let pathOptRegExpStr = '(?:\\/[\\/[a-zA-Z0-9]+)'
let objRegExpStr = `(?:{.+?(?=}\s*(;|$)))`
let arrayRegExpStr = `(?:\\[.+?(?=\\]\s*(;|$)))`
let numberRegExpStr = `(?:-?(?:(?:[1-9]\\d*)|0)\\.?\\d*)`
let textRegExpStr = `(?:'.*?')|(?:".*?")` 
let htmlAttrRegExpStr = `(?:attr\.[^\\t\\n\\f\\s\\/>"'=]+)`

// @TODO: Split the remove patch test in another regex
// so that we can find precise matches for update operations
let patchReg =
  opRegExpStr
  + separator
  + pathRegExpStr
  + '(?:'
    + separator
    + '(' + pathOptRegExpStr + '|' + arrayRegExpStr + '|' + htmlAttrRegExpStr + '|' + textRegExpStr + '|' + numberRegExpStr + '|' + objRegExpStr + ')'
  + ')?'

function parsePatch(x) {

  let reg = new RegExp(patchReg, 'gi')

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

// @TODO: Find a way to include the trailing '}' char in the object
// regexp selection, until then this is a hack
      if (patch.value[0] === '{') {
        patch.value += '}'
      } else if (patch.value[0] === '[') {
        patch.value += ']'
      }
    }

    results.push(patch)
  }

  return results
}


export { objRegExpStr }
export { htmlAttrRegExpStr }
export { arrayRegExpStr }
export { numberRegExpStr }
export { textRegExpStr }
export { pathOptRegExpStr }
export default parsePatch