import { reduce } from 'lodash'

module.exports = {
  path: '/forms/clear_bkp',
  args: {
    submit: '/forms/submit'
  },
  fn: args => {
    return reduce(args.submit, (acc, v, k) => {
      Object.keys(v).forEach(id => {
        acc.push({
          name: k,
          id: id
        })
      })
      return acc
    }, [])
  }
}
