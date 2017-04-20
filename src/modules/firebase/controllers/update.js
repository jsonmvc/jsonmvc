import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'

module.exports = {
  args: {
    sync: '/firebase/sync'
  },
  fn: (stream, lib) => stream
    .chain(x => lib.observable(observer => {
      let db = lib.firebase().database

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

        if (val.on) {
          lib.on(val.on, saveOrUpdate(key))
        }

        if (val.delete) {
          lib.on(val.delete, deleteFn(val.delete, key))
        }

      })

    }))
}

