const base = require('./base')

const { promises: fs } = require('fs')
const prompts = require('prompts')
const path = require('path')
const { camelCase, pascalCase } = require('change-case')

const { MODULES_DIR, QUERIES_DIR } = require('./constants')
const getModules = require('./helpers/getModules')
const getProjections = require('./helpers/getProjections')
const createFileAndBarrel = require('./helpers/createFileAndBarrel')

const queryInterfaceTemplate = require('./templates/queryName.interface.ts')
const queryImplementationTemplate = require('./templates/queryName.implementation.ts')
const queryImplementationTestTemplate = require('./templates/queryName.implementation.integration.ts')
const dtoTemplate = require('./templates/dto.ts')

const createQuery = async function () {
  const { queryNameRaw } = await prompts({
    type: 'text',
    name: 'queryNameRaw',
    message: 'Quel est le nom de cette query ?',
  })
  if (!queryNameRaw) return
  const queryName = camelCase(queryNameRaw)
  console.log('Chosen queryName: ', queryName)

  // Ask the user for the module

  const existingModules = await getModules()
  const { module } = await prompts({
    type: 'autocomplete',
    name: 'module',
    message: 'Dans quel module ?',
    choices: existingModules.map((moduleName) => ({ title: moduleName })),
  })
  if (!module) return
  console.log('Chosen module: ', module)

  // Ask the user if there will be a DTO or not

  const { addDTO } = await prompts({
    type: 'confirm',
    name: 'addDTO',
    message: 'Créer un DTO spécifique ?',
  })

  let dtoName = ''
  if (addDTO) {
    dtoName = `${pascalCase(queryName)}DTO`
  }

  // Ask the user for the projection

  const existingProjections = await getProjections()
  const { projection } = await prompts({
    type: 'autocomplete',
    name: 'projection',
    message: 'Sur quel projection ?',
    choices: existingProjections.map((projectionName) => ({ title: projectionName })),
  })
  if (!projection) return
  console.log('Chosen projection: ', projection)

  // 1) Create the query type declaration (+barrel)

  // Create modules/moduleName/queries/QueryName.ts
  const queryInterfacePath = path.resolve(
    MODULES_DIR,
    module,
    'queries',
    `${pascalCase(queryName)}.ts`
  )
  await createFileAndBarrel(queryInterfacePath, queryInterfaceTemplate({ queryName, dtoName }))

  // 2) Create the query implementation and integration test (+barrel)

  // Create infra/sequelize/queries/moduleName/queryName.ts
  const queryImplementationPath = path.resolve(QUERIES_DIR, module, `${camelCase(queryName)}.ts`)
  await createFileAndBarrel(
    queryImplementationPath,
    queryImplementationTemplate({ queryName, module, projection })
  )

  // Create infra/sequelize/queries/moduleName/queryName.integration.ts
  const queryImplementationTestPath = path.resolve(
    QUERIES_DIR,
    module,
    `${camelCase(queryName)}.integration.ts`
  )
  await createFileAndBarrel(
    queryImplementationTestPath,
    queryImplementationTestTemplate({ queryName, projection })
  )

  // 3) (optionnal) Create the DTO (+barrel)
  let dtoPath = ''
  if (addDTO) {
    dtoPath = path.resolve(MODULES_DIR, module, 'dtos', `${dtoName}.ts`)
    await createFileAndBarrel(dtoPath, dtoTemplate({ dtoName }))
  }

  console.log(`Query interface : ${queryInterfacePath}`)
  console.log(`Query implementation : ${queryImplementationPath}`)
  console.log(`Query implementation test : ${queryImplementationTestPath}`)
  if (addDTO) {
    console.log(`Query DTO : ${dtoPath}`)
  }

  return { queryName }
}

base.command(
  ['query', 'q'],
  'generate a new query',
  (yargs) => {},
  async function (argv) {
    await createQuery()
  }
)

module.exports = createQuery
