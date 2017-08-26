
function stringify (obj) {
  let testObj = {
    args: obj.args
  }

  if (obj.path) {
    testObj.path = obj.path
  }

  if (obj.fn) {
    testObj.fn = obj.fn
  }

  if (obj.template) {
    testObj.template = obj.template
  }

  let result = JSON.stringify(testObj, function (key, val) {
    return (typeof val === 'function') ? val.toString() : val
  })

  return result
}

export default stringify
