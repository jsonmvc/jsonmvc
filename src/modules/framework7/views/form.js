
module.exports = {
  name: 'f7form',
  args: {
    fieldList: '<fields>'
  },
  props: ['path', 'uid'],
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

      // Password Input
      .item-content(v-if="field.type === 'password'")
        .item-inner
          .item-title.label {{ field.label.en }}
          .item-input
            input(type='password', :data-path="path + '/' + field.key", :placeholder='field.placeholder.en', :name="field.key", :value="field.value")

      // Number Input
      .item-content(v-if="field.type === 'number'")
        .item-inner
          .item-title.label {{ field.label.en }}
          .item-input
            input(type='text', :data-path="path + '/' + field.key", :placeholder='field.placeholder.en', :name="field.key", :value="field.value")

      // Date Input
      .item-content(v-if="field.type === 'date'")
        .item-inner
          .item-title.label {{ field.label.en }}
          .item-input
            input(type='date', :data-path="path + '/' + field.key", :placeholder='field.placeholder.en', :name="field.key", :value="field.value")

      // Textarea
      .item-content(v-if="field.type === 'textarea'")
        .item-inner
          .item-title.label {{ field.label.en }}
          .item-input
            textarea(:data-path="path + '/' + field.key", :placeholder='field.placeholder.en', :name="field.key", :value="field.value")

      // Select
      a.item-link.smart-select(href='#', v-if="field.type === 'choice' && !field.style || field.style === 'select'", data-open-in="picker")
        select(:name='field.key', :data-path="path + '/' + field.key")
          option(value="") Not selected
          option(v-for="(value, key) in field.options", :value="key", :selected="field.value === key") {{ value.label.en }}
        .item-content
          .item-inner
            .item-title {{ field.label.en }}
            .item-after Choose

      // Radio
      div(v-if="field.type === 'choice' && field.style === 'radio'")
        .content-title {{ field.label.en }}
        ul
          li(v-for="(value, key) in field.options")
            .item-content
              .item-input
                input(type="radio", :name="field.key", :value="key")
              .item-inner
                .item-title {{ value.label.en }}

  .content-block
    a.button(href="#", :data-path="path + '/submit'", :data-value="uid") Submit

  `
}
