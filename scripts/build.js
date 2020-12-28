const path = require('path')
const rimraf = require('rimraf')
const execa = require('execa')

rimraf.sync(path.resolve(__dirname, '..', 'dist'))
execa.sync('rollup', ['-c', 'rollup.config.js', ...process.argv.slice(2)], { stdio: 'inherit' })
execa.sync('api-extractor', ['run'], { stdio: 'inherit' })
rimraf.sync(path.resolve(__dirname, '..', 'dist', 'src'))
