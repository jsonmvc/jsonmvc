
import { isEmpty } from 'lodash'

module.exports = {
  path: '/app/isMounted',
  args: [
    '/config/ui/mount/component',
    '/views'
  ],
  fn: (name, views) => {
    if (views && views[name] && !isEmpty(views[name].instances)) {
      return true
    } else {
      return false
    }
  }
}
