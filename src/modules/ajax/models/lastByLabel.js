import isNewer from './../fns/isNewer'

module.exports = {
  path: '/ajax/lastByLabel',
  args: ['/ajax/byLabel'],
  fn: data => {
    return Object.keys(data).reduce((acc, x) => {
      acc[x] = Object.keys(data[x]).reduce((acc2, y) => {
        let o = data[x][y]

        if (!acc2 || isNewer(acc, o)) {
          acc2 = o
        }

        return acc2
      }, undefined)
      return acc
    }, {})
  }
}
