
module.exports = {
  name: 'firebase',
  args: {
    sample: '/sample/data'
  },
  template: `
    <div>
      <h3>Firebase module:</h3>
      <ul>
        <li v-for="entry in sample">
          <p>{{ entry }}</p>
        </li>
      </ul>
    </div>
  `
}

