# sass-lint-vue

[![npm](https://img.shields.io/npm/v/sass-lint-vue.svg?style=flat-square)](https://www.npmjs.com/package/sass-lint-vue)
[![npm downloads](https://img.shields.io/npm/dt/sass-lint-vue.svg?style=flat-square)](https://www.npmjs.com/package/sass-lint-vue)
[![Build Status](https://img.shields.io/travis/sourceboat/sass-lint-vue.svg?style=flat-square)](https://travis-ci.org/sourceboat/sass-lint-vue)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

Command line tool to lint [Sass](https://github.com/sass/sass) styles in [Vue single file components](https://vuejs.org/v2/guide/single-file-components.html). It uses [sass-lint](https://github.com/sasstools/sass-lint) under the hood.

## Features

* Add a `.sass-lint.yml` to specify your [configuration](https://github.com/sasstools/sass-lint#configuring).
* Disable specific rules or all rules [via source](https://github.com/sasstools/sass-lint#disabling-linters-via-source).

## Installation

```bash
npm install sass-lint-vue
```

## Usage

```bash
sass-lint-vue [options] <file ...>
```

### Options

* `-h, --help`: output usage information
* `-V, --version`: output the version number

## Example

The following example scans the `assets` directory for `.vue` files and outputs lint errors in `<style>` tags with the attribute `lang="scss"` set.

```bash
sass-lint-vue assets
```

## Development

Build the docker container via:

```bash
$ docker build . -t sass-lint-vue
```

Lint the `Component.vue` file in the docker container via:

```bash
$ docker run --rm -tv $(pwd)/test:/app/test sass-lint-vue test
```

Access the container via:

```bash
$ docker run -it --rm -v $(pwd)/test:/app/test --entrypoint bash sass-lint-vue
```

Use docker compose to work on the files:

```
$ docker-compose up
$ docker-compose exec app bash
```
