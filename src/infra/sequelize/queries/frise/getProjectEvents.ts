import { userIs, userIsNot } from '@modules/users'
import { wrapInfra } from '@core/utils'
import { GetProjectEvents, ProjectEventDTO } from '@modules/frise'
import { models } from '../../models'
import { ProjectEvent } from '../../projectionsNext'

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
                  if (userIs(['admin', 'dgec'])(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  if (userIsNot('ademe')(user) && payload?.notifiedOn) {
                    events.push({
                      type: 'ProjectNotified',
                      date: payload.notifiedOn,
                      variant: user.role,
                      isLegacy: true,
                    })
                  }

                  break
                case 'ProjectNotified':
                  if (userIsNot('ademe')(user)) {
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
                  if (userIsNot(['ademe', 'dreal'])(user)) {
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
                  if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                    const { fileId, filename } = payload
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      fileId,
                      filename,
                    })
                  }
                  break
                case 'ProjectGFRemoved':
                case 'ProjectGFValidated':
                case 'ProjectGFInvalidated':
                case 'ProjectDCRRemoved':
                case 'ProjectPTFRemoved':
                  if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  break
                case 'ProjectGFDueDateSet':
                case 'ProjectDCRDueDateSet':
                  if (userIsNot('ademe')(user)) {
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
