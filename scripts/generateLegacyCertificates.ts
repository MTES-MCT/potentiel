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

import { fileService } from '../src/config/fileStorage.config'
import { eventStore } from '../src/config/eventStore.config'
import '../src/config/projections.config'
import { generateCertificate } from '../src/config/useCases.config'

import fs from 'fs'
import util from 'util'
import path, { relative } from 'path'
import { ProjectCertificateGenerated } from '../src/modules/project/events'
const moveFile = util.promisify(fs.rename)
const dirExists = util.promisify(fs.exists)
const fileExists = dirExists
const deleteFile = util.promisify(fs.unlink)

//
// In 09/2020 we switched from on-the-fly certificate generation (on download) to pre-generated certificates (at notification)
// The purpose of this script is to generate all certificates for projects notified prior to this switch
//

initDatabase()
  .then(async () => {
    // Get all projects with a dcrFile and no dcrFileId

    const ProjectModel = sequelize.model('project')
    const projectsToUpdate = await ProjectModel.findAll({
      where: {
        certificateFileId: null,
      },
      // logging: console.log,
    })

    console.log('Found', projectsToUpdate.length, 'projects to update')

    const updatedProjects: any[] = []

    for (const project of projectsToUpdate.map((item) => item.get())) {
      const certificateResult = await generateCertificate(project.id)

      if (certificateResult.isErr()) {
        console.log(
          'Could not generate certificate for project ' + project.id,
          certificateResult.error
        )
        continue
      }

      await eventStore.publish(
        new ProjectCertificateGenerated({
          payload: {
            certificateFileId: certificateResult.value,
            projectId: project.id,
            candidateEmail: project.email,
            periodeId: project.periodeId,
            appelOffreId: project.appelOffreId,
          },
        })
      )

      updatedProjects.push(project)
    }

    console.log(
      '\nGenerated certificates for ',
      updatedProjects.length,
      'projects'
    )

    // For each:
    // look for file in file system
    // if found, call FileService to copy that file over there
    // set dcrFileId
  })
  .then(() => {
    console.log('\n Done generating legacy certificates')

    // process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
