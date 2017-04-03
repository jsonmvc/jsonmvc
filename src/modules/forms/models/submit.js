
import { transform } from 'lodash'
import { forEach } from 'lodash'

module.exports = {
  path: '/forms/submit',
  args: ['/forms/data'],
  fn: data => {

    let result = transform(data, (acc, v, k) => {
      acc[k] = {}
      forEach(v, (v2, k2) => {
        if (v2 && v2.submit) {
          acc[k][k2] = {
            name: k,
            timestamp: v2.submit.timestamp,
            uid: v2.submit.value,
            value: transform(v2, (acc2, v3, k3) => {
              if (k3 === 'submit') return
              acc2[k3] = v3.value
            })
          }
        }
      })
    })

    return result
  }

}
