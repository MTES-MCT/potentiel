// import puppeteer from 'puppeteer'

import { makeServer } from '../../src/server'

// export default async function() {
// console.log('Setup of tests')
// await makeServer(3001)
// console.log('Server is running on 3001...')
// }

const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')
const os = require('os')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function() {
  console.log('Setup of tests')
  const server = await makeServer(3001)
  console.log('Server is running on 3001...')
  global['__SERVER__'] = server

  const browser = await puppeteer.launch()
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  global['__BROWSER__'] = browser

  // use the file system to expose the wsEndpoint for TestEnvironments
  mkdirp.sync(DIR)
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
