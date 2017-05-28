import forEach from 'lodash-es/forEach'
import { stream, observer } from './../../../utils/index'

const controller = {
  args: {
    isMounted: '/app/isMounted'
  },
  fn: stream
    .filter(x => x.isMounted === true)
    .chain((x, lib) => observer(o => {
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

      if (f7.calendar) {
        db.on('/views/f7form/instances', x => {
          forEach(x, (val, key) => {
            if (!val.destroyedAt) {
              let inputs = document.querySelectorAll(`[view-id="${val.viewid}"] ${f7.calendar.input}`)

              if (null !== inputs) {
                inputs.forEach(x => {
                  let config = Object.assign({}, f7.calendar, { input: x })
                  app.calendar(config)
                })

                o.next({
                  op: 'add',
                  path: '/views/f7form/instances/' + key + '/calendar',
                  value: true
                })
              }

            }
          })
        })
      }

      window.f7app = app

      o.next({
        op: 'add',
        path: '/views/f7',
        value: 'initialized'
      })
    }))
}

export default controller
