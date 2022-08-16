import { getProjectAppelOffre } from '@config/queries.config'
import { wrapInfra } from '@core/utils'
import { GetProjectEvents, ProjectEventDTO, ProjectStatus } from '@modules/frise'
import { userIs, userIsNot } from '@modules/users'
import { is } from 'date-fns/locale'
import routes from '../../../../routes'
import { models } from '../../models'
import {
  isProjectImportedPayload,
  isProjectCertificatePayload,
  isProjectClaimedPayload,
  ProjectEvent,
  isProjectImportedEvent,
} from '../../projectionsNext'

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
      const status: ProjectStatus = abandonedOn ? 'Abandonné' : classe
      const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

      return {
        project: {
          id: projectId,
          status,
          isSoumisAuxGF: appelOffre?.isSoumisAuxGFs,
          isGarantiesFinancieresDeposeesALaCandidature:
            appelOffre?.garantiesFinancieresDeposeesALaCandidature,
        },
        events: await rawEvents
          // .map((item) => item.get())
          .reduce<Promise<ProjectEventDTO[]>>(async (eventsPromise, projectEvent) => {
            const { type, valueDate, payload } = projectEvent
            const events: ProjectEventDTO[] = await eventsPromise

            if (isProjectImportedEvent(projectEvent)) {
              if (userIs(['admin', 'dgec'])(user)) {
                events.push({
                  type: projectEvent.type,
                  date: valueDate,
                  variant: user.role,
                })
              }
              if (userIsNot('ademe')(user)) {
                events.push({
                  type: 'ProjectNotified',
                  date: projectEvent.payload.notifiedOn,
                  variant: user.role,
                  isLegacy: true,
                })
              }
              return events
            }

            switch (type) {
              case 'ProjectNotified':
              case 'ProjectNotificationDateSet':
              case 'CovidDelayGranted':
                if (userIsNot('ademe')(user)) {
                  events.push({
                    type,
                    date: valueDate,
                    variant: user.role,
                  })
                }
                break
              case 'ProjectClaimed':
                if (userIsNot(['ademe'])(user) && isProjectClaimedPayload(payload)) {
                  events.push({
                    type,
                    potentielIdentifier,
                    email: userIs(['admin', 'dgec'])(user) ? email : undefined,
                    nomProjet,
                    date: valueDate,
                    variant: user.role,
                    certificateFileId: payload.attestationDesignationFileId,
                    claimedBy: payload.claimedBy,
                  })
                }
                break
              case 'ProjectCertificateGenerated':
              case 'ProjectCertificateRegenerated':
              case 'ProjectCertificateUpdated':
                if (userIsNot(['ademe'])(user) && isProjectCertificatePayload(payload)) {
                  events.push({
                    type,
                    potentielIdentifier,
                    email: userIs(['admin', 'dgec'])(user) ? email : undefined,
                    nomProjet,
                    date: valueDate,
                    variant: user.role,
                    certificateFileId: payload.certificateFileId,
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
                    ...((type === 'ProjectGFSubmitted' || type == 'ProjectGFUploaded') && {
                      expirationDate: payload.expirationDate,
                    }),
                    ...(type == 'ProjectGFUploaded' && {
                      uploadedByRole: payload.uploadedByRole,
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
                    ...(payload.delayInMonthsGranted && {
                      delayInMonthsGranted: payload.delayInMonthsGranted,
                    }),
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
                    modificationRequestId: payload.modificationRequestId,
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
              case 'LegacyModificationImported':
                if (userIsNot('ademe')(user)) {
                  const modificationType = payload.modificationType
                  const status = payload.status
                  const common = {
                    type,
                    date: valueDate,
                    variant: user.role,
                    modificationType,
                    status,
                    filename: payload.filename,
                  }
                  if (modificationType === 'delai') {
                    events.push({
                      ...common,
                      ...(status === 'acceptée' && {
                        ancienneDateLimiteAchevement: payload.ancienneDateLimiteAchevement,
                        nouvelleDateLimiteAchevement: payload.nouvelleDateLimiteAchevement,
                      }),
                    })
                  }
                  if (modificationType === 'actionnaire') {
                    events.push({
                      ...common,
                      actionnairePrecedent: payload.actionnairePrecedent,
                    })
                  }
                  if (modificationType === 'producteur') {
                    events.push({
                      ...common,
                      producteurPrecedent: payload.producteurPrecedent,
                    })
                  }
                  if (modificationType === 'abandon') {
                    events.push({ ...common })
                  }
                  if (modificationType === 'recours') {
                    events.push({ ...common, motifElimination: payload.motifElimination })
                  }
                  if (modificationType === 'autre') {
                    events.push({
                      ...common,
                      column: payload.column,
                      value: payload.value,
                    })
                  }
                }
                break
              case 'FileAttachedToProject':
                if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                  const { title, description, files, attachedBy, attachmentId } = payload
                  events.push({
                    type: 'FileAttachedToProject',
                    date: valueDate,
                    variant: user.role,
                    title,
                    description,
                    files,
                    isOwner: attachedBy?.id === user.id,
                    attachedBy,
                    attachmentId,
                    projectId,
                  })
                }
                break
              case 'LegacyModificationFileAttached':
                const { fileId, filename } = payload
                events.push({
                  type: 'LegacyModificationFileAttached',
                  variant: user.role,
                  file: {
                    id: fileId,
                    name: filename,
                  },
                })
                break

              case 'DemandeDelaiSignaled':
                if (userIsNot('ademe')(user)) {
                  const {
                    signaledBy,
                    status,
                    oldCompletionDueOn,
                    newCompletionDueOn,
                    attachment,
                    notes,
                  } = payload
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    signaledBy,
                    oldCompletionDueOn,
                    newCompletionDueOn,
                    status,
                    ...(userIs(['admin', 'dgec', 'dreal'])(user) && { notes }),
                    attachment,
                  })
                }
                break

              case 'DemandeAbandonSignaled':
                if (userIsNot('ademe')(user)) {
                  const { signaledBy, status, attachment, notes } = payload
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    signaledBy,
                    status,
                    ...(userIs(['admin', 'dgec', 'dreal'])(user) && { notes }),
                    attachment,
                  })
                }
                break

              case 'DemandeRecoursSignaled':
                if (userIsNot('ademe')(user)) {
                  const { signaledBy, status, attachment, notes } = payload
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    signaledBy,
                    status,
                    ...(userIs(['admin', 'dgec', 'dreal'])(user) && { notes }),
                    attachment,
                  })
                }
                break

              case 'DemandeDélai':
                if (userIsNot('ademe')(user)) {
                  const { statut, dateAchèvementDemandée, demandeDélaiId, authority } = payload
                  events.push({
                    type,
                    variant: user.role,
                    date: valueDate,
                    statut,
                    dateAchèvementDemandée,
                    ...(statut === 'accordée' && {
                      dateAchèvementAccordée: payload.dateAchèvementAccordée,
                      ancienneDateThéoriqueAchèvement: payload.ancienneDateThéoriqueAchèvement,
                    }),
                    ...((userIs(['porteur-projet', 'admin', 'dgec'])(user) ||
                      (userIs('dreal') && authority === 'dreal')) && {
                      demandeUrl: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
                    }),
                  })
                }
                break
            }

            return Promise.resolve(events)
          }, Promise.resolve([] as ProjectEventDTO[])),
      }
    })
}
function getEvents(projectId) {
  return wrapInfra(
    ProjectEvent.findAll({ where: { projectId }, order: [['eventPublishedAt', 'ASC']] })
  )
}
