
function on(db) {
  return function onPath(path, fn) {
    return db.on(path, fn)
  }
}

export default on
