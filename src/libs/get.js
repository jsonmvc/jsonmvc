
module.exports = function get(db) {
  return function getData(path) {
    return db.get(path)
  }
}
