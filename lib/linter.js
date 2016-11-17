const walk = require('walk')
const fs = require('fs')
const path = require('path')
const htmlparser = require('htmlparser')
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
          text: template,
          filename: filename,
          format: 'scss'
        })

        if (fileErrors.messages.length) {
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
      templates = templates.concat($('style[lang="sass"]').text())
      templates = templates.concat($('style[lang="scss"]').text())
    })

    var parser = new htmlparser.Parser(handler)
    parser.parseComplete(fileData)
    return templates
  }
}

module.exports = Linter
