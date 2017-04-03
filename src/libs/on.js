
module.exports = function on(db) {
  return function onPath(path, fn) {
    return db.on(path, fn)
  }
}
