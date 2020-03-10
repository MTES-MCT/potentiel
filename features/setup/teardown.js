const os = require('os')
const rimraf = require('rimraf')
const path = require('path')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
module.exports = async function() {
  // close the browser instance
  await global.__BROWSER__.close()

  // close the server
  await global.__SERVER__.close()

  // clean-up the wsEndpoint file
  rimraf.sync(DIR)
}
