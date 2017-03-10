
import { forEach, isArray } from 'lodash'

function subscribe(db, controller) {
  return controller.result.subscribe({
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
}

module.exports = subscribe
