
const view = {
  args: {
    fieldList: '<fields>'
  },
  props: ['path', 'uid', 'lang'],
  template: `
<div class="list-block">
  <ul>
    <li v-for="field in fieldList" :data-field-name="field.key" :data-field-type="field.type" :data-field-style="field.style">
      <!-- Text Input-->
      <div class="item-content" v-if="field.type === 'text'">
        <div class="item-inner">
          <div class="item-title label">{{ field.label[lang] }}</div>
          <div class="item-input">
            <input type="text" :data-path="path + '/' + field.key" :placeholder="field.placeholder[lang]" :name="field.key" :value="field.value"/>
          </div>
        </div>
      </div>
      <!-- Email Input-->
      <div class="item-content" v-if="field.type === 'email'">
        <div class="item-inner">
          <div class="item-title label">{{ field.label[lang] }}</div>
          <div class="item-input">
            <input type="email" :data-path="path + '/' + field.key" :placeholder="field.placeholder[lang]" :name="field.key" :value="field.value"/>
          </div>
        </div>
      </div>
      <!-- Password Input-->
      <div class="item-content" v-if="field.type === 'password'">
        <div class="item-inner">
          <div class="item-title label">{{ field.label[lang] }}</div>
          <div class="item-input">
            <input type="password" :data-path="path + '/' + field.key" :placeholder="field.placeholder[lang]" :name="field.key" :value="field.value"/>
          </div>
        </div>
      </div>
      <!-- Number Input-->
      <div class="item-content" v-if="field.type === 'number'">
        <div class="item-inner">
          <div class="item-title label">{{ field.label[lang] }}</div>
          <div class="item-input">
            <input type="text" :data-path="path + '/' + field.key" :placeholder="field.placeholder[lang]" :name="field.key" :value="field.value"/>
          </div>
        </div>
      </div>
      <!-- Date Input-->
      <div class="item-content" v-if="field.type === 'date'">
        <div class="item-inner">
          <div class="item-title label">{{ field.label[lang] }}</div>
          <div class="item-input">
            <input type="text" onfocus="(this.type='date')" onblur="(this.type='text')" :data-path="path + '/' + field.key" :placeholder="field.placeholder[lang]" :name="field.key" :value="field.value"/><span class="clear" :data-path="path + '/' + field.key" data-value=""></span>
          </div>
        </div>
      </div>
      <!-- Textarea-->
      <div class="item-content" v-if="field.type === 'textarea'">
        <div class="item-inner">
          <div class="item-title label">{{ field.label[lang] }}</div>
          <div class="item-input">
            <textarea :data-path="path + '/' + field.key" :placeholder="field.placeholder[lang]" :name="field.key" :value="field.value"></textarea>
          </div>
        </div>
      </div>
      <!-- Select--><a class="item-link smart-select" href="#" v-if="field.type === 'choice' &amp;&amp; !field.style || field.style === 'select'" data-open-in="picker">
        <select :name="field.key" :data-path="path + '/' + field.key">
          <option value="">Not selected</option>
          <option v-for="(value, key) in field.options" :value="key" :selected="field.value === key">{{ value.label[lang] }}</option>
        </select>
        <div class="item-content">
          <div class="item-inner">
            <div class="item-title">{{ field.label[lang] }}</div>
            <div class="item-after">{{ field.placeholder[lang] }}</div>
          </div>
        </div></a>
      <!-- Radio-->
      <div v-if="field.type === 'choice' &amp;&amp; field.style === 'radio'">
        <div class="content-title">{{ field.label[lang] }}</div>
        <ul>
          <li v-for="(value, key) in field.options" :data-value="key">
            <label class="item-content label-radio">
              <input type="radio" :name="field.key" :value="key" :data-path="path + '/' + field.key" :data-value="key" :checked="field.value === key"/>
              <div class="item-inner">
                <div class="item-title">{{ value.label[lang] }}</div>
              </div>
            </label>
          </li>
        </ul>
      </div>
    </li>
  </ul>
  <div class="content-block"><a class="button" href="#" :data-path="path + '/submit'" :data-value="uid">Submit</a></div>
</div>
  `
}

export default view
