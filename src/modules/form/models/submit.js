
import { transform } from 'lodash'

module.exports = {
  path: '/form/event/submit',
  args: ['/form/data'],
  fn: data => {

    let result = transform(data, (acc, v, k) => {
      if (v.data.submit) {
        acc[k] = {
          namespace: k,
          timestamp: v.data.submit.timestamp,
          value: transform(v.data, (acc2, v2, k2) => {
            if (k2 === 'submit') return
            acc2[k2] = v2.value
          })
        }
      }
    })

    return result
  }

}
