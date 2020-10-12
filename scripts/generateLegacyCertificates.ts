import dotenv from 'dotenv'
dotenv.config()

import { eventStore } from '../src/config/eventStore.config'
import '../src/config/projections.config'
import { generateCertificate } from '../src/config/useCases.config'
import { initDatabase, sequelize } from '../src/dataAccess'
import { ProjectCertificateGenerated } from '../src/modules/project/events'

//
// In 09/2020 we switched from on-the-fly certificate generation (on download) to pre-generated certificates (at notification)
// The purpose of this script is to generate all certificates for projects notified prior to this switch
//

initDatabase()
  .then(async () => {
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
          aggregateId: project.id
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
