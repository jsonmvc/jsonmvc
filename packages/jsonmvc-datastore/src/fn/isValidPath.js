
function isValidPath(path) {
  return _.isString(path) && /^(\/[a-z0-9~\\\-%^|"\ _]*)+$/gi.test(path)
}

export default isValidPath
