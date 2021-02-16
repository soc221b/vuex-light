const execa = require('execa')
const { checkNothingToCommit } = require('./util')

console.log('---check status---')
checkNothingToCommit()

console.log('---check docs---')
execa.commandSync('yarn build', { stdio: 'inherit' })
execa.commandSync('yarn docs', { stdio: 'inherit' })
checkNothingToCommit({ shouldResetHardOnError: true })

console.log('---release---')
execa.commandSync('standard-version', { stdio: 'inherit' })

console.log('---build---')
execa.commandSync('yarn build', { stdio: 'inherit' })
