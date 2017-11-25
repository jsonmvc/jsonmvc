
import getValue from './../fn/getValue'
import decomposePath from './../fn/decomposePath'
import uniq from 'uniq'
import splitPath from './../fn/splitPath'
import isPatch from './../fn/isPatch'
import applyPatch from './../fn/applyPatch'
import invalidateCache from './../fn/invalidateCache'
import err from './../fn/err'

/**
 * patch
 *
 * Applies a patch
 */
const patch = db => (patch, shouldValidate, shouldClone) => {

  shouldValidate = shouldValidate !== undefined ? shouldValidate : true
  shouldClone = shouldClone !== undefined ? shouldClone : true

  if (shouldValidate && !isPatch(db.schema, patch)) {
    err(db, '/err/types/patch/1', patch)
    return
  }

  if (shouldValidate) {
    try {
      patch = JSON.parse(JSON.stringify(patch))
    } catch (e) {
      err(db, '/err/types/patch/3', {})
      return
    }
  }

  // @TODO by the way object data that is passed
  // through reference might need copying before
  // applying the patch
  let result = applyPatch(db, patch, shouldClone)

  if (result.revert !== undefined) {
    err(db, '/err/types/patch/2', patch)
    return result
  }
}

export default patch
