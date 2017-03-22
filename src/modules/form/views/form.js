
module.exports = {
  name: 'jsonmvcForm',
  args: {
    key: '/form/data/<namespace>/key',
    fieldList: '/form/data/<namespace>/fields'
  },
  template: pug `

.content-block

  .list-block
    ul
      li(v-for="field in fieldList")

        // Text Input
        .item-content(v-if="field.type === 'text'")
          .item-inner
            .item-title.label {{ field.label.en }}
            .item-input
              input(type='text', :data-path="'/form/data/' + key + '/data/' + field.key", :placeholder='field.placeholder.en', :name="field.key")

        // Email Input
        .item-content(v-if="field.type === 'email'")
          .item-inner
            .item-title.label {{ field.label.en }}
            .item-input
              input(type='email', :data-path="'/form/data/' + key + '/data/' + field.key", :placeholder='field.placeholder.en', :name="field.key")

        // Number Input
        .item-content(v-if="field.type === 'number'")
          .item-inner
            .item-title.label {{ field.label.en }}
            .item-input
              input(type='text', :data-path="'/form/data/' + key + '/data/' + field.key", :placeholder='field.placeholder.en', :name="field.key")

        // Select
        a.item-link.smart-select(href='#', v-if="field.type === 'choice'", data-open-in="picker")
          select(:name='field.key', :data-path="'/form/data/' + key + '/data/' + field.key")
            option(v-for="(value, key) in field.options", :value="key") {{ value.label.en }}
          .item-content
            .item-inner
              .item-title {{ field.label.en }}
              .item-after Choose

  a.button(href="#", :data-path="'/form/data/' + key + '/data/submit'", data-value="") Submit

  `
}
