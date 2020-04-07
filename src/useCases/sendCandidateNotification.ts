import _ from 'lodash'
import {
  CandidateNotificationRepo,
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo,
  UserRepo,
  AppelOffreRepo
} from '../dataAccess'
import {
  makeCandidateNotification,
  makeProjectAdmissionKey,
  Project,
  ProjectAdmissionKey
} from '../entities'
import { ErrorResult, Ok, ResultAsync, Err } from '../types'
import routes from '../routes'

interface EmailServiceProps {
  template: 'lauréat' | 'eliminé'
  destinationEmail: string
  destinationName: string
  subject: string
  invitationLink: string
}

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  appelOffreRepo: AppelOffreRepo
  sendEmailNotification: (props: EmailServiceProps) => Promise<void>
}

interface CallUseCaseProps {
  projectId: Project['id']
  overrideDestinationEmail?: string
}

export default function makeSendCandidateNotification({
  projectRepo,
  projectAdmissionKeyRepo,
  appelOffreRepo,
  sendEmailNotification
}: MakeUseCaseProps) {
  return async function sendCandidateNotification({
    projectId,
    overrideDestinationEmail
  }: CallUseCaseProps): ResultAsync<ProjectAdmissionKey['id']> {
    const projectResult = await projectRepo.findById(projectId)

    // Get the project
    if (projectResult.is_none()) {
      console.log(
        'sendCandidateNotification use-case, cannot find projet with id',
        projectId
      )
      return ErrorResult('Projet inconnu')
    }
    const project = projectResult.unwrap()

    const appelsOffre = await appelOffreRepo.findAll()

    // Get the corresponding AO/Periode
    const appelOffre = appelsOffre.find(
      appelOffre => appelOffre.id === project.appelOffreId
    )
    if (!appelOffre) {
      console.log(
        'sendCandidateNotification use-case, cannot find appel offre for this project',
        projectId
      )
      return ErrorResult('Appel offre inconnu')
    }
    const periode = appelOffre.periodes.find(
      periode => periode.id === project.periodeId
    )
    if (!periode) {
      console.log(
        'sendCandidateNotification use-case, cannot find periode for this project',
        projectId
      )
      return ErrorResult('Periode inconnue')
    }

    // Create an invitation link
    const projectAdmissionKeyResult = makeProjectAdmissionKey({
      projectId: project.id,
      email: project.email
    })

    if (projectAdmissionKeyResult.is_err()) {
      // OOPS
      console.log(
        'sendCandidateNotfication use-case: error when calling makeProjectAdmissionKey with',
        {
          projectId: project.id,
          email: project.email
        }
      )
      return ErrorResult('Impossible de créer le projectAdmissionKey')
    }

    const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

    const insertionResult = await projectAdmissionKeyRepo.insert(
      projectAdmissionKey
    )

    if (insertionResult.is_err()) {
      // OOPS
      console.log(
        'sendCandidateNotfication use-case: error when calling projectAdmissionKeyRepo.insert with',
        {
          projectId: project.id,
          email: project.email
        }
      )

      // ignore this project
      return ErrorResult('Impossible de créer le projectAdmissionKey')
    }

    // Create the subject line depending on Classé/Eliminé
    const subject =
      project.classe === 'Classé'
        ? `Lauréats de la ${periode.title} période de l'appel d'offres ${appelOffre.shortTitle}`
        : `Offres non retenues à la ${periode.title} période de l'appel d'offres ${appelOffre.shortTitle}`

    // Call sendEmailNotification with the proper informations
    try {
      await sendEmailNotification({
        template:
          project.classe === 'Classé'
            ? ('lauréat' as 'lauréat')
            : ('eliminé' as 'eliminé'),
        subject,
        destinationEmail: overrideDestinationEmail || project.email,
        destinationName: project.nomCandidat,
        invitationLink: routes.PROJECT_INVITATION({
          projectAdmissionKey: projectAdmissionKey.id,
          projectId: project.id
        })
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
