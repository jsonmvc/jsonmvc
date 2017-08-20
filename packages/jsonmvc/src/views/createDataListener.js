
function createDataListener (db, path, data, prop) {
  // @TODO: Remove when db.on returns also undefined values
  let v = db.get(path)
  if (undefined !== v) {
    // @TODO: Remove when db.get returns a copy of its caching
    // instead of the actual cache
    v = JSON.parse(JSON.stringify(v))
  }

  data[prop] = v

  // Listen on next values
  return db.on(path, v => {
    if (undefined !== v) {
      v = JSON.parse(JSON.stringify(v))
    }
    data[prop] = v
  })
}

export default createDataListener
