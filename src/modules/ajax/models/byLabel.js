
module.exports = {
  path: '/ajax/byLabel',
  args: ['/ajax/data'],
  fn: data => {
    return Object.keys(data).reduce((acc, x) => {
      let request = data[x]

      request.labels.forEach(y => {
        if (!acc[y]) {
          acc[y] = {}
        }

        acc[y][request.id] = request
      })

      return acc

    }, {})
  }
}
