
module.exports = {
  name: 'ajax',
  args: {
    request: '/ajax/data/<id>'
  },
  el: `
    <li>
      <p>Request id {{ request.id }}</p>
      <div v-for="(value, key) in request" v-if="key !== 'response' && key !== 'responseText'">
        <strong>{{ key }}</strong>: {{ value }}
      </div>
    </li>
  `
}
