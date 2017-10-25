import padZero from './../../fns/padZero'

const model = {
  args: {
    ms: '/time/ms'
  },
  fn: args => {
    if (!args.ms) {
      return
    }

    let x = new Date(args.ms)
    let hh = padZero(x.getHours())
    let mm = padZero(x.getMinutes())
    let ss = padZero(x.getSeconds())

    return `${hh}:${mm}:${ss}`
  }
}

export default model
