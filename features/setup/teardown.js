const os = require('os')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const util = require('util')

const deleteFile = util.promisify(fs.unlink)

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
module.exports = async function() {
  // close the browser instance
  await global.__BROWSER_SETUP__.close()

  // close the server
  await global.__SERVER__.close()

  // clean-up the wsEndpoint file
  rimraf.sync(DIR)

  // clean-up test database
  await deleteFile('.db/test.sqlite')
}
