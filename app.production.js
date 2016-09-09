const fs = require('fs')
const HardSource = require('hard-source-webpack-plugin')

// ensure cache files and dirs are set up on the first shot
const recordsPath = '/opt/build/cache/records.json'
const cacheDirectory = '/opt/build/cache/hard_source_cache'

try {
  fs.accessSync(recordsPath)
} catch (_) {
  fs.writeFileSync(recordsPath, '{}')
}

try {
  fs.accessSync(cacheDirectory)
} catch (_) {
  fs.mkdirSync(cacheDirectory)
}

module.exports = {
  recordsPath,
  plugins: [ new HardSource({ cacheDirectory }) ]
}
