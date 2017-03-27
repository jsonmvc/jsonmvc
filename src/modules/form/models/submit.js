
import { transform } from 'lodash'

module.exports = {
  path: '/form/event/submit',
  args: ['/form/data'],
  fn: data => {

    let result = transform(data, (acc, v, k) => {
      if (v && v.submit) {
        acc[k] = {
          name: k,
          timestamp: v.submit.timestamp,
          value: transform(v, (acc2, v2, k2) => {
            if (k2 === 'submit') return
            acc2[k2] = v2.value
          })
        }
      }
    })

    return result
  }

}
