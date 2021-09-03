const { pascalCase, camelCase } = require('change-case')

module.exports = function(args){

  const { useCaseName, depsMembers, argsMembers } = args

  return `import { make${pascalCase(useCaseName)} } from './${camelCase(useCaseName)}'

describe('${camelCase(useCaseName)}', () => {
${depsMembers.map(dep => `
  const ${dep} = "fake"`).join('')}

  const ${camelCase(useCaseName)} = make${pascalCase(useCaseName)}(${depsMembers.length ? `{${depsMembers.map(dep => `
    ${dep}`)}
  }` : ''})

  describe('when', () => {${argsMembers.map(arg => `
    const ${arg} = "fake"`)}

    beforeAll(async () => {
      await ${camelCase(useCaseName)}(${depsMembers.length ? `{${depsMembers.map(dep => `
        ${dep}`)}
      }` : ''})

    it('should', async () => {${depsMembers.map(dep => `
      expect(${dep}).toHaveBeenCalledWith()`)}
    })

  })

})`

}