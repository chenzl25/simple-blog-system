var webpackConfig = require('../webpack.config.pro.js');
// webpackConfig.entry = {};
module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      // 'node_modules/angular/angular.js',
      // 'node_modules/angular-route/angular-route.js',
      // './node_modules/angular-mocks/angular-mocks.js',
      // 'src/scripts/**/*.js',
      // './dist/bundle.js',
      // './dist/init.js',
      // 'test/unit/*.js'
      'tests.webpack.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome', 'Firefox'],
    preprocessors: {
            // add webpack as preprocessor
            // './src/scripts/app.js': ['webpack'],
            // 'unit/*.js': ['webpack']
             'tests.webpack.js': ['webpack']
        },
    webpack: webpackConfig,
    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            require("karma-webpack")
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};