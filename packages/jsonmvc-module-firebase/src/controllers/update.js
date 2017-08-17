import forEach from 'lodash-es/forEach'
import isEmpty from 'lodash-es/isEmpty'
import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

const controller = {
  args: {
    sync: '/firebase/sync'
  },
  fn: stream
    .filter(x => !!x.sync)
    .chain((x, lib) => observer(o => {
      let db = firebase().database

      function saveOrUpdate(location) {
        return function (saveValues) {
          let ref

          if (isEmpty(saveValues)) {
            return
          }

          forEach(saveValues, (val, key) => {

            if (isEmpty(val.uid)) {
              ref = db.ref(location).push()
              val.value.key = ref.key
              ref.set(val.value)
            } else {
              ref = db.ref(location + '/' + val.uid)
              ref.update(val.value)
            }

            o.next({
              op: 'add',
              path: '/forms/clear/' + val.name + key,
              value: {
                timestamp: val.timestamp,
                name: val.name,
                id: key
              }
            })

          })
        }
      }

      function deleteFn(path, location) {
        return function (values) {
          forEach(values, x => {
            db.ref(location + '/' + x.value).remove()
          })
        }
      }

      forEach(x.sync, (val, key) => {

        if (val.namespace) {
          key = val.namespace + '/' + key
        }

        if (val.on) {
          lib.on(val.on, saveOrUpdate(key))
        }

        if (val.delete) {
          lib.on(val.delete, deleteFn(val.delete, key))
        }

      })

    }))
}

export default controller
