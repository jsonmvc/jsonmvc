
module.exports = {
  name: 'bang',
  args: {
    title: '/bam/<id>'
  },
  template: `
    <div>
      {{ id }} -
      {{ title }}
    </div>
  `
}
