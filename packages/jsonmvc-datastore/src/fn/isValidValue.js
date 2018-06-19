
// @TODO: Concat these implementation to reduce
// fn calls
function isValidValue(value) {
  let type = typeof value
  return value !== undefined
    && (
      value === null ||
      _.isBoolean(value) ||
      _.isNumber(value) ||
      _.isString(value) ||
      _.isArray(value) ||
      _.isPlainObject(value)
    )
}

export default isValidValue
