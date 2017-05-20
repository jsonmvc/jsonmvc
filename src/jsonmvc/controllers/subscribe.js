
import isArray from 'lodash-es/isArray'

function subscribe(db, controller) {
  return controller.result.subscribe({
    next: x => {
      if (x && !isArray(x)) {
        x = [x]
      }
      db.patch(x)
    },
    complete: x => {
      console.log(`Controller ${controller.name} has ended`)
    },
    error: x => {
      console.error(`Controller ${controller.name} has an error`, x)
    }
  })
}

export default subscribe
