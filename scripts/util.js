const execa = require('execa')

function checkNothingToCommit({ shouldResetHardOnError = false } = {}) {
  let hasError = false
  execa.commandSync('git add --intent-to-add .', { stdio: 'inherit' })
  try {
    execa.commandSync('git diff --exit-code', { stdio: 'inherit' })
  } catch (error) {
    hasError = true
  } finally {
    execa.commandSync('git reset', { stdio: 'inherit' })
    if (hasError) {
      if (shouldResetHardOnError) {
        execa.commandSync('git add .', { stdio: 'inherit' })
        execa.commandSync('git reset HEAD --hard', { stdio: 'inherit' })
      }
      process.exit(1)
    }
  }
}

module.exports = {
  checkNothingToCommit,
}
