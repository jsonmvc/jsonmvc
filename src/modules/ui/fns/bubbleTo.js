
function bubbleTo(selector, e) {
  let el = e.target

  if (!el) {
    return el
  }

  while (!el.matches(selector) && !el.matches('body')) {
    el = el.parentElement

    if (!el) {
      return el
    }
  }

  if (el.matches('body')) {
    el = null
  }

  return el
}

export default bubbleTo
