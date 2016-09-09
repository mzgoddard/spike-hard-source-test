const path = require('path')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const HardSource = require('hard-source-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layouts/*', '**/_*', '**/.*', 'cache/**', 'readme.md', 'records.json'],
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: { pageId: pageId(ctx), foo: 'bar' }
    })
  },
  postcss: (ctx) => {
    return cssStandards({ webpack: ctx })
  },
  babel: { presets: [jsStandards] },
  recordsPath: path.join(__dirname, 'records.json'),
  plugins: [
    {
      apply: function(compiler) {
        var start, start2;
        compiler.plugin(['watch-run', 'run'], function(compiler, cb) {
          start = Date.now();
          start2 = Date.now();
          cb();
        });
        compiler.plugin('make', function(compilation, cb) {
          console.log('pre-make', Date.now() - start);
          start = Date.now();
          compilation.plugin('seal', function() {
            console.log('make', Date.now() - start);
            start = Date.now();
          });
          compilation.plugin('optimize-tree', function(chunks, modules, cb) {
            console.log('pre optimize-tree', Date.now() - start);
            start = Date.now();
            cb();
          });
          compilation.plugin('after-optimize-tree', function() {
            console.log('optimize-tree', Date.now() - start);
            start = Date.now();
          });
          compilation.plugin('after-optimize-assets', function() {
            console.log('post optimize-tree', Date.now() - start);
            start = Date.now();
          });
          cb();
        });
        compiler.plugin('emit', function(compilation, cb) {
          console.log('after-compile', Date.now() - start);
          start = Date.now();
          cb();
        })
        compiler.plugin('done', function() {
          console.log('emit', Date.now() - start);
          console.log(Date.now() - start2);
        });
      },
    },
    new HardSource({ cacheDirectory: '../cache' })
  ]
}
