exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/,
      'app.js': [
        /^src/,
        /^test\/app/
       ]
    }
  }
}

exports.paths = {
  "public": 'public',
  "watched": ['test', 'src']
}