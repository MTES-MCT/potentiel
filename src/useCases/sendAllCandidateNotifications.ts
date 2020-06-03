import _ from 'lodash'
import {
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo,
  UserRepo,
} from '../dataAccess'
import {
  makeCandidateNotification,
  makeProjectAdmissionKey,
  AppelOffre,
  Periode,
  Project,
  User,
  ProjectAdmissionKey,
  applyProjectUpdate,
} from '../entities'
import { ErrorResult, Ok, ResultAsync } from '../types'
import { sendCandidateNotification } from '.'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  userRepo: UserRepo
  credentialsRepo: CredentialsRepo
  sendCandidateNotification: (args: {
    email: string
    appelOffreId: AppelOffre['id']
    periodeId: Periode['id']
  }) => ResultAsync<ProjectAdmissionKey['id']>
}

interface CallUseCaseProps {
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
  notifiedOn: number
  userId: User['id']
}

export const ERREUR_AUCUN_PROJET_NON_NOTIFIE =
  'Tous les projets sont déjà notifiés'

export default function makeSendAllCandidateNotifications({
  projectRepo,
  userRepo,
  credentialsRepo,
  sendCandidateNotification,
}: MakeUseCaseProps) {
  return async function sendAllCandidateNotifications({
    appelOffreId,
    periodeId,
    notifiedOn,
    userId,
  }: CallUseCaseProps): ResultAsync<null> {
    // Find all projects that have not been notified
    // For this appelOffre and periode
    const unNotifiedProjects = await projectRepo.findAll({
      appelOffreId,
      periodeId,
      notifiedOn: 0,
    })

    // console.log('unNotifiedProjects', unNotifiedProjects)

    if (!unNotifiedProjects.length) {
      return ErrorResult(ERREUR_AUCUN_PROJET_NON_NOTIFIE)
    }

    // Regroup projects by email
    const emailsToNotify = Object.keys(
      unNotifiedProjects.reduce(
        (emailMap, project) => ({
          ...emailMap,
          [project.email]: true,
        }),
        {}
      )
    )

    // Call sendCandidateNotification for each email
    const candidateNotificationResults = await Promise.all(
      emailsToNotify.map((email) =>
        sendCandidateNotification({
          email,
          appelOffreId,
          periodeId,
        })
      )
    )

    // Register the fact that projects have been notified
    await Promise.all(
      candidateNotificationResults.map(
        async (projectAdmissionKeyResult, index) => {
          if (projectAdmissionKeyResult.is_ok()) {
            const email = emailsToNotify[index]
            const projectsForThisEmail = unNotifiedProjects.filter(
              (project) => project.email === email
            )

            await Promise.all(
              projectsForThisEmail.map(async (project) => {
                // Register the date of notification for each project
                const updatedProject = applyProjectUpdate({
                  project,
                  update: { notifiedOn },
                  context: {
                    userId,
                    type: 'candidate-notification',
                  },
                })

                if (updatedProject) {
                  const updateRes = await projectRepo.save(updatedProject)
                  if (updateRes.is_err()) {
                    // OOPS
                    console.log(
                      'sendAllCandidateNotifications use-case: error when calling projectRepo.save',
                      updatedProject
                    )

                    return
                  }
                }
              })
            )
          }
        }
      )
    )

    // Add projects to the users
    await Promise.all(
      unNotifiedProjects.map(async (project) => {
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
