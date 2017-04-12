
module.exports = {
  name: 'the-header',
  args: {
    title: '/baloo',
    foo: '/foo',
    time: '/time/hhmmss'
  },
  template: `
    <div>
      <p>Time: {{ time }}</p>
      <h1>Header: {{ title }}</h1>
      <the-content id="11" :foo="foo"></the-content>
      <the-footer></the-footer>
      <blam></blam>
    </div>
  `
}
