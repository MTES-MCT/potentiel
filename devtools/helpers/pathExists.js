const { promises: fs } = require('fs')

module.exports = async function(path) {
  try {
    await fs.stat(path)
    return true
  } catch (e) {
    return false
  }
}