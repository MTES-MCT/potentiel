const { pascalCase } = require('change-case')

module.exports = function(args){

  const { useCaseName, depsMembers, argsMembers } = args

  return `

  export const make${pascalCase(useCaseName)} = ({ ${depsMembers.join(', ')} }: ${pascalCase(useCaseName)}Deps) => async ({ ${argsMembers.join(', ')} }: ${pascalCase(useCaseName)}Args): Promise<void> => {
  return
}`

}