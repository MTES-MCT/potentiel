// import puppeteer from 'puppeteer'

import { PORT } from './config'
import { makeServer } from '../../src/server'

import puppeteer from 'puppeteer'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'
import os from 'os'
import util from 'util'

const copyFile = util.promisify(fs.copyFile)
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

export default async function() {
  // Copy the test database with admins etc.
  await copyFile('src/__tests__/fixtures/test.sqlite', '.db/test.sqlite')

  const server = await makeServer(PORT)
  console.log(`Server is running on ${PORT}...`)
  global['__SERVER__'] = server

  const browser = await puppeteer.launch(/*{ headless: false }*/)
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  global['__BROWSER_SETUP__'] = browser

  // use the file system to expose the wsEndpoint for TestEnvironments
  mkdirp.sync(DIR)
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
