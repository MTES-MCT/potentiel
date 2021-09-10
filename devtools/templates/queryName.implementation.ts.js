const { pascalCase } = require('change-case')

module.exports = function (args) {
  const { queryName, module, projection } = args

  return `import { wrapInfra } from '../../../../core/utils'
import { ${pascalCase(queryName)} } from '../../../../modules/${module}'
import models from '../../models'
const { ${pascalCase(projection)} } = models
  
export const ${queryName}: ${pascalCase(queryName)} = () => {
  return wrapInfra(${pascalCase(
    projection
  )}.findAll()).map((rawItems: any) => rawItems.map((item) => item.get()))
}`
}
