import _ from 'lodash'
import {
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo,
  UserRepo,
  AppelOffreRepo,
} from '../dataAccess'
import {
  makeProjectAdmissionKey,
  Project,
  ProjectAdmissionKey,
  AppelOffre,
  Periode,
  NotificationProps,
} from '../entities'
import { ErrorResult, Ok, ResultAsync, Err } from '../types'
import routes from '../routes'

interface EmailServiceProps {
  destinationEmail: string
  destinationName: string
  subject: string
  invitationLink: string
}

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  appelOffreRepo: AppelOffreRepo
  sendNotification: (props: NotificationProps) => Promise<void>
}

interface CallUseCaseProps {
  email: string
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
  overrideDestinationEmail?: string
}

export default function makeSendCandidateNotification({
  projectRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendNotification,
}: MakeUseCaseProps) {
  return async function sendCandidateNotification({
    email,
    appelOffreId,
    periodeId,
    overrideDestinationEmail,
  }: CallUseCaseProps): ResultAsync<ProjectAdmissionKey['id']> {
    // Find all projects for this email, appel offre and periode
    const projects = await projectRepo.findAll({
      appelOffreId,
      periodeId,
      email,
    })

    if (!projects.length) {
      console.log(
        'sendCandidateNotification use-case, found no projects for this email, appelOffreId and periodeId'
      )
      return ErrorResult(
        "Aucun projet pour cet email, appel d'offre et période"
      )
    }

    const projectHolderName = projects[0].nomRepresentantLegal

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
      return ErrorResult('Appel offre inconnu')
    }
    const periode = appelOffre.periodes.find(
      (periode) => periode.id === periodeId
    )
    if (!periode) {
      console.log(
        'sendCandidateNotification use-case, cannot find periode',
        periodeId
      )
      return ErrorResult('Periode inconnue')
    }

    // Create an invitation link for this email
    const projectAdmissionKeyResult = makeProjectAdmissionKey({
      email,
      fullName: projectHolderName,
    })

    if (projectAdmissionKeyResult.is_err()) {
      // OOPS
      console.log(
        'sendCandidateNotfication use-case: error when calling makeProjectAdmissionKey with',
        {
          email,
        }
      )
      return ErrorResult('Impossible de créer le projectAdmissionKey')
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
      return ErrorResult('Impossible de créer le projectAdmissionKey')
    }

    // Create the subject line depending on Classé/Eliminé
    const subject = `Résultats de la ${periode.title} période de l'appel d'offres ${appelOffre.shortTitle}`

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
          email: overrideDestinationEmail || email,
          name: projectHolderName,
        },
      })
      return Ok(projectAdmissionKey.id)
    } catch (error) {
      console.log(
        'sendCandidateNotfication use-case: error when calling sendEmailNotification',
        error
      )
      return Err(error)
    }
  }
}
