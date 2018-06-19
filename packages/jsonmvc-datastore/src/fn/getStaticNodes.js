

const getStaticNodes = (db, path) => {

  if (db.dynamic.fns[path]) {
    let deps = db.dynamic.deps[path]
    return _.flattenDeep(deps.map(x => getStaticNodes(db, x)))
  } else {
    return [path]
  }

}

export default getStaticNodes
