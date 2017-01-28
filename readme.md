# sass-lint-vue

[![npm](https://img.shields.io/npm/v/sass-lint-vue.svg?style=flat-square)](https://www.npmjs.com/package/sass-lint-vue)
[![npm downloads](https://img.shields.io/npm/dt/sass-lint-vue.svg?style=flat-square)](https://www.npmjs.com/package/sass-lint-vue)
[![Build Status](https://img.shields.io/travis/sourceboat/sass-lint-vue.svg?style=flat-square)](https://travis-ci.org/sourceboat/sass-lint-vue)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

Command line tool to lint [Sass](https://github.com/sass/sass) styles in [Vue single file components](https://vuejs.org/v2/guide/single-file-components.html). It uses [sass-lint](https://github.com/sasstools/sass-lint) under the hood.

## Installation

```
$ npm install sass-lint-vue
```

## Usage

```
$ sass-lint-vue [options] <file ...>
```

### Options

* `-h, --help`: output usage information
* `-V, --version`: output the version number

## Example

The following example scans the `assets` directory for `.vue` files and outputs lint errors in `<style>` tags with the attribute `lang="scss"` set. 

```
$ sass-lint-vue assets
```
