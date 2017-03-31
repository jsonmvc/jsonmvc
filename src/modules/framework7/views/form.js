
module.exports = {
  name: 'f7form',
  args: {
    fieldList: '<fields>'
  },
  props: ['path'],
  template: pug `

.list-block
  ul
    li(v-for="field in fieldList")

      // Text Input
      .item-content(v-if="field.type === 'text'")
        .item-inner
          .item-title.label {{ field.label.en }}
          .item-input
            input(type='text', :data-path="path + '/' + field.key", :placeholder='field.placeholder.en', :name="field.key", :value="field.value")

      // Email Input
      .item-content(v-if="field.type === 'email'")
        .item-inner
          .item-title.label {{ field.label.en }}
          .item-input
            input(type='email', :data-path="path + '/' + field.key", :placeholder='field.placeholder.en', :name="field.key", :value="field.value")

      // Number Input
      .item-content(v-if="field.type === 'number'")
        .item-inner
          .item-title.label {{ field.label.en }}
          .item-input
            input(type='text', :data-path="path + '/' + field.key", :placeholder='field.placeholder.en', :name="field.key", :value="field.value")

      // Select
      a.item-link.smart-select(href='#', v-if="field.type === 'choice'", data-open-in="picker")
        select(:name='field.key', :data-path="path + '/' + field.key")
          option(v-for="(value, key) in field.options", :value="key", :selected="field.value === key") {{ value.label.en }}
        .item-content
          .item-inner
            .item-title {{ field.label.en }}
            .item-after Choose

  .content-block
    a.button(href="#", :data-path="path + '/submit'", data-value="") Submit

  `
}
