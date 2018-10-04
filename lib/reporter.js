const table = require('text-table')
const chalk = require('chalk')

class Reporter {
  report (results) {
    let output = '\n'
    let totalErrors = 0
    let totalWarnings = 0

    results.forEach((result) => {
      totalErrors += result.errorCount
      totalWarnings += result.warningCount

      output += chalk.underline(result.filePath) + '\n'

      output += table(result.messages.map((msg) => {
        return [
          '',
          `${msg.line}:${msg.column}`,
          (msg.severity === 2) ? chalk.red(msg.ruleId) : chalk.yellow(msg.ruleId),
          msg.message
        ]
      }))

      output += '\n\n'
    })

    if (totalErrors > 0 || totalWarnings > 0) {
      output += chalk.red.bold(`\u2716 errors: ${totalErrors}`)
      output += ' | '
      output += chalk.yellow.bold(`warnings ${totalWarnings}`)
      console.log(output)
      process.exit(totalErrors > 0 ? 1 : 0)
    }
  }
}

module.exports = Reporter
