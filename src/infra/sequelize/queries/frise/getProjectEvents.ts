import { getProjectAppelOffre } from '@config/queries.config'
import { or, ResultAsync, wrapInfra } from '@core/utils'
import { GetProjectEvents, ProjectEventDTO, ProjectStatus } from '@modules/frise'
import { userIs, userIsNot } from '@modules/users'
import { InfraNotAvailableError } from 'src/modules/shared'
import routes from '../../../../routes'
import { models } from '../../models'
import { isKnownProjectEvent, KnownProjectEvents, ProjectEvent } from '../../projectionsNext'

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
        events: await rawEvents.reduce<Promise<ProjectEventDTO[]>>(
          async (eventsPromise, projectEvent) => {
            const { type, valueDate, payload } = projectEvent
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
                if (userIsNot('ademe')(user)) {
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
                if (userIsNot(['ademe'])(user)) {
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
                if (userIsNot(['ademe'])(user)) {
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
                if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                  const { file } = payload
                  if (type === 'ProjectGFSubmitted') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      file: file && { id: file.id, name: file.name },
                      expirationDate: payload.expirationDate,
                    })
                  }
                }
                break
              case 'ProjectDCRSubmitted':
                if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                  const { file } = payload
                  if (type === 'ProjectDCRSubmitted') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      file: file && { id: file.id, name: file.name },
                      numeroDossier: payload.numeroDossier,
                    })
                  }
                }
                break
              case 'ProjectPTFSubmitted':
                if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                  const { file } = payload
                  if (type === 'ProjectPTFSubmitted') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      file: file && { id: file.id, name: file.name },
                    })
                  }
                }
                break
              case 'ProjectGFUploaded':
                if (userIs(['porteur-projet', 'admin', 'dgec', 'dreal'])(user)) {
                  const { file, uploadedByRole } = payload
                  if (type === 'ProjectGFUploaded') {
                    events.push({
                      type,
                      date: valueDate,
                      variant: user.role,
                      file: file && { id: file.id, name: file.name },
                      expirationDate: payload.expirationDate,
                      ...((uploadedByRole === 'porteur-projet' || uploadedByRole === 'dreal') && {
                        uploadedByRole,
                      }),
                    })
                  }
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
                  const { modificationType } = payload

                  switch (modificationType) {
                    case 'delai':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        delayInMonths: payload.delayInMonths,
                        authority: payload.authority,
                      })
                      break
                    case 'puissance':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        puissance: payload.puissance,
                        unitePuissance: appelOffre?.unitePuissance,
                        authority: payload.authority,
                      })
                      break
                    default:
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        authority: payload.authority,
                      })
                      break
                  }
                }
                break
              case 'ModificationRequestAccepted':
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
                  const { modificationType } = payload

                  switch (modificationType) {
                    case 'actionnaire':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        actionnaire: payload.actionnaire,
                      })
                      break
                    case 'fournisseur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        fournisseurs: payload.fournisseurs,
                      })
                      break
                    case 'producteur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        producteur: payload.producteur,
                      })
                      break
                    case 'puissance':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        modificationType: payload.modificationType,
                        modificationRequestId: payload.modificationRequestId,
                        puissance: payload.puissance,
                        unitePuissance: appelOffre?.unitePuissance,
                      })
                      break
                  }
                }
                break
              case 'LegacyModificationImported':
                if (userIsNot('ademe')(user)) {
                  const modificationType = payload.modificationType
                  const status = payload.status

                  switch (modificationType) {
                    case 'abandon':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                      })
                      break
                    case 'autre':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        column: payload.column,
                        value: payload.value,
                      })
                      break
                    case 'actionnaire':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        actionnairePrecedent: payload.actionnairePrecedent,
                      })
                      break
                    case 'delai':
                      if (status === 'acceptée') {
                        events.push({
                          type,
                          date: valueDate,
                          variant: user.role,
                          status,
                          filename: payload.filename,
                          modificationType,
                          ancienneDateLimiteAchevement: payload.ancienneDateLimiteAchevement,
                          nouvelleDateLimiteAchevement: payload.nouvelleDateLimiteAchevement,
                        })
                      }
                      break
                    case 'producteur':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        producteurPrecedent: payload.producteurPrecedent,
                      })
                      break
                    case 'recours':
                      events.push({
                        type,
                        date: valueDate,
                        variant: user.role,
                        status,
                        filename: payload.filename,
                        modificationType,
                        motifElimination: payload.motifElimination,
                      })
                      break
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
                    isOwner: attachedBy.id === user.id,
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
                    ...(status === 'acceptée'
                      ? {
                          status,
                          oldCompletionDueOn,
                          newCompletionDueOn,
                        }
                      : { status }),
                    ...(userIs(['admin', 'dgec', 'dreal'])(user) && { notes }),
                    attachment,
                  })
                }
                break

              case 'DemandeAbandonSignaled':
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
                    dateAchèvementDemandée,
                    ...(statut === 'accordée'
                      ? {
                          statut,
                          dateAchèvementAccordée: payload.dateAchèvementAccordée,
                          ancienneDateThéoriqueAchèvement: payload.ancienneDateThéoriqueAchèvement,
                        }
                      : { statut }),
                    ...((userIs(['porteur-projet', 'admin', 'dgec'])(user) ||
                      (userIs('dreal') && authority === 'dreal')) && {
                      demandeUrl: routes.DEMANDE_PAGE_DETAILS(demandeDélaiId),
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

const getEvents = (projectId): ResultAsync<Array<KnownProjectEvents>, InfraNotAvailableError> => {
  return wrapInfra(
    ProjectEvent.findAll({ where: { projectId }, order: [['eventPublishedAt', 'ASC']] })
  ).map((events) => events.filter(isKnownProjectEvent))
}
