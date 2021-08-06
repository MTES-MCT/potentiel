const { promises: fs } = require('fs')
const path = require('path')

const { QUERIES_DIR } = require('../constants')

async function getFileListRecursive(dirPath){
  const files = []
  for(const item of await fs.readdir(dirPath)){

    if(item === 'index.ts') continue

    if(item.includes('.ts')){
      files.push(item.substring(0, item.indexOf('.')))
    }
    else{
      // subfolder
      files.push(...(await getFileListRecursive(path.resolve(dirPath, item))))
    }
  }

  return files
} 

module.exports = async function() {
  return await getFileListRecursive(QUERIES_DIR)
}