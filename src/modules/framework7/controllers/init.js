import { forEach } from 'lodash'

require('framework7')

module.exports = {
  args: {
    isMounted: '/app/isMounted'
  },
  fn: (stream, lib) => stream
    .filter(x => x.isMounted === true)
    .map(x => {
      let f7 = lib.get('/framework7')

      let app = new Framework7(f7.config)
      let views = {}

      forEach(f7.views, (val, key) => {
        db.on('/shouldMount/' + key, y => {
          if (y === true) {
            setTimeout(() => {
              views[key] = app.addView(`.view-${key}`, val)
            })
          }
        })
      })

      window.f7app = app

    })
    .map(x => ({
      op: 'add',
      path: '/views/f7',
      value: 'initialized'
    }))
}
