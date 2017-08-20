module.exports = {
  name: 'login',
  args: {
    authError: '/firebase/emailAuth/error',
    sessionError: '/firebase/session/error',
    isValid: '/firebase/session/isValid',
    privateInfo: '/data/privateInfo'
  },
  template: pug`
.login
  h1 User section
  div(v-if="isValid !== true")
    f7form(lang="en", fields="/fields/create/login", path="/forms/data/login/new")
    p(v-if="authError") {{ authError.message }}
  div(v-if="isValid")
    p User is signed in
    button(style="background: red;", data-path="/signout") Logout
  p(v-if="sessionError") Session error: {{ sessionError.message }}
  p The private info is: {{ privateInfo }}
`
}
