
module.exports = {
  name: 'theContent',
  args: {
    title: '/foo',
    content: '/bam/<id>/<foo>/bar',
    pressedAt: '/ui/button/timestamp',
    ajaxContent: '/ajaxContent',
    ajaxRequestIds: '/ajax/ids',
    patched: '/patched'
  },
  el: `
    <div>
      <h2>Content {{ title }}</h2>
      <p>Patch was applied: {{ patched }}</p>
      {{ content }}
      <button data-path="/ui/button" data-value="5">Press me see '/ui/button'</button>
      <p>Button pressed at {{ pressedAt }}
      <p><strong>Ajax returned</strong> <br />{{ ajaxContent }}...</p>

      <ul>
        <ajax v-for="id in ajaxRequestIds" :id="id"></ajax>
      </ul>
    </div>
  `
}
