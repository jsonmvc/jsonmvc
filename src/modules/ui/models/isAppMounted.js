
import { isEmpty } from 'lodash'

module.exports = {
  path: '/app/isMounted',
  args: {
    name: '/config/ui/mount/component',
    views: '/views'
  },
  fn: args => {
    if (args.views && args.views[args.name] && !isEmpty(args.views[args.name].instances)) {
      return true
    } else {
      return false
    }
  }
}
