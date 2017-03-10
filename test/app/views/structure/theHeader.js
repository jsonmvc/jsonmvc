
module.exports = {
  name: 'theHeader',
  args: {
    title: '/baloo',
    foo: '/foo',
    time: '/time/hhmmss'
  },
  el: `
    <div>
      <p>Time: {{ time }}</p>
      <h1>Header: {{ title }}</h1>
      <theContent id="11" :foo="foo"></theContent>
      <theFooter></theFooter>
      <blam></blam>
    </div>
  `
}
