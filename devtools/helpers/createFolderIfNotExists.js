const path  =require('path')
const pathExists = require('./pathExists')
const { promises: fs } = require('fs')

module.exports = async function(newFolderPath){

  const parentDir  = path.resolve(newFolderPath, '../')
  const folderName = path.basename(newFolderPath)
  if(!await pathExists(newFolderPath)){
    await fs.mkdir(newFolderPath)
    
    const parentDirIndexPath = path.resolve(parentDir, 'index.ts')    
    if(await pathExists(parentDirIndexPath)){
      await fs.appendFile(parentDirIndexPath, `export * from './${folderName}';`)
    }

    const newFolderIndexPath = path.resolve(newFolderPath, 'index.ts')
    await fs.writeFile(newFolderIndexPath, "") // initialise empty index.ts
  }

}