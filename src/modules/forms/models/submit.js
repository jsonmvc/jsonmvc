
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
          let lastTimestamp
          let submitTimestamp

          acc[k][k2] = {
            name: k,
            timestamp: v2.submit.timestamp,
            uid: v2.submit.value,
            value: transform(v2, (acc2, v3, k3) => {
              if (k3 === 'submit') {
                submitTimestamp = v3.timestamp
                return
              }
              acc2[k3] = v3.value
              if (!lastTimestamp || lastTimestamp < v3.timestamp) {
                lastTimestamp = v3.timestamp
              }
            })
          }

          if (lastTimestamp > submitTimestamp) {
            delete acc[k][k2]
          }

        }
      })

    })

    return result
  }

}
