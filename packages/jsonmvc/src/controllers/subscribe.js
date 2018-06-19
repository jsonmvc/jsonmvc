
function subscribe (db, controller) {
  function applyPatch(x) {
    if (x && _.isArray(x)) {
      db.patch(x)
    } else if (x && !_.isArray(x)) {
      db.patch([x])
    } else {
      // console.warn(`Controller ${controller.name} did not return a patch`)
    }
  }
  return controller.result.subscribe({
    next: x => {
      if (x && x.then) {
        x.then(y => {
          applyPatch(y)
        })
      } else {
        applyPatch(x)
      }
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
