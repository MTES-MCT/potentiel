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
    .map(async ({ rawProject, rawEvents }) => {
      const { email, nomProjet, potentielIdentifier } = rawProject.get()

      return {
        events: await rawEvents
          .map((item) => item.get())
          .reduce<Promise<ProjectEventDTO[]>>(
            async (eventsPromise, { type, valueDate, payload }) => {
              const events: ProjectEventDTO[] = await eventsPromise
              switch (type) {
                case 'ProjectImported':
                  if (user.role === 'dgec' || user.role === 'admin') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  if (user.role !== 'ademe' && payload?.notifiedOn) {
                    events.push({
                      type: 'ProjectNotified',
                      date: payload.notifiedOn,
                      variant: user.role,
                      isLegacy: true,
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
                case 'ProjectDCRSubmitted':
                case 'ProjectPTFSubmitted':
                  if (
                    user.role === 'porteur-projet' ||
                    user.role === 'admin' ||
                    user.role === 'dgec' ||
                    user.role === 'dreal'
                  ) {
                    const { fileId, filename } = payload
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      fileId,
                      filename,
                      numeroDossier: type === 'ProjectDCRSubmitted' && payload.numeroDossier,
                    })
                  }
                  break
                case 'ProjectGFRemoved':
                case 'ProjectGFValidated':
                case 'ProjectGFInvalidated':
                case 'ProjectDCRRemoved':
                case 'ProjectPTFRemoved':
                  if (
                    user.role === 'porteur-projet' ||
                    user.role === 'admin' ||
                    user.role === 'dgec' ||
                    user.role === 'dreal'
                  ) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  break
                case 'ProjectGFDueDateSet':
                case 'ProjectDCRDueDateSet':
                  if (user.role !== 'ademe') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  break
              }

              return Promise.resolve(events)
            },
            Promise.resolve([] as ProjectEventDTO[])
          ),
      }
    })
}
function getEvents(projectId) {
  return wrapInfra(
    ProjectEvent.findAll({ where: { projectId }, order: [['eventPublishedAt', 'ASC']] })
  )
}
