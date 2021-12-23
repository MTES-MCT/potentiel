import { wrapInfra } from '../../../../core/utils'
import { GetProjectEvents, ProjectEventDTO } from '../../../../modules/frise'
import { ProjectEvent } from '../../projectionsNext'
import { models } from '../../models'

const { Project } = models

export const getProjectEvents: GetProjectEvents = ({ projectId, user }) => {
  return wrapInfra(Project.findByPk(projectId))
    .andThen((rawProject: any) =>
      getEvents(projectId).map((rawEvents) => ({ rawProject, rawEvents }))
    )
    .map(({ rawProject, rawEvents }) => {
      const { email, nomProjet, potentielIdentifier } = rawProject.get()

      return {
        events: rawEvents
          .map((item) => item.get())
          .reduce<ProjectEventDTO[]>((events, { type, valueDate, payload }) => {
            switch (type) {
              case 'ProjectImported':
                if (user.role === 'dgec' || user.role === 'admin') {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  })
                }
                break
              case 'ProjectNotified':
                if (user.role !== 'ademe') {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  })
                }
                break
              case 'ProjectCertificateGenerated':
              case 'ProjectCertificateRegenerated':
              case 'ProjectCertificateUpdated':
              case 'ProjectClaimed':
                if (user.role !== 'ademe' && user.role !== 'dreal') {
                  events.push({
                    type,
                    potentielIdentifier,
                    email: ['admin', 'dgec'].includes(user.role) ? email : undefined,
                    nomProjet,
                    date: valueDate,
                    variant: user.role,
                    certificateFileId:
                      type === 'ProjectClaimed'
                        ? payload.attestationDesignationFileId
                        : payload.certificateFileId,
                    ...(type === 'ProjectClaimed' && { claimedBy: payload.claimedBy }),
                  })
                }
                break
            }

            return events
          }, [] as ProjectEventDTO[]),
      }
    })
}
function getEvents(projectId) {
  return wrapInfra(ProjectEvent.findAll({ where: { projectId } }))
}
