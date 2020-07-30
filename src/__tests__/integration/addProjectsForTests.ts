import { projectRepo, userRepo } from '../../dataAccess'
import { User, makeProject } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import makeFakeProject from '../fixtures/project'

const addProjectsForTests = async (request: HttpRequest) => {
  // console.log('addProjectsForTests', request.body)
  const { projects, userId } = request.body
  const { user } = request

  if (!projects) {
    console.log('tests/addProjectsForTests missing projects')
    return SystemError('tests/addProjectsForTests missing projects')
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
        project.garantiesFinancieresDate = Number(
          project.garantiesFinancieresDate
        )
      }
      if (project.garantiesFinancieresDueOn) {
        project.garantiesFinancieresDueOn = Number(
          project.garantiesFinancieresDueOn
        )
      }
      if (project.garantiesFinancieresRelanceOn) {
        project.garantiesFinancieresRelanceOn = Number(
          project.garantiesFinancieresRelanceOn
        )
      }
      if (project.garantiesFinancieresSubmittedOn) {
        project.garantiesFinancieresSubmittedOn = Number(
          project.garantiesFinancieresSubmittedOn
        )
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
    console.log('addProjects for Tests could not add all required projects')
    projects
      .map(makeFakeProject)
      .map(makeProject)
      .filter((item) => item.is_err())
      .forEach((erroredProject) => {
        console.log(erroredProject.unwrap_err())
      })
  }

  // console.log(
  //   'Added projects',
  //   builtProjects.forEach((item) => console.log(item))
  // )

  await Promise.all(builtProjects.map(projectRepo.save))
  // console.log(
  //   '/tests/addProjectsForTests added ' + builtProjects.length + ' projects'
  // )

  if (user) {
    await Promise.all(
      builtProjects.map((project) => userRepo.addProject(user.id, project.id))
    )
  }

  if (userId) {
    await Promise.all(
      builtProjects.map((project) => userRepo.addProject(userId, project.id))
    )
  }

  return Success('success')
}

export { addProjectsForTests }
