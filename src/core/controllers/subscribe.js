
import { forEach, isArray } from 'lodash'

function subscribe(db, controllers) {

  forEach(controllers, (value, key) => {
    value.unsubscribe = value.result.subscribe({
      next: x => {
        if (x && !isArray(x)) {
          x = [x]
        }
        db.patch(x)
      },
      complete: x => {
        console.log(`Controller ${name} has ended`)
      },
      error: x => {
        console.error(`Controller ${name} has an error`, x)
      }
    })
  })

}

module.exports = subscribe
