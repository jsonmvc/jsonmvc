
module.exports = function getValue(el) {
  let val = el.value

  // Handle return case
  if (typeof val === 'string') {
    val = val.replace(/\r/g, '')
  }

  // Handle null, undefined
  val = val == null ? "" : val

  return val
}
