const walk = require('walk')
const fs = require('fs')
const path = require('path')
const htmlparser = require('htmlparser2')
const cheerio = require('cheerio')
const sassLint = require('sass-lint')
const Reporter = require('./reporter.js')

class Linter {
  constructor (options) {
    this.lintErrors = []
  }

  checkPaths (pathsToCheck) {
    pathsToCheck.forEach((pathToCheck) => {
      if (pathToCheck.substr(-3) === 'vue') {
        this.lintFile(pathToCheck, this.walkerEndHandler.bind(this))
      } else {
        this.checkPath(pathToCheck)
      }
    })
  }

  checkPath (arg) {
    const walker = walk.walk(arg, { followLinks: false })
    walker.on('file', this.walkerFileHandler.bind(this))
    walker.on('end', this.walkerEndHandler.bind(this))
    walker.on('errors', this.walkerErrorsHandler.bind(this))
  }

  walkerErrorsHandler (root, nodeStatsArray, next) {
    console.error("Linting Error: Invalid sass linting path.");
    console.log(nodeStatsArray);
    next();
  }

  walkerFileHandler (root, fileStat, next) {
    const filename = `${root}/${fileStat.name}`
    if (filename.substr(-3) !== 'vue') {
      return next()
    }
    this.lintFile(path.resolve(root, fileStat.name), next)
  }

  lintFile(filePath, next) {
    fs.readFile(filePath, (error, fileData) => {
      if (error) {
        return console.error(error)
      }

      const fileTemplates = this.extractFileTemplates(fileData)

      fileTemplates.forEach((template) => {
        const fileErrors = sassLint.lintText({
          text: template.content,
          filename: filePath,
          format: 'scss'
        })

        if (fileErrors.messages.length) {
          fileErrors.messages.forEach((message) => {
            message.line += template.lineOffset
          })
          this.lintErrors = this.lintErrors.concat(fileErrors)
        }
      })

      next()
    })
  }

  walkerEndHandler () {
    const reporter = new Reporter()
    reporter.report(this.lintErrors)
  }

  extractFileTemplates (fileData) {
    let templates = []

    const handler = new htmlparser.DefaultHandler((error, dom) => {
      if (error) {
        return console.log(error)
      }

      const $ = cheerio.load(dom)
      const template = $('style[lang="scss"]').text()

      if (template.length <= 0) {
        return
      }

      templates.push({
        content: template,
        lineOffset: this.getLineOffset(template, $.text())
      })
    })

    var parser = new htmlparser.Parser(handler)
    parser.parseComplete(fileData)
    return templates
  }

  getLineOffset (needle, haystack) {
    const targetPosition = haystack.indexOf(needle)
    const untilTargetPosition = haystack.substring(0, targetPosition)
    return untilTargetPosition.split(/\r?\n/).length - 1
  }
}

module.exports = Linter
