
module.exports = {
  name: 'forms-test',
  args: {
    quxes: '/compiled/qux',
    editQux: '/qux/edit'
  },
  template: `
    <div class="views">
      <div class="view">

      <h2>Forms test using qux</h2>
      <div>
        <h3>Add new qux:</h3>
        <f7form fields="/fields/create/qux" path="/forms/data/qux/1" lang="en"></f7form>
        <h3>Edit current quxes:</h3>
        <div v-for="(val, key) in quxes">
          <p v-if="!editQux || !editQux[key]">
            {{ val }}
            <button :data-path="'/qux/edit/' + key">Edit</button>
            <button :data-path="'/qux/delete/' + key" :data-value="key">Delete</button>
          </p>
          <f7form lang="en" v-if="editQux && editQux[key]" :fields="'/fields/update/qux/' + key" :uid="key" :path="'/forms/data/qux/'+ key"></f7form>
        </div>
      </div>

      </div>

    </div>
  `
}
