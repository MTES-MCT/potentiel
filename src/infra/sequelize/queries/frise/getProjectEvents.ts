import { userIs, userIsNot } from '@modules/users'
import { wrapInfra } from '@core/utils'
import { GetProjectEvents, ProjectEventDTO } from '@modules/frise'
import { models } from '../../models'
import { ProjectEvent } from '../../projectionsNext'
import { getProjectAppelOffre } from '@config/queries.config'

const { Project } = models

export const getProjectEvents: GetProjectEvents = ({ projectId, user }) => {
  return wrapInfra(Project.findByPk(projectId))
    .andThen((rawProject: any) =>
      getEvents(projectId).map((rawEvents) => ({ rawProject, rawEvents }))
    )
    .map(async ({ rawProject, rawEvents }) => {
      const {
        email,
        nomProjet,
        potentielIdentifier,
        classe,
        abandonedOn,
        appelOffreId,
        periodeId,
        familleId,
      } = rawProject.get()
      const isLaureat = classe === 'Classé' && !abandonedOn
      const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

      return {
        project: {
          id: projectId,
          isLaureat,
          isSoumisAuxGF: isSoumisAuxGarantiesFinancieres(appelOffreId, familleId),
          isGarantiesFinancieresDeposeesALaCandidature:
            getIsGarantiesFinancieresDeposeesALaCandidature(appelOffreId, periodeId, familleId),
        },
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
                case 'ProjectNotificationDateSet':
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
                case 'ProjectGFUploaded':
                  if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                    const { file } = payload
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      file: file && { id: file.id, name: file.name },
                      ...(type === 'ProjectDCRSubmitted' && {
                        numeroDossier: payload.numeroDossier,
                      }),
                    })
                  }
                  break
                case 'ProjectGFRemoved':
                case 'ProjectGFValidated':
                case 'ProjectGFInvalidated':
                case 'ProjectDCRRemoved':
                case 'ProjectPTFRemoved':
                case 'ProjectGFWithdrawn':
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
                case 'ProjectCompletionDueDateSet':
                  if (userIsNot('ademe')(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                    })
                  }
                  break
                case 'ModificationRequested':
                  if (userIsNot('ademe')(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      modificationType: payload.modificationType,
                      modificationRequestId: payload.modificationRequestId,
                      ...(payload.modificationType === 'delai' && {
                        delayInMonths: payload.delayInMonths,
                      }),
                      ...(payload.modificationType === 'puissance' && {
                        puissance: payload.puissance,
                        unitePuissance: appelOffre?.unitePuissance,
                      }),
                      authority: payload.authority,
                    })
                  }
                  break
                case 'ModificationRequestAccepted':
                case 'ModificationRequestRejected':
                case 'ConfirmationRequested':
                  if (userIsNot('ademe')(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      modificationRequestId: payload.modificationRequestId,
                      file: payload.file,
                    })
                  }
                  break
                case 'ModificationRequestCancelled':
                case 'ModificationRequestInstructionStarted':
                case 'ModificationRequestConfirmed':
                  if (userIsNot('ademe')(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      modificationRequestId: payload.modificationRequestId,
                    })
                  }
                  break
                case 'ModificationReceived':
                  if (userIsNot('ademe')(user)) {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      modificationType: payload.modificationType,
                      ...(payload.modificationType === 'producteur' && {
                        producteur: payload.producteur,
                      }),
                      ...(payload.modificationType === 'actionnaire' && {
                        actionnaire: payload.actionnaire,
                      }),
                      ...(payload.modificationType === 'fournisseur' && {
                        fournisseurs: payload.fournisseurs,
                      }),
                      ...(payload.modificationType === 'puissance' && {
                        puissance: payload.puissance,
                        unitePuissance: appelOffre?.unitePuissance,
                      }),
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

function getIsGarantiesFinancieresDeposeesALaCandidature(
  appelOffreId: string,
  periodeId: string,
  familleId?: string
) {
  const appelOffre = getAppelOffre({ appelOffreId, periodeId, familleId })
  return appelOffre?.garantiesFinancieresDeposeesALaCandidature
}
