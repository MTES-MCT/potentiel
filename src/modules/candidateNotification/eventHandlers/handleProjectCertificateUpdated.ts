import { sendNotification } from '../../../config'
import { ProjectRepo } from '../../../dataAccess'
import { EventBus } from '../../eventStore'
import { NotificationService } from '../../notification'
import { ProjectCertificateUpdated } from '../../project/events'
import {
  CandidateInformationOfCertificateUpdateFailed,
  CandidateInformedOfCertificateUpdate,
} from '../events'

export const handleProjectCertificateUpdated = (deps: {
  eventBus: EventBus
  sendNotification: NotificationService['sendNotification']
  getUsersForProject: ProjectRepo['getUsers']
  findProjectById: ProjectRepo['findById']
}) => async (event: ProjectCertificateUpdated) => {
  const projectId = event.payload.projectId

  const porteursProjet = (await deps.getUsersForProject(projectId)).filter(
    (user) => user.role === 'porteur-projet'
  )

  if (!porteursProjet) {
    // no registered user for this projet, no one to warn
    return
  }

  const project = await deps.findProjectById(projectId)

  if (!project) {
    console.log(
      'candidateNotification.handleProjectCertificateUpdated failed to retrieve project',
      event
    )

    for (const porteurProjet of porteursProjet) {
      await deps.eventBus.publish(
        new CandidateInformationOfCertificateUpdateFailed({
          payload: {
            projectId,
            porteurProjetId: porteurProjet.id,
            error: 'Project could not be found',
          },
        })
      )
    }

    return
  }

  for (const porteurProjet of porteursProjet) {
    try {
      await deps.sendNotification({
        type: 'pp-certificate-updated',
        message: {
          email: porteurProjet.email,
          name: porteurProjet.fullName,
          subject:
            'Nouvelle attestation disponible dans votre espace Potentiel',
        },
        context: {
          projectId,
          userId: porteurProjet.id,
        },
        variables: {
          nomProjet: project.nomProjet,
        },
      })

      await deps.eventBus.publish(
        new CandidateInformedOfCertificateUpdate({
          payload: {
            projectId,
            porteurProjetId: porteurProjet.id,
          },
        })
      )
    } catch (e) {
      console.log(
        'candidateNotification.handleProjectCertificateUpdated failed at sendNotification',
        e
      )

      await deps.eventBus.publish(
        new CandidateInformationOfCertificateUpdateFailed({
          payload: {
            projectId,
            porteurProjetId: porteurProjet.id,
            error: e.message,
          },
        })
      )
    }
  }
}
