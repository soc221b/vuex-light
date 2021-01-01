const path = require('path')
const rimraf = require('rimraf')
const execa = require('execa')

rimraf.sync(path.resolve(__dirname, '..', 'dist'))
execa.sync('rollup', ['-c', 'rollup.config.js'], { stdio: 'inherit' })
execa.sync('api-extractor', ['run', ...getArguments('-l', '--local')], { stdio: 'inherit' })
rimraf.sync(path.resolve(__dirname, '..', 'dist', 'src'))

function getArguments(...argvs) {
  return argvs.filter(argv => process.argv.includes(argv))
}
