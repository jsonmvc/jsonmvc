
function getValue (el, prop) {
  let val
  
  if (prop === 'value') {
    val = el[prop]
  } else {
    val = el.getAttribute(prop)
  }

  // Handle return case
  if (typeof val === 'string') {
    val = val.replace(/\r/g, '')
  }

  // Handle null, undefined
  val = val == null ? '' : val

  return val
}

export default getValue
