
import isPlainObject from 'lodash-es/isPlainObject'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import isNumber from 'lodash-es/isNumber'
import isBoolean from 'lodash-es/isBoolean'

// @TODO: Concat these implementation to reduce
// fn calls
function isValidValue(value) {
  let type = typeof value
  return value !== undefined
    && (
      value === null ||
      isBoolean(value) ||
      isNumber(value) ||
      isString(value) ||
      isArray(value) ||
      isPlainObject(value)
    )
}

export default isValidValue
