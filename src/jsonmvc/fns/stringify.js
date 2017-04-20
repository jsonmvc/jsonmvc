
function stringify(obj) {
  return JSON.stringify(obj, function(key, val) {
    return (typeof val === 'function') ? val.toString() : val; },
  4)
}

module.exports = stringify
