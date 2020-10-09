import dotenv from 'dotenv'
dotenv.config()

import { eventStore } from '../src/config/eventStore.config'
import '../src/config/projections.config'
import { initDatabase, sequelize } from '../src/dataAccess'
import {
  LegacyProjectEventSourced,
  LegacyProjectSourced,
} from '../src/modules/project/events'

//
// In 09/2020 we switched from on-the-fly certificate generation (on download) to pre-generated certificates (at notification)
// The purpose of this script is to generate all certificates for projects notified prior to this switch
//

initDatabase()
  .then(async () => {
    const ProjectModel = sequelize.model('project')
    const projectsToUpdate = await ProjectModel.findAll()

    console.log('Found', projectsToUpdate.length, 'projects to source')

    const updatedProjects: any[] = []

    for (const project of projectsToUpdate.map((item) => item.get())) {
      await eventStore.publish(
        new LegacyProjectSourced({
          payload: {
            projectId: project.id,
            periodeId: project.periodeId,
            familleId: project.familleId,
            appelOffreId: project.appelOffreId,
            numeroCRE: project.numeroCRE,
            content: project,
          },
          aggregateId: project.id,
        })
      )

      updatedProjects.push(project)
    }

    console.log(
      '\nGenerated source events for ',
      updatedProjects.length,
      'projects'
    )

    // For each:
    // look for file in file system
    // if found, call FileService to copy that file over there
    // set dcrFileId
  })
  .then(async () => {
    console.log('\n Done generating legacy project source events')

    const ProjectEventModel = sequelize.model('projectEvent')
    console.log('ProjectEVentModel', ProjectEventModel)
    const projectEventsToUpdate = await ProjectEventModel.findAll({
      logging: console.log,
    })

    console.log(
      'Found',
      projectEventsToUpdate.length,
      'projectEvents to source'
    )

    const updatedProjects: any[] = []

    for (const projectEvent of projectEventsToUpdate.map((item) =>
      item.get()
    )) {
      await eventStore.publish(
        new LegacyProjectEventSourced({
          payload: {
            projectId: projectEvent.projectId,
            before: projectEvent.before,
            after: projectEvent.after,
            createdAt: projectEvent.createdAt,
            userId: projectEvent.userId,
            type: projectEvent.type,
            modificationRequestId: projectEvent.modificationRequestId,
          },
          aggregateId: projectEvent.projectId,
        })
      )

      updatedProjects.push(projectEvent)
    }

    console.log(
      '\nGenerated source events for ',
      updatedProjects.length,
      'projectEvents'
    )
    // process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
