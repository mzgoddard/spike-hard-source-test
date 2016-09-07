const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, 'views')
const src = fs.readFileSync(path.join(root, 'test.sgr'), 'utf8')
const start = 100
const n = 300 + start

for (let i = start; i < n; i++) {
  fs.writeFileSync(path.join(root, `test${i}.sgr`), src)
}
