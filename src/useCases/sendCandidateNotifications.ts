import {
  makeCandidateNotification,
  makeProjectAdmissionKey,
  Project,
  ProjectAdmissionKey
} from '../entities'
import { ProjectRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  makeUuid: () => string
}

interface CallUseCaseProps {}

export default function makeSendCandidateNotifications({
  projectRepo,
  makeUuid
}: MakeUseCaseProps) {
  return async function sendCandidateNotifications({}: CallUseCaseProps): Promise<
    void
  > {
    // Find all projects that have not been notified
    const unNotifiedProjects = await projectRepo.findAll({
      hasBeenNotified: false
    })

    // TODO: send error if there are no unnotified projects

    try {
      // Create a new projectAdmissionKey per project
      const projectsWithAdmissionKeys = await Promise.all(
        unNotifiedProjects.map(
          async (
            project
          ): Promise<{
            project: Project
            projectAdmissionKey: ProjectAdmissionKey
          }> => {
            // For each project, create a new projectAdmissionKey
            // TODO: move the makeUuid to the ProjectAdmissionKey entity
            const projectAdmissionKey = makeProjectAdmissionKey({
              id: makeUuid(),
              projectId: project.id
            })

            await projectRepo.addProjectAdmissionKey(
              project.id,
              projectAdmissionKey.id
            )

            return { project, projectAdmissionKey }
          }
        )
      )

      // Create a new candidateNotification for each project, including the admission key
      await Promise.all(
        projectsWithAdmissionKeys.map(({ project, projectAdmissionKey }) =>
          projectRepo.addNotification(
            project,
            makeCandidateNotification({
              template: project.classe === 'Classé' ? 'laureat' : 'elimination',
              projectAdmissionKey: projectAdmissionKey.id
            })
          )
        )
      )
    } catch (e) {
      console.log('sendCandidateNotifications error', e)
      throw 'Updating notifications and or projects has failed'
    }
  }
}
