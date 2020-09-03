import { Op } from 'sequelize'
import {
  initDatabase,
  userRepo,
  projectRepo,
  sequelize,
} from '../src/dataAccess'
import {
  makeUser,
  makeCredentials,
  User,
  applyProjectUpdate,
} from '../src/entities'
import { File } from '../src/modules/file'
import { makeProjectFilePath } from '../src/helpers/makeProjectFilePath'
import { asLiteral } from '../src/helpers/asLiteral'
import { fileService } from '../src/config'

import fs from 'fs'
import util from 'util'
import path, { relative } from 'path'
const moveFile = util.promisify(fs.rename)
const dirExists = util.promisify(fs.exists)
const fileExists = dirExists
const deleteFile = util.promisify(fs.unlink)

initDatabase()
  .then(async () => {
    // Get all projects with a garantiesFinancieresFile and no garantiesFinancieresFileId

    const ProjectModel = sequelize.model('project')
    const projectsToUpdate = await ProjectModel.findAll({
      where: {
        garantiesFinancieresFile: {
          [Op.and]: [{ [Op.ne]: '' }, { [Op.ne]: null }],
        },
        garantiesFinancieresFileId: null,
      },
      // logging: console.log,
    })

    console.log('Found', projectsToUpdate.length, 'projects to update')

    const updatedProjects: any[] = []

    for (const project of projectsToUpdate.map((item) => item.get())) {
      const { filepath: relativeFilePath, filename } = makeProjectFilePath(
        project.id,
        project.garantiesFinancieresFile,
        true
      )
      const absoluteFilePath = path.resolve(__dirname, '../', relativeFilePath)

      if (!(await fileExists(absoluteFilePath))) {
        console.log('\nFile with path', absoluteFilePath, 'could not be found')
        continue
      }

      const file = {
        stream: fs.createReadStream(absoluteFilePath),
        path: relativeFilePath,
      }

      const fileResult = File.create({
        designation: 'garantie-financiere',
        forProject: project.id,
        createdBy: project.garantiesFinancieresSubmittedBy,
        filename: filename,
      })

      if (fileResult.isErr()) {
        console.log('File.create failed', fileResult.error)

        continue
      }

      console.log('\nUploading file ' + relativeFilePath)
      const saveFileResult = await fileService.save(fileResult.value, {
        ...file,
        path: relativeFilePath,
      })

      if (saveFileResult.isErr()) {
        // OOPS
        console.log('fileService.save failed', saveFileResult.error)

        continue
      }
      console.log('Done uploading file.')

      const updatedProject = applyProjectUpdate({
        project,
        update: {
          garantiesFinancieresFileId: fileResult.value.id.toString(),
        },
        context: {
          type: 'garanties-financieres-file-move',
          userId: '',
        },
      })

      if (!updatedProject) {
        // OOPS
        console.log('applyProjectUpdate returned null')

        continue
      }

      const res = await projectRepo.save(updatedProject)

      if (res.is_err()) {
        console.log('projectRepo.save failed', res.unwrap_err())
        continue
      }

      updatedProjects.push(project.id)
    }

    console.log('\nUpdated', updatedProjects.length, 'projects')

    // For each:
    // look for file in file system
    // if found, call FileService to copy that file over there
    // set garantiesFinancieresFileId
  })
  .then(() => {
    console.log('\nGaranties Financieres mises à jour')

    process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
