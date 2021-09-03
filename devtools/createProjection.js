const base = require('./base')

const { promises: fs } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { capitalize } = require('lodash')
const prompts = require('prompts')
const { camelCase } = require('change-case')

const modelTemplate = require('./templates/projectionName.model.ts')
const createFileAndBarrel = require('./helpers/createFileAndBarrel')
const pathExists = require('./helpers/pathExists')

const { SERVER_DIR, PROJECTIONS_DIR, MODELS_PATH } = require('./constants')

base
  .command(['projection [name]', 'p [name]' ], 'generate a new projection', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      describe: 'the name of the projection'
    })

  }, async function (argv) {
    let { name } = argv

    if(!name){
      const { projectNameRaw } = await prompts({
        type: 'text',
        name: 'projectNameRaw',
        message: 'Quel est le nom de la projection ?'
      })
      if(!projectNameRaw) return
      name = projectNameRaw
    }

    const projectionName = camelCase(name)
    const modelFilePath = path.resolve(PROJECTIONS_DIR, projectionName, `${projectionName}.model.ts`)

    // Check if projection already exists
    if(await pathExists(modelFilePath)){
      console.log(`Une projection nommée '${projectionName}' existe déjà`)
      return
    }

    // // Create the sequelize model file
    await createFileAndBarrel(modelFilePath, modelTemplate({ projectionName }))

    // Add new model to sequelize/models.ts
    let models = await fs.readFile(MODELS_PATH, { encoding: 'utf8'})

    models = models.replace(`} from './projections';`, `  make${capitalize(projectionName)}Model,
} from './projections';`)
    models = models.replace(`export const models = {`, `export const models = {
  ${capitalize(projectionName)}: make${capitalize(projectionName)}Model(sequelize),`)

    await fs.writeFile(MODELS_PATH, models)

    // Create the migration script
    exec(`cd ${SERVER_DIR} && npx sequelize-cli migration:generate --name create-${projectionName}-table`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(stderr);
            return;
        }
        console.log(stdout);
    });

    // Tell dev to open the model file in vscode
    console.log(`Next step, fill : ${modelFilePath}`)

  })