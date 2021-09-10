const { promises: fs } = require('fs')
const { PROJECTIONS_DIR } = require('../constants')

module.exports = async function () {
  return (await fs.readdir(PROJECTIONS_DIR)).filter((name) => !name.includes('.'))
}
