import { NotificationService } from '..'
import { Repository, UniqueEntityID } from '../../../core/domain'
import { wrapInfra } from '../../../core/utils'
import { ProjectRepo } from '../../../dataAccess'
import { User } from '../../../entities'
import { ProjectCertificateRegenerated, ProjectCertificateUpdated } from '../../project/events'
import { Project } from '../../project/Project'

export const handleProjectCertificateUpdatedOrRegenerated = (deps: {
  sendNotification: NotificationService['sendNotification']
  getUsersForProject: ProjectRepo['getUsers']
  projectRepo: Repository<Project>
}) => async (event: ProjectCertificateUpdated | ProjectCertificateRegenerated) => {
  const { projectId } = event.payload

  const porteursProjet = (await deps.getUsersForProject(projectId)).filter(
    (user) => user.role === 'porteur-projet'
  )

  if (!porteursProjet || !porteursProjet.length) {
    // no registered user for this projet, no one to warn
    return
  }

  await deps.projectRepo
    .load(new UniqueEntityID(projectId))
    .andThen((project) =>
      wrapInfra(
        Promise.all(
          porteursProjet.map((porteurProjet) =>
            _sendCandidateNotification({ porteurProjet, project })
          )
        )
      )
    )

  function _sendCandidateNotification(args: { porteurProjet: User; project: Project }) {
    const { porteurProjet, project } = args
    return deps.sendNotification({
      type: 'pp-certificate-updated',
      message: {
        email: porteurProjet.email,
        name: porteurProjet.fullName,
        subject: 'Nouvelle attestation disponible dans votre espace Potentiel',
      },
      context: {
        projectId,
        userId: porteurProjet.id,
      },
      variables: {
        nomProjet: project.data?.nomProjet || '',
        raison:
          event.type === ProjectCertificateRegenerated.type ? event.payload.reason : undefined,
      },
    })
  }
}
