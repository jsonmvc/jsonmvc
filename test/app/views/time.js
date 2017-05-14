
module.exports = {
  name: 'time-model',
  args: {
    ms: '/time/ms',
    mm: '/time/mm',
    hh: '/time/hh',
    timeElapsed: '/timeElapsed'
  },
  template: `
    <div>
      <p>Seconds: {{ ms }} : {{ new Date(ms) }}</p>
      <p>Minutes: {{ mm }} : {{ new Date(mm) }}</p>
      <p>Hours: {{ hh }} : {{ new Date(hh) }}</p>
      <p>Time elapsed: {{ timeElapsed }}</p>
    </div>
  `
}
