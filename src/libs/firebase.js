
function firebaseFn(db) {
  return function getInstance() {
    let instance

    if (firebase.apps.length === 1) {
      instance = {
        database: firebase.database(),
        storage: firebase.storage(),
        auth: firebase.auth()
      }
    } else if (firebase.apps.length > 1) {
      throw new Error('No support for multiple Firebase instances')
    }

    return  instance
  }
}

export default firebaseFn
