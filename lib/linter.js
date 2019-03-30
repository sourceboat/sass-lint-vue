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
      this.checkPath(pathToCheck)
    })
  }

  checkPath (arg) {
    const walker = walk.walk(arg, { followLinks: false })
    walker.on('file', this.walkerFileHandler.bind(this))
    walker.on('end', this.walkerEndHandler.bind(this))
  }

  walkerFileHandler (root, fileStat, next) {
    const filename = `${root}/${fileStat.name}`

    if (filename.substr(-3) !== 'vue') {
      return next()
    }

    fs.readFile(path.resolve(root, fileStat.name), (error, fileData) => {
      if (error) {
        return console.log(error)
      }

      const fileTemplates = this.extractFileTemplates(fileData)

      fileTemplates.forEach((template) => {
        const fileErrors = sassLint.lintText({
          text: template.content,
          filename: filename,
          format: template.format
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
      const scssTemplate = $('style[lang="scss"]').text()
      const sassTemplate = $('style[lang="sass"]').text()

      if (scssTemplate.length) {
        templates.push({
          content: scssTemplate,
          format: 'scss',
          lineOffset: this.getLineOffset(scssTemplate, $.text())
        })
      }
      if (sassTemplate.length) {
        templates.push({
          content: sassTemplate,
          format: 'sass',
          lineOffset: this.getLineOffset(sassTemplate, $.text())
        })
      }
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
