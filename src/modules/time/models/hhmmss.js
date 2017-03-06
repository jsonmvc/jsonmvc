import padZero from './../fns/padZero'

module.exports = {
  path: '/time/hhmmss',
  args: ['/time/ms'],
  fn: x => {
    x = new Date(x)
    let hh = padZero(x.getHours())
    let mm = padZero(x.getMinutes())
    let ss = padZero(x.getSeconds())

    return `${hh}:${mm}:${ss}`
  }
}
