
module.exports = {
  path: '/ajax/toPatch',
  args: ['/ajax/byStatus/succesful'],
  fn: data => {
    return Object.keys(data).reduce((acc, x) => {
      let request = data[x]

      if (request.patch === true && !request.patchedAt) {
        acc[x] = request
      }

      return acc
    }, {})
  }
}
