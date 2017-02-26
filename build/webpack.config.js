import { Config, environment } from 'webpack-config'

environment.setAll({
    env: function() {
        return process.env.NODE_ENV
    }
});

module.exports = new Config().extend('./webpack.[env].js');
