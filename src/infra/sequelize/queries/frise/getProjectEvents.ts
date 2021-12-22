import { wrapInfra } from '../../../../core/utils'
import { GetProjectEvents, ProjectEventDTO } from '../../../../modules/frise'
import { ProjectEvent } from '../../projectionsNext'
import { models } from '../../models'

const { Project, File } = models

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
              case 'ProjectGFSubmitted':
                if (
                  user.role === 'porteur-projet' ||
                  user.role === 'admin' ||
                  user.role === 'dgec' ||
                  user.role === 'dreal'
                ) {
                  const fileId = payload.fileId
                  const file = File.findOne({ attributes: ['filename'], where: { id: fileId } })
                  const filename = file.filename
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                    fileId,
                    submittedBy: payload.submittedBy,
                    filename,
                  })
                }
            }

            return events
          }, [] as ProjectEventDTO[]),
      }
    })
}
function getEvents(projectId) {
  return wrapInfra(ProjectEvent.findAll({ where: { projectId } }))
}
