exports.files = {
  javascripts: {
    joinTo: {
//      'vendor.js': /^(?!app)/,
      'app.js': [
        /^src/,
//        /^test\/app/,
        /^(?!app)/
       ]
    }
  }
}

exports.paths = {
  "public": 'dist',
  "watched": ['test', 'src']
}

exports.plugins = {
   babel: {
    presets: ['latest', 'react'],
    sourceType: "module"
  }
}