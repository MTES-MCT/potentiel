const { promises: fs } = require('fs')
const { MODULES_DIR } = require('../constants')


module.exports = async function() {

  return (await fs.readdir(MODULES_DIR)).filter(name => !name.includes('.'))
}