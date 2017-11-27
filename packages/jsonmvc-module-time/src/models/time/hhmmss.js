import padZero from './../../fns/padZero'

const model = {
  args: {
    ms: '/time/ms'
  },
  fn: ({ ms }) => {
    if (!ms) {
      return
    }

    let x = new Date(ms)
    let hh = padZero(x.getHours())
    let mm = padZero(x.getMinutes())
    let ss = padZero(x.getSeconds())

    return `${hh}:${mm}:${ss}`
  }
}

export default model
