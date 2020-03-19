import _ from 'lodash'
import {
  CandidateNotificationRepo,
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo,
  UserRepo
} from '../dataAccess'
import { makeCandidateNotification, makeProjectAdmissionKey } from '../entities'
import { ErrorResult, Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  userRepo: UserRepo
  credentialsRepo: CredentialsRepo
  candidateNotificationRepo: CandidateNotificationRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
}

interface CallUseCaseProps {}

export const ERREUR_AUCUN_PROJET_NON_NOTIFIE =
  'Tous les projets sont déjà notifiés'

export default function makeSendCandidateNotifications({
  projectRepo,
  userRepo,
  credentialsRepo,
  candidateNotificationRepo,
  projectAdmissionKeyRepo
}: MakeUseCaseProps) {
  return async function sendCandidateNotifications({}: CallUseCaseProps): ResultAsync<
    null
  > {
    // Find all projects that have not been notified
    const unNotifiedProjects = await projectRepo.findAll({
      hasBeenNotified: false
    })

    // console.log('unNotifiedProjects', unNotifiedProjects)

    if (!unNotifiedProjects.length) {
      return ErrorResult(ERREUR_AUCUN_PROJET_NON_NOTIFIE)
    }

    // Create a new projectAdmissionKey per project
    const projectsWithAdmissionKeys = _.compact(
      await Promise.all(
        unNotifiedProjects.map(async project => {
          // For each project, create a new projectAdmissionKey

          const projectAdmissionKeyResult = makeProjectAdmissionKey({
            projectId: project.id,
            email: project.email
          })

          if (projectAdmissionKeyResult.is_err()) {
            // OOPS
            console.log(
              'sendCandidationNotfications use-case: error when calling makeProjectAdmissionKey with',
              {
                projectId: project.id,
                email: project.email
              }
            )

            // ignore this project
            return null
          }

          const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

          const insertionResult = await projectAdmissionKeyRepo.insert(
            projectAdmissionKey
          )

          if (insertionResult.is_err()) {
            // OOPS
            console.log(
              'sendCandidationNotfications use-case: error when calling projectAdmissionKeyRepo.insert with',
              {
                projectId: project.id,
                email: project.email
              }
            )

            // ignore this project
            return null
          }

          return { project, projectAdmissionKey }
        })
      )
    )

    // Create a new candidateNotification for each project, including the admission key
    await Promise.all(
      projectsWithAdmissionKeys.map(
        async ({ project, projectAdmissionKey }) => {
          const candidateNotificationData = {
            template:
              project.classe === 'Classé'
                ? ('laureat' as 'laureat')
                : ('elimination' as 'elimination'),
            projectAdmissionKey: projectAdmissionKey.id,
            projectId: project.id
          }

          const candidateNotificationResult = makeCandidateNotification(
            candidateNotificationData
          )

          if (candidateNotificationResult.is_err()) {
            // OOPS
            console.log(
              'sendCandidationNotfications use-case: error when calling makeCandidateNotification with',
              candidateNotificationData
            )

            // ignore this project
            return null
          }

          const candidateNotification = candidateNotificationResult.unwrap()

          const insertionResult = await candidateNotificationRepo.insert(
            candidateNotification
          )

          if (insertionResult.is_err()) {
            // OOPS
            console.log(
              'sendCandidationNotfications use-case: error when calling candidateNotificationRepo.insert with',
              candidateNotificationData
            )

            // ignore this project
            return null
          }

          await projectRepo.addNotification(project, candidateNotification)
        }
      )
    )

    // Add projects to the users
    await Promise.all(
      unNotifiedProjects.map(async project => {
        if (project.email) {
          const userCredentialsResult = await credentialsRepo.findByEmail(
            project.email
          )

          if (userCredentialsResult.is_none()) {
            // user hasn't registered yet
            return
          }

          const userCredentials = userCredentialsResult.unwrap()

          // Link the project with the user
          await userRepo.addProject(userCredentials.userId, project.id)
        }
      })
    )

    return Ok(null)
  }
}
