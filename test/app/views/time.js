
module.exports = {
  name: 'timeModel',
  args: {
    ms: '/time/ms',
    mm: '/time/mm',
    hh: '/time/hh'
  },
  template: `
    <div>
      <p>Seconds: {{ ms }} : {{ new Date(ms) }}</p>
      <p>Minutes: {{ mm }} : {{ new Date(mm) }}</p>
      <p>Hours: {{ hh }} : {{ new Date(hh) }}</p>
    </div>
  `
}
