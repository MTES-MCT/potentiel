const base = require('./base')

const { promises: fs } = require('fs')
const prompts = require('prompts')
const path = require('path')

const { Project } = require('ts-morph')
const ts = require('typescript')

const { MODULES_DIR } = require('./constants')
const pathExists = require('./helpers/pathExists')
const getModules = require('./helpers/getModules')
const createFileAndBarrel = require('./helpers/createFileAndBarrel')

const useCaseInterfacesTemplate = require('./templates/useCase.interfaces.ts')
const useCaseImplementationTemplate = require('./templates/useCase.implementation.ts')
const useCaseTestTemplate = require('./templates/useCase.spec.ts')
const { resolve } = require('path')
const getUsecases = require('./helpers/getUsecases')
const { camelCase, noCase, pascalCase } = require('change-case')

const createUsecase = async () => {

  console.log('createUsecase start')

  try{

    // Lookup the interface definitions thanks to typescript
    const project = new Project({ tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'), skipAddingFilesFromTsConfig: true })

    // Ask the user for the module
    const existingModules = await getModules()
    const { module } = await prompts({
      type: 'autocomplete',
      name: 'module',
      message: 'Dans quel module ?',
      choices: existingModules.map(moduleName => ({ title: moduleName }))
    })
    if(!module) return
    console.log('Chosen module: ', module)

    const modulePath = path.resolve(MODULES_DIR, module)
    const moduleIndexPath = path.resolve(modulePath, 'index.ts')

    const { useCaseNameRaw } = await prompts({
      type: 'text',
      name: 'useCaseNameRaw',
      message: 'Quel est le nom du use-case ?'
    })
    if(!useCaseNameRaw) return
    const useCaseName = noCase(useCaseNameRaw)
    console.log('Chosen useCaseName: ', useCaseName)

    const existingUsecasesForModule = await getUsecases(module)

    if(existingUsecasesForModule.includes(camelCase(useCaseName))){
      console.log(`Il y a déjà un use-case avec ce nom dans le module ${module}`)
      return
    }

    // Create useCases folder if it does not exist
    const moduleUsecasesPath = path.resolve(modulePath, 'useCases')
    
    // Create useCases/useCase.ts
    const newUsecasePath = path.resolve(moduleUsecasesPath, `${camelCase(useCaseName)}.ts`)
    await createFileAndBarrel(newUsecasePath, useCaseInterfacesTemplate({ useCaseName }))

    console.log(`Created ${newUsecasePath}`)
    console.log('Edit the interfaces and press ENTER to continue')

    const { confirmed } = await prompts({
      type: 'confirm',
      name: 'confirmed',
      message: 'Les interfaces sont-elles définies ?',
      initial: true
    })

    if(confirmed){

      console.log('Checking type declarations...')

      project.addSourceFileAtPath(newUsecasePath)

      const definitionFile = project.getSourceFileOrThrow(newUsecasePath)

      let depsMembers = []

      const depsDeclaration = definitionFile.compilerNode.statements.find(s => s.name && s.name.escapedText === `${pascalCase(useCaseName)}Deps`)
      if(depsDeclaration){
        depsMembers = depsDeclaration.members.map(m => m.name.escapedText)

        depsDeclaration.members.forEach(member => {

          if(ts.isFunctionTypeNode(member.type)){
            console.log(member.name.escapedText, 'is a function node')
          }
          else{
            console.log(member.name.escapedText, 'is not a function node')
          }

        });

      }

      let argsMembers = []

      const argsDeclaration = definitionFile.compilerNode.statements.find(s => s.name && s.name.escapedText === `${pascalCase(useCaseName)}Args`)
      if(argsDeclaration){
        argsMembers = argsDeclaration.members.map(m => m.name.escapedText)
      }


      await fs.appendFile(newUsecasePath, useCaseImplementationTemplate({ useCaseName, argsMembers, depsMembers }))

      const newUsecaseTestPath = path.resolve(moduleUsecasesPath, `${camelCase(useCaseName)}.spec.ts`)

      await fs.writeFile(newUsecaseTestPath, useCaseTestTemplate({ useCaseName, argsMembers, depsMembers }))

      console.log('Test file', newUsecaseTestPath)

    }


    return useCaseName
  }
  catch(e){
    console.error(e)
  }
}

base
  .command(['usecase', 'u' ], 'generate a new use-case', (yargs) => {
  }, async function (argv) {

    await createUsecase()
  })

module.exports = createUsecase