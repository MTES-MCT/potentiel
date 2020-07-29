import _ from 'lodash'
import moment from 'moment'
import {
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo,
  UserRepo,
  AppelOffreRepo,
} from '../dataAccess'
import {
  makeProjectAdmissionKey,
  AppelOffre,
  Periode,
  Project,
  User,
  ProjectAdmissionKey,
  applyProjectUpdate,
  NotificationProps,
} from '../entities'
import { ErrorResult, Ok, ResultAsync } from '../types'
import routes from '../routes'

interface MakeUseCaseProps {
  findAllProjects: ProjectRepo['findAll']
  saveProject: ProjectRepo['save']
  appelOffreRepo: AppelOffreRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  sendNotification: (props: NotificationProps) => Promise<void>
}

interface CallUseCaseProps {
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
  notifiedOn: number
  user: User
}

export const ERREUR_AUCUN_PROJET_NON_NOTIFIE =
  'Tous les projets sont déjà notifiés'

export const INVALID_APPELOFFRE_PERIOD_ERROR =
  "L'appel d'offre et/ou la période ne sont pas reconnus"

export const UNAUTHORIZED_ERROR =
  "Vous n'avez pas les droits pour effectuer cette opération"

export default function makeSendAllCandidateNotifications({
  findAllProjects,
  saveProject,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendNotification,
}: MakeUseCaseProps) {
  return async function sendAllCandidateNotifications({
    appelOffreId,
    periodeId,
    notifiedOn,
    user,
  }: CallUseCaseProps): ResultAsync<null> {
    if (!['admin', 'dgec'].includes(user.role)) {
      return ErrorResult(UNAUTHORIZED_ERROR)
    }

    // console.log('sendAllCandidateNotifications', appelOffreId, periodeId)

    const periodeInfo = await _getAppelOffrePeriode()

    if (!periodeInfo) return ErrorResult(INVALID_APPELOFFRE_PERIOD_ERROR)

    const { appelOffreTitle, periodeTitle } = periodeInfo

    // Find all projects that have not been notified
    // For this appelOffre and periode
    const unNotifiedProjects = (
      await findAllProjects({
        appelOffreId,
        periodeId,
        isNotified: false,
      })
    ).items

    // console.log('unNotifiedProjects', unNotifiedProjects)

    if (!unNotifiedProjects.length) {
      return ErrorResult(ERREUR_AUCUN_PROJET_NON_NOTIFIE)
    }

    // Regroup projects by email and get a name
    const emailsToNotify = Object.entries(
      unNotifiedProjects.reduce(
        (emailMap, project) => ({
          ...emailMap,
          [project.email]: project.nomRepresentantLegal,
        }),
        {}
      )
    )

    // Call sendCandidateNotification for each email
    const candidateNotificationResults = await Promise.all(
      emailsToNotify.map(async ([email, fullName]) => {
        const success = await _sendCandidateNotification({
          email,
          fullName,
          appelOffreTitle,
          periodeTitle,
        })

        return success && email
      })
    )

    // Register the fact that projects have been notified
    await Promise.all(
      candidateNotificationResults
        .filter((item) => !!item)
        .map(async (email) => {
          const projectsForThisEmail = unNotifiedProjects.filter(
            (project) => project.email === email
          )

          await Promise.all(
            projectsForThisEmail.map(async (project) => {
              // Register the date of notification for each project

              const update: any = { notifiedOn }

              if (project.famille?.garantieFinanciereEnMois) {
                update.garantiesFinancieresDueDate = moment(notifiedOn)
                  .add(2, 'months')
                  .toDate()
                  .getTime()
              }

              const updatedProject = applyProjectUpdate({
                project,
                update,
                context: {
                  userId: user.id,
                  type: 'candidate-notification',
                },
              })

              if (updatedProject) {
                const updateRes = await saveProject(updatedProject)
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
        })
    )

    return Ok(null)

    async function _getAppelOffrePeriode(): Promise<{
      appelOffreTitle: string
      periodeTitle: string
    } | null> {
      const appelsOffre = await appelOffreRepo.findAll()

      // Get the corresponding AO/Periode
      const appelOffre = appelsOffre.find(
        (appelOffre) => appelOffre.id === appelOffreId
      )
      if (!appelOffre) {
        console.log(
          'sendCandidateNotification use-case, cannot find appel offre',
          appelOffreId
        )
        return null
      }
      const periode = appelOffre.periodes.find(
        (periode) => periode.id === periodeId
      )
      if (!periode) {
        console.log(
          'sendCandidateNotification use-case, cannot find periode',
          periodeId
        )
        return null
      }

      return {
        appelOffreTitle: appelOffre.shortTitle,
        periodeTitle: periode.title,
      }
    }

    async function _sendCandidateNotification({
      email,
      fullName,
      appelOffreTitle,
      periodeTitle,
    }): Promise<boolean> {
      // Create an invitation link for this email
      const projectAdmissionKeyResult = makeProjectAdmissionKey({
        email,
        fullName,
        appelOffreId,
        periodeId,
      })

      if (projectAdmissionKeyResult.is_err()) {
        // OOPS
        console.log(
          'sendCandidateNotfication use-case: error when calling makeProjectAdmissionKey with',
          {
            email,
          }
        )
        return false
      }

      const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

      const insertionResult = await projectAdmissionKeyRepo.save(
        projectAdmissionKey
      )

      if (insertionResult.is_err()) {
        // OOPS
        console.log(
          'sendCandidateNotfication use-case: error when calling projectAdmissionKeyRepo.save with',
          {
            email,
          }
        )

        // ignore this project
        return false
      }

      // Create the subject line depending on Classé/Eliminé
      const subject = `Résultats de la ${periodeTitle} période de l'appel d'offres ${appelOffreTitle}`

      // Call sendEmailNotification with the proper informations
      try {
        await sendNotification({
          type: 'designation',
          context: {
            projectAdmissionKeyId: projectAdmissionKey.id,
            appelOffreId,
            periodeId,
          },
          variables: {
            invitation_link: routes.PROJECT_INVITATION({
              projectAdmissionKey: projectAdmissionKey.id,
            }),
          },
          message: {
            subject,
            email: email,
            name: fullName,
          },
        })
        return true
      } catch (error) {
        console.log(
          'sendCandidateNotfication use-case: error when calling sendNotification',
          error
        )

        return false
      }
    }
  }
}
