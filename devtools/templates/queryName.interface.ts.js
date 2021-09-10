const { pascalCase } = require('change-case')

module.exports = function (args) {
  const { queryName, dtoName } = args

  return `import { ResultAsync } from "../../../core/utils"
import { InfraNotAvailableError } from "../../shared"

${
  dtoName
    ? `import { ${dtoName} } from '../dtos'
`
    : ''
}
export type ${pascalCase(queryName)} = () => ResultAsync<${
    dtoName || 'string'
  }, InfraNotAvailableError >`
}
