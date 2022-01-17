import { logger } from '../../core/utils'
import { projectRepo, userRepo } from '../../dataAccess'
import { eventStore } from '../../config'
import { makeProject } from '../../entities'
import makeFakeProject from '../fixtures/project'
import { testRouter } from './testRouter'
import { LegacyProjectSourced, ProjectImported } from '@modules/project'

testRouter.post('/test/addProjects', async (request, response) => {
  const { projects, userId } = request.body
  const { user } = request

  if (!projects) {
    logger.error('tests/addProjectsForTests missing projects')
    return response.status(500).send('tests/addProjectsForTests missing projects')
  }

  const builtProjects = projects
    .map((project) => {
      if (project.notifiedOn) {
        project.notifiedOn = Number(project.notifiedOn)
      }
      if (project.puissance) {
        project.puissance = Number(project.puissance)
      }
      if (project.prixReference) {
        project.prixReference = Number(project.prixReference)
      }
      if (project.evaluationCarbone) {
        project.evaluationCarbone = Number(project.evaluationCarbone)
      }
      if (project.note) {
        project.note = Number(project.note)
      }
      if (project.garantiesFinancieresDate) {
        project.garantiesFinancieresDate = Number(project.garantiesFinancieresDate)
      }
      if (project.garantiesFinancieresDueOn) {
        project.garantiesFinancieresDueOn = Number(project.garantiesFinancieresDueOn)
      }
      if (project.garantiesFinancieresRelanceOn) {
        project.garantiesFinancieresRelanceOn = Number(project.garantiesFinancieresRelanceOn)
      }
      if (project.garantiesFinancieresSubmittedOn) {
        project.garantiesFinancieresSubmittedOn = Number(project.garantiesFinancieresSubmittedOn)
      }
      if (project.dcrDate) {
        project.dcrDate = Number(project.dcrDate)
      }
      if (project.dcrDueOn) {
        project.dcrDueOn = Number(project.dcrDueOn)
      }
      if (project.dcrSubmittedOn) {
        project.dcrSubmittedOn = Number(project.dcrSubmittedOn)
      }
      if (project.dcrDate) {
        project.dcrDate = Number(project.dcrDate)
      }
      if (project.details) {
        project.details = JSON.parse(project.details)
      }

      return project
    })
    .map(makeFakeProject)
    .map(makeProject)
    .filter((item) => item.is_ok())
    .map((item) => item.unwrap())

  if (builtProjects.length !== projects.length) {
    logger.error('addProjects for Tests could not add all required projects')
    projects
      .map(makeFakeProject)
      .map(makeProject)
      .filter((item) => item.is_err())
      .forEach((erroredProject) => {
        logger.error(erroredProject.unwrap_err())
      })
  }
  await Promise.all(builtProjects.map(projectRepo.save))

  await Promise.all(
    builtProjects.map((project) => {
      return eventStore.publish(
        new LegacyProjectSourced({
          payload: {
            projectId: project.id,
            periodeId: project.periodeId,
            appelOffreId: project.appelOffreId,
            familleId: project.familleId,
            numeroCRE: project.numeroCRE,
            content: project,
            potentielIdentifier: '',
          },
        })
      )
    })
  )

  if (user) {
    await Promise.all(builtProjects.map((project) => userRepo.addProject(user.id, project.id)))
  }

  if (userId) {
    await Promise.all(builtProjects.map((project) => userRepo.addProject(userId, project.id)))
  }

  return response.send('success')
})
