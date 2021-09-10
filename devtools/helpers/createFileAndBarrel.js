const path = require('path')
const pathExists = require('./pathExists')
const createFolderIfNotExists = require('./createFolderIfNotExists')
const { promises: fs } = require('fs')

module.exports = async function (newFilePath, newFileContents) {
  if (await pathExists(newFilePath)) {
    throw new Error(`${newFilePath} existe déjà`)
  }

  const parentDir = path.dirname(newFilePath)
  const fileName = path.basename(newFilePath, '.ts')

  // Create the parent folder if it does not exist yet
  await createFolderIfNotExists(parentDir)

  // Create the new file itself
  await fs.writeFile(newFilePath, newFileContents)

  // Barrel the parent dir
  if (!fileName.endsWith('.spec.ts') && !fileName.endsWith('.integration.ts')) {
    await fs.appendFile(path.resolve(parentDir, `index.ts`), `export * from './${fileName}';`)
  }
}
