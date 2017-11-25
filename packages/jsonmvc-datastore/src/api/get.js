
import getNode from './../fn/getNode'
import isValidPath from './../fn/isValidPath'

/**
 * get
 *
 * Gets a value
 */
const get = db => path => {

  if (!isValidPath(path)) {
    return
  }

  return getNode(db, path)
}

export default get
