const { pascalCase } = require('change-case')

module.exports = function(args){

  const { useCaseName } = args

  return `import { EventBus } from '../../eventStore'

interface ${pascalCase(useCaseName)}Deps {
  eventBus: EventBus
}

interface ${pascalCase(useCaseName)}Args {
  lines: string[]
}`

}