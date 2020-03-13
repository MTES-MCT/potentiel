import { Given, When, Then, BeforeAll, AfterAll } from 'cucumber'
import puppeteer from 'puppeteer'

import { PORT } from '../setup/config'
import { makeServer } from '../../src/server'

import fs from 'fs'
import util from 'util'

const copyFile = util.promisify(fs.copyFile)
const deleteFile = util.promisify(fs.unlink)

const HEADLESS = process.env.HEADLESS !== 'false'

const puppeteerOpts = HEADLESS
  ? {}
  : {
      headless: true,
      slowMo: 100,
      // timeout: 0,
      args: ['--start-maximized', '--window-size=1920,1040']
    }

BeforeAll(async function() {
  console.log('BeforeAll called', this)

  await copyFile('src/__tests__/fixtures/test.sqlite', '.db/test.sqlite')

  console.log('Launching web server')
  global['__SERVER__'] = await makeServer(PORT)
  console.log(`Server is running on ${PORT}...`)

  console.log('Launching puppeteer browser')
  global['__BROWSER__'] = await puppeteer.launch(puppeteerOpts)
  console.log('launched browser !')

  console.log('BeforeAll done')
})

AfterAll(async function() {
  console.log('AfterAll called')
  global['__SERVER__'].close()

  global['__BROWSER__'].close()

  // clean-up test database
  await deleteFile('.db/test.sqlite')
  console.log('AfterAll done')
})
