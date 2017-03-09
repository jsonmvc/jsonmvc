import * as most from 'most'
import { clone } from 'lodash'
import shortid from 'shortid'

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%^')

module.exports = function ajax(namespace, db) {
  return function createRequest(request) {

    request = clone(request)

    request = {
      id: shortid.generate(),
      url: request.url,
      headers: request.headers ? request.headers : {},
      labels: request.labels ? request.labels : [request.url],
      method: request.method,
      createdAt: new Date().getTime(), // db.get('/time/ms'),
      readyState: 0,
      maxAttempts: 3,
      attempts: 0,
      patch: request.patch,
      data: request.data
    }

    if (request.patch === true) {
      request.headers['content-type'] = 'application/json'
    }

    /**
     * Check if there is a current ajax pending on this 
     * url and just increment a calls attribute on the
     * request object
     *
    let lastReq = db.get(`/ajax/lastById/${request.id}`)
    if (lastReq && lastReq.url === request.url && !lastReq.receivedAt) {
      db.on(`/ajax/data/${request.id}`)
        .filter(propEq('readyState', 4))
        .take(1)
        .onValue(x => emitter.emit('data', x))
      return
    }
    */

    // Save request on the state
   return {
      op: 'add',
      path: `/ajax/data/${request.id}`,
      value: request
    }
  }
}
