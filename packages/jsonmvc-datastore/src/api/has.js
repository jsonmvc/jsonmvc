
import pathExists from './../fn/pathExists'

/**
 * has
 *
 * Checks if a path exists
 */
const has = db => path => {
  return pathExists(db, path)
}

export default has
