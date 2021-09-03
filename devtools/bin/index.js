#!/usr/bin/env node

console.log('starting')

const base = require('../base')
require('../createEvent')
require('../createUsecase')
require('../createProjection')

base
  .help()
  .argv