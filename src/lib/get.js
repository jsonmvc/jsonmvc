
module.exports = function get(namespace, db) {
  return function getData(path) {
    return db.get(path)
  }
}
