
import get from './getValue'
import applyPatch from './applyPatch'

function errPatch(db, path, obj) {
  var err = get(db.static, path)

  err.value = obj
  err.id = path

  applyPatch(db, [{
    op: 'add',
    path: `/err/${err.name}/-`,
    value: err
  }], true)

}

export default errPatch
