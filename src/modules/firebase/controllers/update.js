import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'

module.exports = {
  args: '/firebase/sync',
  stream: (stream, lib) => stream
    .chain(sync => lib.observable(observer => {
      let db = lib.firebase().database

      function saveOrUpdate(location) {
        return function (saveValues) {
          let ref

          if (isEmpty(saveValues)) {
            return
          }

          forEach(saveValues, (val, key) => {

            observer.next({
              op: 'remove',
              path: '/forms/data/' + val.name + '/' + key
            })

            if (isEmpty(val.uid)) {
              ref = db.ref(location).push()
              val.value.key = ref.key
              ref.set(val.value)
            } else {
              ref = db.ref(location + '/' + val.uid)
              ref.update(val.value)
            }

          })
        }
      }

      function deleteFn(path, location) {
        return function (values) {
          forEach(values, x => {
            db.ref(location + '/' + x.value).remove()
            observer.next({
              op: 'remove',
              path: path + '/' + x.value
            })
          })
        }
      }

      forEach(sync, (val, key) => {

        if (val.on) {
          lib.on(val.on, saveOrUpdate(key))
        }

        if (val.delete) {
          lib.on(val.delete, deleteFn(val.delete, key))
        }

      })

    }))
}

