
module.exports = {
  name: 'theContent',
  args: {
    title: '/foo',
    content: '/bam/<id>/<foo>/bar',
    pressedAt: '/ui/button/timestamp',
    ajaxContent: '/ajaxContent',
    ajaxRequestIds: '/ajax/ids',
    patched: '/patched',
    lastAjax: '/ajax/lastByLabel/google/createdAt',
    observable: '/observable'
  },
  template: `
    <div>
      <timeModel></timeModel>

      <firebase></firebase>

      <div>
        <h3>Form jsonmvc:</h3>
        <f7form fields="/qux/fields" store="/qux/data"></f7form>
      </div>

      <h2>Content 12321 {{ title }}</h2>
      <h2>Observable {{ observable }}</h2>
      <p>Patch was applied: {{ patched }}</p>
      {{ content }}
      <button data-path="/ui/button" data-value="5">Press me see '/ui/button'</button>
      <p>Button pressed at {{ pressedAt }}
      <p>Last ajax was at: {{ lastAjax }}</p>
      <p><strong>Ajax returned</strong> <br />{{ ajaxContent }}...</p>

      <ul>
        <ajax v-for="id in ajaxRequestIds" :id="id"></ajax>
      </ul>
    </div>
  `
}
